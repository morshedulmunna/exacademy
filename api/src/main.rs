use execute_academy;

fn main() {
    // Run the main application
    if let Err(e) = execute_academy::execute() {
        eprintln!("Error: {}", e);
        std::process::exit(1);
    }
}
