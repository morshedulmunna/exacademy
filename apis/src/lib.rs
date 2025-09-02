pub mod applications;
pub mod cmd;
pub mod configs;
pub mod interfaces;
pub mod pkg;
pub mod repositories;
pub mod types;
use crate::cmd::root::RootCommand;

pub fn execute() -> Result<(), Box<dyn std::error::Error>> {
    let root_cmd = RootCommand::new();
    root_cmd.run()
}
