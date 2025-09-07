use crate::interfaces::grpc;

/// Start the gRPC server for course activity streaming
pub async fn grpc_command() -> Result<(), Box<dyn std::error::Error>> {
    grpc::run().await
}
