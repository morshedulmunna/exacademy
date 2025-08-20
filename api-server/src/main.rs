use execute_academy;

fn main() {
    if dotenv::dotenv().is_err() {
        let _ = dotenv::from_filename(".env");
    }
    if let Err(e) = execute_academy::execute() {
        eprintln!("Error: {}", e);
        std::process::exit(1);
    }
}
