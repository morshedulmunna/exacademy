use serde::Deserialize;
use utoipa::ToSchema;
use validator::{Validate, ValidationError};

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct RegisterRequest {
    #[validate(length(min = 1, max = 50))]
    #[schema(min_length = 1, max_length = 50, nullable = true, example = "Jone")]
    pub first_name: Option<String>,

    #[validate(length(min = 1, max = 50))]
    #[schema(min_length = 1, max_length = 50, nullable = true, example = "Doe")]
    pub last_name: Option<String>,

    #[validate(length(min = 3, max = 30))]
    #[schema(
        min_length = 3,
        max_length = 30,
        pattern = "^[a-zA-Z0-9_]+$",
        example = "jone_doe",
        nullable = false
    )]
    pub username: String,

    #[validate(email)]
    #[schema(
        format = "email",
        nullable = false,
        example = "jone_doe@executeacademy.com"
    )]
    pub email: String,

    /// Password must be at least 8 characters, contain uppercase, lowercase, digit, and special character.
    #[validate(custom(function = "validate_strong_password"))]
    #[schema(
        min_length = 8,
        nullable = false,
        example = "Password123!",
        format = "password"
    )]
    pub password: String,
}

// ========================
// Auth route types
// ========================

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct LoginRequest {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 8))]
    pub password: String,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct RefreshRequest {
    #[validate(length(min = 1))]
    pub refresh_token: String,
}

// ========================
// Social login (OAuth)
// ========================

/// Google Sign-In using an ID token from Google.
#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct GoogleLoginRequest {
    #[validate(length(min = 10))]
    pub id_token: String,
}

/// GitHub OAuth login using an authorization code.
#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct GithubLoginRequest {
    #[validate(length(min = 10))]
    pub code: String,
}

// ========================
// Email verification (OTP)
// ========================

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct VerifyOtpRequest {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 6, max = 6))]
    pub code: String,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct ResendOtpRequest {
    #[validate(email)]
    pub email: String,
}

// ========================
// Password reset (OTP)
// ========================

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct ForgotPasswordRequest {
    #[validate(email)]
    pub email: String,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct ResetPasswordRequest {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 6, max = 6))]
    pub code: String,
    #[validate(length(min = 8))]
    pub new_password: String,
}

#[derive(Debug, Deserialize, ToSchema, Validate)]
pub struct UpdateUserRequest {
    #[validate(length(min = 3, max = 30))]
    pub username: Option<String>,
    #[validate(length(min = 1, max = 50))]
    pub first_name: Option<String>,
    #[validate(length(min = 1, max = 50))]
    pub last_name: Option<String>,
    #[validate(url)]
    pub avatar_url: Option<String>,
    #[validate(length(max = 280))]
    pub bio: Option<String>,
    pub date_of_birth: Option<chrono::NaiveDate>,
    pub gender: Option<String>,
    #[validate(length(min = 7, max = 20))]
    pub phone: Option<String>,
    #[validate(email)]
    pub secondary_email: Option<String>,
    #[validate(url)]
    pub website_url: Option<String>,
    #[validate(url)]
    pub github_url: Option<String>,
    #[validate(url)]
    pub twitter_url: Option<String>,
    #[validate(url)]
    pub linkedin_url: Option<String>,
    #[validate(url)]
    pub facebook_url: Option<String>,
    #[validate(url)]
    pub instagram_url: Option<String>,
    #[validate(url)]
    pub youtube_url: Option<String>,
    #[validate(length(max = 120))]
    pub address_line1: Option<String>,
    #[validate(length(max = 120))]
    pub address_line2: Option<String>,
    #[validate(length(max = 80))]
    pub city: Option<String>,
    #[validate(length(max = 80))]
    pub state: Option<String>,
    #[validate(length(max = 20))]
    pub postal_code: Option<String>,
    #[validate(length(max = 80))]
    pub country: Option<String>,
    #[validate(length(max = 10))]
    pub locale: Option<String>,
    #[validate(length(max = 50))]
    pub timezone: Option<String>,
    pub marketing_opt_in: Option<bool>,
}

/// Custom password validator that checks for:
/// - At least 8 characters
/// - Contains at least one uppercase letter
/// - Contains at least one lowercase letter  
/// - Contains at least one digit
/// - Contains at least one special character
fn validate_strong_password(password: &str) -> Result<(), ValidationError> {
    if password.len() < 8 {
        return Err(ValidationError::new(
            "Password must be at least 8 characters long",
        ));
    }

    let mut has_uppercase = false;
    let mut has_lowercase = false;
    let mut has_digit = false;
    let mut has_special = false;

    for ch in password.chars() {
        if ch.is_ascii_uppercase() {
            has_uppercase = true;
        } else if ch.is_ascii_lowercase() {
            has_lowercase = true;
        } else if ch.is_ascii_digit() {
            has_digit = true;
        } else if !ch.is_ascii_alphanumeric() {
            has_special = true;
        }

        // Early exit if all requirements are met
        if has_uppercase && has_lowercase && has_digit && has_special {
            break;
        }
    }

    if !has_uppercase {
        return Err(ValidationError::new(
            "Password must contain at least one uppercase letter",
        ));
    }

    if !has_lowercase {
        return Err(ValidationError::new(
            "Password must contain at least one lowercase letter",
        ));
    }

    if !has_digit {
        return Err(ValidationError::new(
            "Password must contain at least one digit",
        ));
    }

    if !has_special {
        return Err(ValidationError::new(
            "Password must contain at least one special character",
        ));
    }

    Ok(())
}
