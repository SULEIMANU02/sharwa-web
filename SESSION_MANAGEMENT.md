# Session Management Documentation

## Overview
The Next.js web app uses a custom session management system that mirrors the Expo mobile app's functionality. Instead of using Expo push notification tokens, the web app generates unique web tokens for session management.

## Key Features

### 1. Web Token Generation
- **Location**: `lib/sessionManager.js`
- **Function**: `generateWebToken()`
- Generates unique tokens in format: `web_{timestamp}_{randomString}`
- Replaces Expo push notification tokens for web sessions

### 2. Session Flow

#### First-Time Users
1. User visits app → Redirected to `/onboarding`
2. Completes onboarding → Redirected to `/` (Welcome page)
3. Creates account or logs in
4. Session created with web token
5. Token sent to backend
6. Redirected to `/dashboard`

#### Returning Users
1. User visits app → Checks for stored email
2. If email exists → Redirected to `/auth/passcode`
3. User enters password (re-authentication)
4. On success → Session updated, token sent to backend
5. Redirected to `/dashboard`

### 3. Session Storage

Session data is stored in localStorage with the following structure:

```javascript
{
  session: {
    token: "web_1234567890_abc123def456",
    user: {
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "1234567890",
      pin: "1234",
      accountNumber: "ACC123",
      role: "user"
    },
    createdAt: 1234567890000,
    lastActive: 1234567890000
  },
  token: "web_1234567890_abc123def456",
  email: "user@example.com",
  onboarded: "1",
  // Individual user fields for backward compatibility
  firstName: "John",
  lastName: "Doe",
  // ... etc
}
```

### 4. Session Validation

- Sessions are valid for 30 days from creation
- `isSessionValid()` checks session age
- `updateSessionActivity()` updates last active timestamp
- Called automatically in dashboard layout every minute

### 5. Key Functions

#### `createSession(userData, token)`
Creates a new session with user data and optional custom token.

#### `getSession()`
Retrieves current session from localStorage.

#### `clearSession()`
Removes all session data (logout).

#### `sendTokenToBackend(email)`
Sends the web token to backend API for registration.

#### `isSessionValid()`
Checks if current session is still valid (< 30 days old).

#### `updateSessionActivity()`
Updates the lastActive timestamp.

#### `completeOnboarding()`
Marks onboarding as complete.

#### `hasCompletedOnboarding()`
Checks if user has completed onboarding.

## Routing Logic

### Root Page (`/`)
```javascript
- Check if email exists in storage
  - Yes → Redirect to /auth/passcode
  - No → Check if onboarded
    - No → Redirect to /onboarding
    - Yes → Show welcome page
```

### Protected Routes (`/dashboard`, `/admin`)
```javascript
- AuthGuard checks session validity
  - Valid session → Allow access
  - Invalid but email exists → Redirect to /auth/passcode
  - No session, no email → Redirect to /auth/login
```

## Comparison with Expo App

| Feature | Expo App | Next.js Web App |
|---------|----------|-----------------|
| Token Type | Expo Push Notification Token | Custom Web Token |
| Storage | AsyncStorage | localStorage |
| Token Format | `ExponentPushToken[...]` | `web_{timestamp}_{random}` |
| Session Check | On app launch | On page load |
| Re-auth Screen | Passcode with biometric | Passcode (password only) |
| Session Duration | Indefinite (until logout) | 30 days |

## Backend Integration

The web token is sent to the backend using the same endpoint as the mobile app:

```javascript
POST https://sharwadata.com.ng/register/token
Body: {
  user_login: "user@example.com",
  token: "web_1234567890_abc123def456"
}
```

This ensures compatibility with the existing backend infrastructure.

## Security Considerations

1. **Token Uniqueness**: Each token includes timestamp and random strings
2. **Session Expiry**: 30-day automatic expiry
3. **Re-authentication**: Returning users must re-enter password
4. **Secure Storage**: Uses browser's localStorage (HTTPS recommended)
5. **Activity Tracking**: Last active timestamp updated regularly

## Usage Examples

### Creating a Session (Login)
```javascript
import { createSession, sendTokenToBackend } from '@/lib/sessionManager'

// After successful Firebase authentication
const userData = {
  email: user.email,
  firstName: data.firstname,
  lastName: data.lastname,
  // ... other fields
}

createSession(userData)
await sendTokenToBackend(user.email)
```

### Checking Session Status
```javascript
import { getSession, isSessionValid } from '@/lib/sessionManager'

const session = getSession()
if (session && isSessionValid()) {
  // User is authenticated
} else {
  // Redirect to login
}
```

### Logging Out
```javascript
import { clearSession } from '@/lib/sessionManager'
import { getAuth, signOut } from 'firebase/auth'

const auth = getAuth()
await signOut(auth)
clearSession()
router.push('/')
```

## Future Enhancements

1. **Refresh Tokens**: Implement token refresh mechanism
2. **Multi-device Support**: Track sessions across devices
3. **Session Analytics**: Track user activity patterns
4. **Biometric Support**: Add Web Authentication API for biometric login
5. **Remember Me**: Optional extended session duration