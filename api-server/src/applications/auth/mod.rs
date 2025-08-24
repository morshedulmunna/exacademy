//! Auth application module split into focused files.
//! Exports keep the same public API as before.

mod github;
mod google;
mod login;
mod refresh;
mod register;
mod resend;
mod reset;
mod utils;
mod verify;

pub use github::github_login;
pub use google::google_login;
pub use login::login;
pub use refresh::refresh;
pub use register::register;
pub use resend::resend_otp;
pub use reset::{forgot_password, reset_password};
pub use verify::verify_otp;
