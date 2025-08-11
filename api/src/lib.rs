pub mod application;
pub mod cmd;
pub mod configs;
pub mod domain;
pub mod infrastructure;
pub mod interface;
pub mod pkg;
pub mod schemas;

use crate::cmd::root::RootCommand;

// Re-export global logger functions for easy access
pub use pkg::logger::{debug, error, info, warn};

pub fn execute() -> Result<(), Box<dyn std::error::Error>> {
    let root_cmd = RootCommand::new();
    root_cmd.run()
}
