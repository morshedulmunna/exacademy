package session_test

import (
    "net/http"
    "net/http/httptest"
    "testing"
    "time"

    "execute_academy/pkg/shared/session"
    "execute_academy/pkg/shared/utils"
)

func TestSessionCreateGetDestroy(t *testing.T) {
    mgr := session.NewManager("sid", time.Hour, false)

    rr := httptest.NewRecorder()
    claims := &utils.UserClaims{UserID: "u1", Email: "u@example.com", Name: "User One", Role: "user", IsActive: true}
    sid, err := mgr.Create(rr, claims)
    if err != nil || sid == "" {
        t.Fatalf("expected session id, got err=%v sid=%q", err, sid)
    }

    // Ensure Set-Cookie written
    if c := rr.Result().Cookies(); len(c) == 0 {
        t.Fatalf("expected Set-Cookie header written")
    }

    // Build request carrying cookie
    req := httptest.NewRequest(http.MethodGet, "/", nil)
    req.AddCookie(&http.Cookie{Name: "sid", Value: sid})

    sess, ok := mgr.Get(req)
    if !ok || sess == nil || sess.User == nil || sess.User.Email != "u@example.com" {
        t.Fatalf("expected session retrievable; got ok=%v sess=%v", ok, sess)
    }

    // Destroy and ensure gone
    rr2 := httptest.NewRecorder()
    mgr.Destroy(rr2, req)

    if _, ok := mgr.Get(req); ok {
        t.Fatalf("expected session to be destroyed")
    }
}


