package cmd

import (
	"skoolz/internal/interfaces/grpc"

	"github.com/spf13/cobra"
)

var serveGrpcCmd = &cobra.Command{
	Use:   "serve-grpc",
	Short: "Serve the gRPC API",
	RunE:  serveGrpc,
}

func serveGrpc(cmd *cobra.Command, args []string) error {

	server := grpc.NewServer()
	return server.Start()
}
