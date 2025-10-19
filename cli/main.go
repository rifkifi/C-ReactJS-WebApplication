package main

import (
	"bytes"
	"crypto/tls"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

func main() {
	method := flag.String("X", "GET", "HTTP method (GET, POST, PUT, PATCH, DELETE)")
	url := flag.String("url", "", "Request URL (required)")
	auth := flag.String("auth", "", "Bearer token (optional)")
	data := flag.String("d", "", "Inline JSON body (e.g. '{\"name\":\"foo\"}')")
	dataFile := flag.String("data-file", "", "Path to JSON file to use as body")
	ct := flag.String("H-Content-Type", "application/json", "Content-Type header for body requests")
	insecure := flag.Bool("k", false, "Allow insecure TLS (self-signed localhost)")
	timeout := flag.Duration("t", 10*time.Second, "Request timeout")
	flag.Parse()

	if *url == "" {
		fmt.Fprintln(os.Stderr, "Error: -url is required")
		flag.Usage()
		os.Exit(2)
	}

	var bodyReader io.Reader
	if *data != "" {
		bodyReader = bytes.NewBufferString(*data)
	} else if *dataFile != "" {
		b, err := os.ReadFile(*dataFile)
		if err != nil {
			fmt.Fprintln(os.Stderr, "read data-file:", err)
			os.Exit(1)
		}
		bodyReader = bytes.NewBuffer(b)
	}

	tr := &http.Transport{}
	if *insecure {
		tr.TLSClientConfig = &tls.Config{InsecureSkipVerify: true} // dev-only
	}
	client := &http.Client{Timeout: *timeout, Transport: tr}

	req, err := http.NewRequest(*method, *url, bodyReader)
	if err != nil {
		fmt.Fprintln(os.Stderr, "new request:", err)
		os.Exit(1)
	}

	if *auth != "" {
		req.Header.Set("Authorization", "Bearer "+*auth)
	}

	if bodyReader != nil && *ct != "" {
		req.Header.Set("Content-Type", *ct)
	}

	resp, err := client.Do(req)
	if err != nil {
		fmt.Fprintln(os.Stderr, "request failed:", err)
		os.Exit(1)
	}
	defer resp.Body.Close()

	b, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Fprintln(os.Stderr, "read body:", err)
		os.Exit(1)
	}

	fmt.Println("Status:", resp.Status)
	fmt.Println(string(b))
}
