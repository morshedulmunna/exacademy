use regex::Regex;
use std::sync::OnceLock;

pub mod course_types;
pub mod user_types;

/// Password complexity regex: at least one uppercase, lowercase, digit, and special character
pub static PASSWORD_COMPLEXITY_REGEX: OnceLock<Regex> = OnceLock::new();

/// Get the password complexity regex, compiling it on first access
pub fn get_password_regex() -> &'static Regex {
    PASSWORD_COMPLEXITY_REGEX.get_or_init(|| {
        Regex::new(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$")
            .expect("Invalid password complexity regex")
    })
}
