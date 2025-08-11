use crate::interface::http::server::start_default_server;

pub async fn apis_command() -> Result<(), Box<dyn std::error::Error>> {
    start_default_server().await?;
    Ok(())
}
