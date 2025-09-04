use async_graphql::InputObject;
use validator::Validate;

/// Input for user registration
#[derive(Debug, InputObject, Validate)]
pub struct RegisterInput {
    #[validate(length(min = 1, max = 50))]
    pub first_name: Option<String>,

    #[validate(length(min = 1, max = 50))]
    pub last_name: Option<String>,

    #[validate(length(min = 3, max = 30))]
    pub username: String,

    #[validate(email)]
    pub email: String,

    /// Password must be at least 8 characters, contain uppercase, lowercase, digit, and special character.
    #[validate(custom(function = "validate_strong_password"))]
    pub password: String,
}

/// Input for user login
#[derive(Debug, InputObject, Validate)]
pub struct LoginInput {
    #[validate(email)]
    pub email: String,

    #[validate(length(min = 8))]
    pub password: String,
}

/// Input for token refresh
#[derive(Debug, InputObject, Validate)]
pub struct RefreshInput {
    #[validate(length(min = 1))]
    pub refresh_token: String,
}

/// Input for Google OAuth login
#[derive(Debug, InputObject, Validate)]
pub struct GoogleLoginInput {
    #[validate(length(min = 10))]
    pub id_token: String,
}

/// Input for GitHub OAuth login
#[derive(Debug, InputObject, Validate)]
pub struct GithubLoginInput {
    #[validate(length(min = 10))]
    pub code: String,
}

/// Input for OTP verification
#[derive(Debug, InputObject, Validate)]
pub struct VerifyOtpInput {
    #[validate(email)]
    pub email: String,

    #[validate(length(min = 6, max = 6))]
    pub code: String,
}

/// Input for resending OTP
#[derive(Debug, InputObject, Validate)]
pub struct ResendOtpInput {
    #[validate(email)]
    pub email: String,
}

/// Input for forgot password
#[derive(Debug, InputObject, Validate)]
pub struct ForgotPasswordInput {
    #[validate(email)]
    pub email: String,
}

/// Input for password reset
#[derive(Debug, InputObject, Validate)]
pub struct ResetPasswordInput {
    #[validate(email)]
    pub email: String,

    #[validate(length(min = 6, max = 6))]
    pub code: String,

    #[validate(length(min = 8))]
    pub new_password: String,
}

/// Custom password validator that checks for:
/// - At least 8 characters
/// - Contains at least one uppercase letter
/// - Contains at least one lowercase letter  
/// - Contains at least one digit
/// - Contains at least one special character
fn validate_strong_password(password: &str) -> Result<(), validator::ValidationError> {
    if password.len() < 8 {
        return Err(validator::ValidationError::new(
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
        return Err(validator::ValidationError::new(
            "Password must contain at least one uppercase letter",
        ));
    }

    if !has_lowercase {
        return Err(validator::ValidationError::new(
            "Password must contain at least one lowercase letter",
        ));
    }

    if !has_digit {
        return Err(validator::ValidationError::new(
            "Password must contain at least one digit",
        ));
    }

    if !has_special {
        return Err(validator::ValidationError::new(
            "Password must contain at least one special character",
        ));
    }

    Ok(())
}
