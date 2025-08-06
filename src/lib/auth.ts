import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { UserRole } from "@/lib/types";

// Custom adapter to handle username generation and fix getUserByAccount issues
const customPrismaAdapter = (prisma: any) => {
  const adapter = PrismaAdapter(prisma);

  return {
    ...adapter,
    async createUser(data: any) {
      // Check if user already exists by email
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      // If user exists, return the existing user (preserves role)
      if (existingUser) {
        return existingUser;
      }

      // Generate username from email for new users
      const emailUsername = data.email?.split("@")[0] || "";
      let username = emailUsername;
      let counter = 1;

      // Check if username exists and generate unique one
      while (true) {
        const existingUserWithUsername = await prisma.user.findUnique({
          where: { username },
        });
        if (!existingUserWithUsername) break;
        username = `${emailUsername}${counter}`;
        counter++;
      }

      // Map image to avatar and remove emailVerified if not needed
      const { image, emailVerified, ...userData } = data;

      // Create new user with generated username and mapped avatar
      return prisma.user.create({
        data: {
          ...userData,
          username,
          avatar: image || null,
        },
      });
    },
    async getUserByAccount(providerAccountId: any) {
      try {
        const account = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: providerAccountId.provider,
              providerAccountId: providerAccountId.providerAccountId,
            },
          },
          include: {
            user: true,
          },
        });

        // If account exists but user is null, clean up the orphaned account
        if (account && !account.user) {
          await prisma.account.delete({
            where: {
              id: account.id,
            },
          });
          return null;
        }

        return account?.user || null;
      } catch (error) {
        console.error("Error in getUserByAccount:", error);
        return null;
      }
    },
    async linkAccount(data: any) {
      try {
        return await prisma.account.create({
          data: {
            userId: data.userId,
            type: data.type,
            provider: data.provider,
            providerAccountId: data.providerAccountId,
            refresh_token: data.refresh_token,
            access_token: data.access_token,
            expires_at: data.expires_at,
            token_type: data.token_type,
            scope: data.scope,
            id_token: data.id_token,
            session_state: data.session_state,
          },
        });
      } catch (error) {
        console.error("Error in linkAccount:", error);
        throw error;
      }
    },
  };
};

export const authOptions: NextAuthOptions = {
  adapter: customPrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            return null;
          }

          // Only allow password authentication for users with passwords
          if (!user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            role: user.role as UserRole,
            avatar: user.avatar || undefined,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Ensure user role is preserved during sign-in
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { role: true },
        });

        if (dbUser) {
          // Update the user object with the role from database
          user.role = dbUser.role;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as UserRole;
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
