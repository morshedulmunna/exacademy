//! Vimeo upload client
//!
//! Provides a minimal client to upload videos to Vimeo using the
//! "streaming" approach. This is simpler than TUS for moderate file sizes
//! and avoids a multi-step resumable protocol.

mod client;

pub use client::{VimeoClient, VimeoUploadResult};
