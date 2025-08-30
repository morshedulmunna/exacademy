// Re-export items from submodules to keep public API stable
pub mod security;
pub mod security_services;

// Surface core security functions and types at `crate::pkg::security::*`
pub use security::{
    Claims, build_access_claims, hash_password, sign_jwt, verify_jwt, verify_password,
};
