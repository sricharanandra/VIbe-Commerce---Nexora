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

# Check if PostgreSQL is running
if ! pg_isready -q 2>/dev/null; then
    echo "Error: PostgreSQL is not running"
    echo "Start it with: sudo systemctl start postgresql"
    echo "Or on macOS: brew services start postgresql"
    exit 1
fi

echo "PostgreSQL is running"
echo ""

# Create database
echo "Creating database..."
psql -U postgres -c "DROP DATABASE IF EXISTS vibecommerce;" 2>/dev/null
psql -U postgres -c "CREATE DATABASE vibecommerce;"

if [ $? -ne 0 ]; then
    echo ""
    echo "Failed to create database with user 'postgres'"
    echo "Trying with current user..."
    createdb vibecommerce 2>/dev/null
    
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create database"
        echo "Please ensure PostgreSQL is configured correctly"
        exit 1
    fi
fi

echo "Database created successfully"
echo ""

# Install root dependencies
echo "Installing root dependencies..."
if [ -f "package.json" ]; then
    npm install
fi
echo ""

# Setup backend
echo "Setting up backend..."
cd backend || exit 1

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    if [ ! -f ".env.example" ]; then
        echo "Error: .env.example not found"
        exit 1
    fi
    cp .env.example .env
    
    # Try to detect the correct DATABASE_URL
    if psql -U postgres -l &>/dev/null; then
        sed -i 's|postgresql://localhost:5432/vibecommerce|postgresql://postgres@localhost:5432/vibecommerce|' .env
    fi
fi

echo "Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "Error: Failed to install backend dependencies"
    exit 1
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
cd ../frontend || exit 1

echo "Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "Error: Failed to install frontend dependencies"
    exit 1
fi

echo "Frontend setup complete"
echo ""

cd ..

echo "==================================="
echo "Setup complete!"
echo "==================================="
echo ""
echo "To start the application, run:"
echo "  npm start"
echo ""
echo "Or start servers individually:"
echo "  Backend:  cd backend && npm run dev"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""All done!"