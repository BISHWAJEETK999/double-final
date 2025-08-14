#!/bin/bash

echo "🚀 TTravel Hospitality - One-Click Deploy Script"
echo "================================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker detected"

# Create data directory for persistence
mkdir -p data

# Build and start the application
echo "🔨 Building and starting the application..."

if command -v docker-compose &> /dev/null; then
    docker-compose up --build -d
else
    docker compose up --build -d
fi

echo ""
echo "✅ Application deployed successfully!"
echo "🌐 Your travel booking platform is now running at: http://localhost:5000"
echo ""
echo "📋 Quick Commands:"
echo "  - View logs: docker-compose logs -f app"
echo "  - Stop app:  docker-compose down"
echo "  - Restart:   docker-compose restart"
echo ""
echo "🔐 Default admin login:"
echo "  - Username: admin"
echo "  - Password: Ttrave"
echo ""
echo "📁 Data is persisted in the './data' directory"