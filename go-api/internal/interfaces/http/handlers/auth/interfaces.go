package auth

import "net/http"

// AuthHTTPHandler defines the contract for authentication related HTTP handlers.
// Implementations should be stateless and safe for concurrent use by the HTTP server.
type AuthHTTPHandler interface {
	// Register handles user registration requests.
	Register(w http.ResponseWriter, r *http.Request)
	// Login handles user login requests.
	Login(w http.ResponseWriter, r *http.Request)
	// Me returns the profile information of the authenticated user.
	Me(w http.ResponseWriter, r *http.Request)
	// Logout terminates the authenticated user's session.
	Logout(w http.ResponseWriter, r *http.Request)
	// Google OAuth start of flow: redirects to Google's consent screen
	GoogleLogin(w http.ResponseWriter, r *http.Request)
	// Google OAuth callback: exchanges code, creates session, and redirects to app
	GoogleCallback(w http.ResponseWriter, r *http.Request)
}

// UserHTTPHandler defines the contract for user profile management HTTP handlers.
// Implementations should validate inputs and restrict updates to allowed fields only.
type UserHTTPHandler interface {
	// UpdateProfile modifies editable profile fields for the authenticated user.
	UpdateProfile(w http.ResponseWriter, r *http.Request)
	// SoftDelete deactivates the user's account without permanent deletion.
	SoftDelete(w http.ResponseWriter, r *http.Request)
}
