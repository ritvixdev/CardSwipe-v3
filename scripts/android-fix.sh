#!/bin/bash

# Android Expo Fix Script
# Fixes common Android connectivity issues with Expo Go

echo "🔧 SwipeLearn JS - Android Fix Script"
echo "======================================"

# Function to display menu
show_menu() {
    echo ""
    echo "Select a fix option:"
    echo "1) Clear cache and restart (Quick fix)"
    echo "2) Start with tunnel mode (Network issues)"
    echo "3) Start with LAN mode (Local network)"
    echo "4) Update dependencies (Compatibility)"
    echo "5) Reset project completely (Nuclear option)"
    echo "6) Check system status"
    echo "0) Exit"
    echo ""
}

# Function to clear cache and restart
clear_cache_restart() {
    echo "🧹 Clearing cache and restarting..."
    
    # Kill any existing Metro processes
    pkill -f "metro" 2>/dev/null || true
    
    # Clear Metro cache
    npx react-native start --reset-cache &
    METRO_PID=$!
    sleep 2
    kill $METRO_PID 2>/dev/null || true
    
    # Start with clear cache
    echo "Starting Expo with cleared cache..."
    npx expo start --clear
}

# Function to start with tunnel
start_tunnel() {
    echo "🌐 Starting with tunnel mode..."
    echo "This creates a public URL that works across networks"
    npx expo start --tunnel
}

# Function to start with LAN
start_lan() {
    echo "📡 Starting with LAN mode..."
    echo "Make sure both devices are on the same WiFi network"
    npx expo start --lan
}

# Function to update dependencies
update_deps() {
    echo "📦 Updating dependencies..."
    
    # Update React Native and related packages
    npm update react-native@0.79.2
    npm update react-native-safe-area-context@5.4.0
    npm update jest-expo@53.0.5
    
    # Clear cache after update
    rm -rf node_modules/.cache
    npx expo start --clear
}

# Function to reset project
reset_project() {
    echo "💥 Resetting project completely..."
    echo "⚠️  This will remove node_modules and reinstall everything"
    
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Removing node_modules..."
        rm -rf node_modules
        rm -f package-lock.json
        rm -f yarn.lock
        
        echo "Reinstalling dependencies..."
        npm install
        
        echo "Starting with clear cache..."
        npx expo start --clear
    else
        echo "Reset cancelled."
    fi
}

# Function to check system status
check_status() {
    echo "🔍 System Status Check"
    echo "====================="
    
    echo "Node.js version: $(node --version)"
    echo "npm version: $(npm --version)"
    echo "Expo CLI version: $(npx expo --version)"
    
    echo ""
    echo "Network connectivity:"
    if ping -c 1 google.com &> /dev/null; then
        echo "✅ Internet connection: OK"
    else
        echo "❌ Internet connection: FAILED"
    fi
    
    echo ""
    echo "Project dependencies:"
    if [ -d "node_modules" ]; then
        echo "✅ node_modules: EXISTS"
    else
        echo "❌ node_modules: MISSING (run npm install)"
    fi
    
    if [ -f "package.json" ]; then
        echo "✅ package.json: EXISTS"
    else
        echo "❌ package.json: MISSING"
    fi
    
    echo ""
    echo "Expo configuration:"
    if [ -f "app.json" ]; then
        echo "✅ app.json: EXISTS"
    else
        echo "❌ app.json: MISSING"
    fi
    
    echo ""
    echo "Common ports:"
    if lsof -i :8081 &> /dev/null; then
        echo "⚠️  Port 8081: IN USE"
        echo "   Process using port 8081:"
        lsof -i :8081
    else
        echo "✅ Port 8081: AVAILABLE"
    fi
}

# Main script logic
main() {
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        echo "❌ Error: package.json not found"
        echo "Please run this script from the project root directory"
        exit 1
    fi
    
    # Check if this is the SwipeLearn JS project
    if ! grep -q "swipelearn-js" package.json; then
        echo "⚠️  Warning: This doesn't appear to be the SwipeLearn JS project"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    while true; do
        show_menu
        read -p "Enter your choice (0-6): " choice
        
        case $choice in
            1)
                clear_cache_restart
                break
                ;;
            2)
                start_tunnel
                break
                ;;
            3)
                start_lan
                break
                ;;
            4)
                update_deps
                break
                ;;
            5)
                reset_project
                break
                ;;
            6)
                check_status
                ;;
            0)
                echo "Goodbye!"
                exit 0
                ;;
            *)
                echo "❌ Invalid option. Please try again."
                ;;
        esac
    done
}

# Run main function
main "$@"
