package main

import (
	"flag"
	"fmt"
	"os"
)

func main() {

	flag.CommandLine.SetOutput(os.Stdout)
	flag.Parse()

	name := flag.Arg(0)

	fmt.Printf("Hello %s\n", name)
}
