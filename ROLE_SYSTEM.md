# Role-Based Authentication System

This document explains how the role-based authentication system works in your Next.js application.

## Overview

The application now supports two user roles:

- **USER** (default): Regular users who can view content and manage their profile
- **ADMIN**: Administrators who can create, edit, and manage blog posts, courses, and tags

## Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String
  username  String   @unique
  password  String?
  role      Role     @default(USER)  // NEW: Role field
  bio       String?
  avatar    String?
  website   String?
  location  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // ... relations
}

enum Role {
  USER
  ADMIN
}
```

## Authentication Flow

1. **User Registration**: New users are automatically assigned the `USER` role
2. **Login**: Users can log in via email/password or OAuth (Google, GitHub)
3. **Role Check**: The system checks the user's role for protected routes and actions
4. **Access Control**: Admin-only features are restricted to users with `ADMIN` role

## Protected Routes

### Admin-Only Routes

- `/admin-handler` - Main admin dashboard
- `/admin-handler/posts` - Manage blog posts
- `/admin-handler/courses` - Manage courses (future)
- `/admin-handler/tags` - Manage tags (future)

### API Endpoints

- `POST /api/posts` - Create new posts (admin only)
- `PUT /api/posts/[id]` - Update posts (admin only)
- `DELETE /api/posts/[id]` - Delete posts (admin only)
- `POST /api/tags` - Create new tags (admin only)

## Utility Functions

### Server-Side Functions (`src/lib/auth-utils.ts`)

```typescript
// Get current user
const user = await getCurrentUser();

// Check if user is admin
const isAdminUser = await isAdmin();

// Check specific role
const hasUserRole = await hasRole("USER");

// Check multiple roles
const hasAnyRole = await hasAnyRole(["ADMIN", "MODERATOR"]);

// Require authentication (throws error if not authenticated)
const user = await requireAuth();

// Require admin role (throws error if not admin)
const admin = await requireAdmin();

// Require specific role (throws error if not matching)
const admin = await requireRole("ADMIN");
```

### Client-Side Usage

```typescript
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session } = useSession();

  if (session?.user?.role === "ADMIN") {
    return <AdminOnlyContent />;
  }

  return <RegularUserContent />;
}
```

## Setting Admin Role

### Using the Script

1. **List all users:**

   ```bash
   npx tsx scripts/set-admin-role.ts list
   ```

2. **Set a user as admin:**
   ```bash
   npx tsx scripts/set-admin-role.ts set-admin user@example.com
   ```

### Manual Database Update

You can also manually update a user's role in your database:

```javascript
// Using Prisma Studio
npx prisma studio

// Or using MongoDB directly
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "ADMIN" } }
)
```

## Middleware Protection

The application uses Next.js middleware to protect admin routes:

```typescript
// src/middleware.ts
const adminRoutes = ["/admin-handler", "/api/posts", "/api/tags"];

// Check if the current path requires admin access
const isAdminRoute = adminRoutes.some((route) => path.startsWith(route) && req.method !== "GET");

if (isAdminRoute && token?.role !== "ADMIN") {
  // Redirect non-admin users to dashboard
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
```

## Admin Dashboard Features

### Main Dashboard (`/admin-handler`)

- Overview statistics (total posts, users, etc.)
- Quick access to management tools
- Recent activity feed

### Posts Management (`/admin-handler/posts`)

- View all posts with status indicators
- Create new posts
- Edit existing posts
- Delete posts
- Publish/unpublish posts
- Feature/unfeature posts

### Future Features

- Course management
- Tag management
- User management
- Analytics dashboard

## Security Considerations

1. **Server-Side Validation**: All role checks are performed server-side
2. **Middleware Protection**: Routes are protected at the middleware level
3. **API Protection**: All admin API endpoints require admin role
4. **Session Management**: Roles are included in the session token
5. **Error Handling**: Proper error messages for unauthorized access

## Testing the System

1. **Create a regular user account**
2. **Try accessing admin routes** - should be redirected
3. **Set the user as admin** using the script
4. **Log in again** - should now have access to admin features
5. **Test admin functionality** - create posts, manage content

## Troubleshooting

### Common Issues

1. **"Role not found" error**: Make sure you've run the database migration
2. **Admin links not showing**: Check if the user's role is set to "ADMIN"
3. **Access denied errors**: Verify the user is authenticated and has the correct role
4. **Session not updating**: Try logging out and back in after role changes

### Debug Commands

```bash
# Check database schema
npx prisma db pull

# Generate Prisma client
npx prisma generate

# View database in browser
npx prisma studio

# List all users and their roles
npx tsx scripts/set-admin-role.ts list
```

## Future Enhancements

- Role-based permissions (granular permissions)
- User management interface
- Audit logs for admin actions
- Role inheritance system
- Temporary admin access
- Multi-tenant role system
