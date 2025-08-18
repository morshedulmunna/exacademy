package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var RootCmd = &cobra.Command{
	Use:   "master-service",
	Short: "Master service for tutors plan",
}

func init() {
	RootCmd.AddCommand(serveRestCmd)
	RootCmd.AddCommand(migrateCmd)
	RootCmd.AddCommand(serveGrpcCmd)
}

func Execute() {
	if err := RootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
