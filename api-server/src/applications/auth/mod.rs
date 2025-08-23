//! Auth application module split into focused files.
//! Exports keep the same public API as before.

mod login;
mod refresh;
mod register;
mod resend;
mod utils;
mod verify;

pub use login::login;
pub use refresh::refresh;
pub use register::register;
pub use resend::resend_otp;
pub use verify::verify_otp;
