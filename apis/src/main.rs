use execute_academy;

fn main() {
    // Load environment variables with better error handling
    load_env_vars();

    if let Err(e) = execute_academy::execute() {
        eprintln!("Error: {}", e);
        std::process::exit(1);
    }
}

/// Load environment variables from .env file with fallback to example.env
fn load_env_vars() {
    // Get the current directory and try to find .env files
    let current_dir = std::env::current_dir().unwrap_or_else(|_| std::path::PathBuf::from("."));

    // Try to load .env from current directory
    let env_path = current_dir.join(".env");
    if env_path.exists() {
        if dotenv::from_path(&env_path).is_ok() {
            return;
        }
    }

    // Try the default dotenv behavior (searches up the directory tree)
    if dotenv::dotenv().is_ok() {
        return;
    }

    // Fallback to example.env if .env doesn't exist
    let example_env_path = current_dir.join("example.env");
    if example_env_path.exists() {
        if dotenv::from_path(&example_env_path).is_ok() {
            return;
        }
    }

    // If neither file exists, continue silently (environment variables might be set externally)
}
