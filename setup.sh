#!/bin/bash

echo "==================================="
echo "Vibe Commerce Setup Script"
echo "==================================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "Error: PostgreSQL is not installed"
    echo "Please install PostgreSQL and try again"
    exit 1
fi

echo "PostgreSQL found"
echo ""

# Create database
echo "Creating database..."
psql -U postgres -c "DROP DATABASE IF EXISTS vibecommerce;" 2>/dev/null
psql -U postgres -c "CREATE DATABASE vibecommerce;"

if [ $? -ne 0 ]; then
    echo "Error: Failed to create database"
    echo "Make sure PostgreSQL is running and you have the correct permissions"
    exit 1
fi

echo "Database created successfully"
echo ""

# Setup backend
echo "Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    # Update DATABASE_URL if needed
    sed -i 's|postgresql://localhost:5432/vibecommerce|postgresql://postgres@localhost:5432/vibecommerce|' .env
fi

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

echo "Setting up database schema and seed data..."
npm run db:setup

if [ $? -ne 0 ]; then
    echo "Error: Failed to setup database"
    exit 1
fi

echo "Backend setup complete"
echo ""

# Setup frontend
echo "Setting up frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo "Frontend setup complete"
echo ""

echo "==================================="
echo "Setup complete!"
echo "==================================="
echo ""
echo "To start the application:"
echo "1. Start backend:  cd backend && npm run dev"
echo "2. Start frontend: cd frontend && npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
