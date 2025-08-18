package session

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"sync"
	"time"

	"execute_academy/pkg/shared/utils"
)

// Manager manages user sessions in memory using secure random IDs stored in HTTP-only cookies.
// Note: This in-memory store is per-process and not shared across instances. For horizontal scaling,
// replace with a distributed store.
type Manager struct {
	store          map[string]*Session
	mu             sync.RWMutex
	cookieName     string
	cookieTTL      time.Duration
	cookiePath     string
	cookieSecure   bool
	cookieSameSite http.SameSite
}

// Session holds session state for an authenticated user.
type Session struct {
	ID        string
	User      *utils.UserClaims
	ExpiresAt time.Time
}

// NewManager creates a new in-memory session manager.
func NewManager(cookieName string, ttl time.Duration, secure bool) *Manager {
	return &Manager{
		store:          make(map[string]*Session),
		cookieName:     cookieName,
		cookieTTL:      ttl,
		cookiePath:     "/",
		cookieSecure:   secure,
		cookieSameSite: http.SameSiteLaxMode,
	}
}

// Create issues a new session for the given user and sets the cookie on response.
func (m *Manager) Create(w http.ResponseWriter, user *utils.UserClaims) (string, error) {
	ssid, err := generateSessionID()
	if err != nil {
		return "", err
	}
	s := &Session{ID: ssid, User: user, ExpiresAt: time.Now().Add(m.cookieTTL)}
	m.mu.Lock()
	m.store[ssid] = s
	m.mu.Unlock()

	http.SetCookie(w, &http.Cookie{
		Name:     m.cookieName,
		Value:    ssid,
		Path:     m.cookiePath,
		Expires:  s.ExpiresAt,
		MaxAge:   int(m.cookieTTL.Seconds()),
		HttpOnly: true,
		Secure:   m.cookieSecure,
		SameSite: m.cookieSameSite,
	})
	return ssid, nil
}

// Get retrieves a valid non-expired session from the request cookie.
func (m *Manager) Get(r *http.Request) (*Session, bool) {
	c, err := r.Cookie(m.cookieName)
	if err != nil || c == nil || c.Value == "" {
		return nil, false
	}
	m.mu.RLock()
	s, ok := m.store[c.Value]
	m.mu.RUnlock()
	if !ok {
		return nil, false
	}
	if time.Now().After(s.ExpiresAt) {
		return nil, false
	}
	return s, true
}

// Destroy removes session and clears cookie on the client.
func (m *Manager) Destroy(w http.ResponseWriter, r *http.Request) {
	c, err := r.Cookie(m.cookieName)
	if err == nil && c != nil {
		m.mu.Lock()
		delete(m.store, c.Value)
		m.mu.Unlock()
	}
	// Overwrite cookie
	http.SetCookie(w, &http.Cookie{
		Name:     m.cookieName,
		Value:    "",
		Path:     m.cookiePath,
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   m.cookieSecure,
		SameSite: m.cookieSameSite,
	})
}

func generateSessionID() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
