# OAuth Setup Guide

This guide will help you set up Google and GitHub OAuth providers for your Next.js application.

## Prerequisites

- A Google account
- A GitHub account
- Your application running on a domain (localhost for development)

## Google OAuth Setup

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

### 2. Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name
   - User support email
   - Developer contact information
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (your email) if in testing mode

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Copy the Client ID and Client Secret

### 4. Add to Environment Variables

Add these to your `.env.local` file:

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## GitHub OAuth Setup

### 1. Create a GitHub OAuth App

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: Your app name
   - Homepage URL: `http://localhost:3000` (for development)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the Client ID and Client Secret

### 2. Add to Environment Variables

Add these to your `.env.local` file:

```env
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

## Environment Variables

Make sure your `.env.local` file includes all necessary variables:

```env
# Database Configuration
DATABASE_URL="your-mongodb-connection-string"

# Application Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

## Database Setup

The OAuth system requires additional database tables. Run the following command to update your database schema:

```bash
npx prisma db push
```

## Testing

1. Start your development server: `npm run dev`
2. Navigate to `/login` or `/register`
3. Try signing in with Google or GitHub
4. Check that users are created in your database

## Production Deployment

When deploying to production:

1. Update the redirect URIs in both Google and GitHub OAuth apps
2. Use your production domain instead of localhost
3. Update environment variables with production values
4. Ensure your database is accessible from your production environment

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**: Make sure the redirect URI in your OAuth app matches exactly with what NextAuth expects
2. **"Client ID not found" error**: Verify your environment variables are correctly set
3. **Database connection issues**: Ensure your MongoDB connection string is correct and the database is accessible

### Debug Mode

To enable debug mode, add this to your environment variables:

```env
DEBUG=next-auth:*
```

## Security Notes

- Never commit your OAuth secrets to version control
- Use strong, unique secrets for production
- Regularly rotate your OAuth secrets
- Monitor your OAuth app usage and permissions
