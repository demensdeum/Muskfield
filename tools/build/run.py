#!/usr/bin/env python3

import os
import http.server
import socketserver
import subprocess
import shutil
from typing import List

def run(command: List[str]):
    try:
        subprocess.run(command, shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"An error occurred! Exit code: {e.returncode}")
        exit(e.returncode)

print("Clean...")
shutil.rmtree("dist")

print("Typescript...")
run(['npx', 'tsc'])

print("Deploy...")
shutil.copyfile("./src/html/index.html", "./dist/index.html")
shutil.copyfile("./src/html/style.css", "./dist/style.css")
shutil.copyfile("./assets/com.demensdeum.company.logo.texture.svg", "./dist/com.demensdeum.company.logo.texture.svg")
shutil.copyfile("./external-libs/eruda/eruda.js", "./dist/eruda.js")

print("Starting HTTP server at http://localhost:8000 ...")
os.chdir("dist")
handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", 8000), handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
