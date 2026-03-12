# DevSecOps Pipeline Lab

![Security](https://github.com/varshanroshan/Pipeline-DevSecOps/workflows/DevSecOps%20Pipeline/badge.svg)

This repository contains a Node.js application demonstrating a complete DevSecOps pipeline using GitHub Actions.

## 🚀 Setup & Execution

### Prerequisites
- Node.js 22+
- Docker
- Git

### Local Setup
1. Clone the repository: `git clone https://github.com/varshanroshan/Pipeline-DevSecOps.git`
2. Install dependencies: `cd src && npm install`
3. Copy `.env.example` to `.env` and configure securely.
4. Run the application: `npm start`

### Docker Setup
1. Build the image: `docker build -t secure-app .`
2. Run the container: `docker run -p 3000:3000 secure-app`

## 🛡️ Security Features
- **SAST (Static Application Security Testing)**: Semgrep scans for hardcoded secrets, SQLi, XSS.
- **SCA (Software Composition Analysis)**: `npm audit` checks third-party dependencies for known CVEs.
- **Secrets Detection**: Gitleaks scans throughout the commit history for accidentally leaked credentials.
- **Container Scanning**: Trivy scans the Docker image for OS and package vulnerabilities.
- **Application Security**: Implemented Helmet for HTTP headers, express-rate-limit to prevent brute-force attacks, and express-validator for strict input validation.
- **Secure Dockerfile**: Runs on Alpine Linux using a non-root user `nodejs`.

## ⚙️ GitHub Actions
The CI/CD pipeline runs on every `push` and `pull_request` to the `main` branch. It strictly enforces that **zero critical vulnerabilities** exist before succeeding.
