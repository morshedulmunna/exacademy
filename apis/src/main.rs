use execute_academy;

fn main() {
    // Load environment variables with multiple fallback strategies
    load_env_vars();

    if let Err(e) = execute_academy::execute() {
        eprintln!("Error: {}", e);
        std::process::exit(1);
    }
}

fn load_env_vars() {
    println!("Current working directory: {:?}", std::env::current_dir());
    println!("Executable path: {:?}", std::env::current_exe());

    // Strategy 1: Try to load from current working directory with absolute path
    if let Ok(current_dir) = std::env::current_dir() {
        let env_path = current_dir.join(".env");
        println!("Trying to load from current directory: {:?}", env_path);
        if env_path.exists() {
            println!("File exists, attempting to load...");
            match dotenv::from_path(&env_path) {
                Ok(_) => {
                    println!("Successfully loaded .env from current directory");
                    return;
                }
                Err(e) => {
                    println!("Failed to load .env from current directory: {}", e);
                }
            }
        } else {
            println!("File does not exist at: {:?}", env_path);
        }
    }

    // Strategy 2: Try to load from current directory (dotenv default)
    match dotenv::dotenv() {
        Ok(_) => {
            println!("Loaded .env using dotenv::dotenv()");
            return;
        }
        Err(e) => {
            println!("Failed to load .env using dotenv::dotenv(): {}", e);
        }
    }

    // Strategy 3: Try to load from current working directory with explicit filename
    match dotenv::from_filename(".env") {
        Ok(_) => {
            println!("Loaded .env using dotenv::from_filename()");
            return;
        }
        Err(e) => {
            println!("Failed to load .env using dotenv::from_filename(): {}", e);
        }
    }

    println!("Warning: Could not load .env file from any location");
}
