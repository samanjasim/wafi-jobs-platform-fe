#!/bin/bash

# AlWafi Jobs Platform Frontend Deployment Script
# This script builds and deploys the frontend application

set -e

echo "🚀 Starting AlWafi Jobs Platform Frontend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed."
    exit 1
fi

print_status "npm version: $(npm -v)"

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.cache/

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run linting
print_status "Running ESLint..."
npm run lint || {
    print_warning "ESLint found issues. Continuing with build..."
}

# Run TypeScript type checking
print_status "Running TypeScript type checking..."
npx tsc --noEmit || {
    print_error "TypeScript compilation failed."
    exit 1
}

# Build the application
print_status "Building the application..."
npm run build

# Verify build output
if [ ! -d "dist" ]; then
    print_error "Build failed. dist directory not found."
    exit 1
fi

print_status "Build completed successfully!"

# Optional: Run preview server
read -p "Do you want to preview the build locally? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Starting preview server..."
    npm run preview
fi

print_status "Deployment preparation completed!"
echo -e "${GREEN}🎉 The application is ready for deployment!${NC}"
echo
echo "Next steps:"
echo "1. Upload the 'dist' folder to your web server"
echo "2. Configure your web server to serve the application"
echo "3. Set up proper environment variables"
echo "4. Configure SSL/HTTPS if needed"
echo
echo "For more information, check the README.md file."
