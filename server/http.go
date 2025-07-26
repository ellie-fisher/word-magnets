/**
 * Copyright (C) 2025 Ellie Fisher
 *
 * This file is part of the Word Magnets source code. It may be used under the GNU Affero General Public License v3.0.
 *
 * For full terms, see the LICENSE file or visit https://spdx.org/licenses/AGPL-3.0-or-later.html
 */

package main

import (
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

// Simple, reusable template for error pages.
const errorPageTemplate = `
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>{{}}</title>
	</head>
	<body>
		<h1>{{}}</h1>
	</body>
	</html>
`

// sendErrorPage sends the filled error page template.
func sendErrorPage(writer http.ResponseWriter, _ *http.Request, statusCode int, desc string) {
	desc = strconv.Itoa(statusCode) + " - " + desc

	writer.WriteHeader(statusCode)
	writer.Write([]byte(strings.ReplaceAll(errorPageTemplate, "{{}}", desc)))
}

// httpHandler is a basic HTTP handler for serving files.
func httpHandler(writer http.ResponseWriter, req *http.Request) {
	method := req.Method

	if method != "GET" {
		return
	}

	path := req.URL.Path

	if path == "/" {
		path = "index.html"
	}

	if strings.Contains(path, "../") || strings.Contains(path, "/..") {
		sendErrorPage(writer, req, 404, "Not Found")
	} else if bytes, err := os.ReadFile(filepath.Join("../client/", path)); err != nil {
		status := 500
		desc := "Internal Server Error"

		if os.IsNotExist(err) {
			status = 404
			desc = "Not Found"
		}

		sendErrorPage(writer, req, status, desc)
	} else {
		ext := filepath.Ext(path)

		writer.Header().Set("Content-Type", mime.TypeByExtension(ext))
		writer.WriteHeader(200)
		writer.Write(bytes)
	}
}
