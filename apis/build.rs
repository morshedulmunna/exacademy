use std::path::Path;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let proto_dir = "proto";
    let proto_files = ["proto/course_activity.proto"];

    // Check if proto directory exists
    if !Path::new(proto_dir).exists() {
        println!("cargo:warning=Proto directory not found, skipping gRPC code generation");
        return Ok(());
    }

    // Generate Rust code from protobuf definitions
    tonic_build::configure()
        .build_server(true)
        .build_client(true)
        .compile_protos(&proto_files, &[proto_dir])?;

    // Re-run build script if proto files change
    for proto_file in &proto_files {
        println!("cargo:rerun-if-changed={}", proto_file);
    }

    Ok(())
}
