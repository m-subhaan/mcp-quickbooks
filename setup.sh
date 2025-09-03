#!/bin/bash

echo "🚀 QuickBooks MCP Chat Assistant Setup"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Create .env file if it doesn't exist
if [ ! -f "mcp-server/.env" ]; then
    echo "🔧 Creating environment file..."
    cp mcp-server/env.example mcp-server/.env
    echo "✅ Environment file created at mcp-server/.env"
else
    echo "✅ Environment file already exists"
fi

# Build MCP server
echo "🔨 Building MCP server..."
cd mcp-server
npm run build
cd ..

echo "✅ MCP server built successfully"

# Detect OS and provide MCP configuration instructions
echo ""
echo "🔧 Claude Desktop Configuration"
echo "=============================="

if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "Windows detected. Please copy mcp.json to:"
    echo "%APPDATA%\\Claude\\mcp.json"
    echo ""
    echo "Command:"
    echo "copy mcp.json \"%APPDATA%\\Claude\\mcp.json\""
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "macOS detected. Please copy mcp.json to:"
    echo "~/Library/Application Support/Claude/mcp.json"
    echo ""
    echo "Command:"
    echo "cp mcp.json ~/Library/Application\\ Support/Claude/mcp.json"
else
    echo "Linux detected. Please copy mcp.json to:"
    echo "~/.config/Claude/mcp.json"
    echo ""
    echo "Command:"
    echo "cp mcp.json ~/.config/Claude/mcp.json"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy mcp.json to Claude Desktop config directory (see above)"
echo "2. Restart Claude Desktop"
echo "3. Run 'npm run dev' to start the application"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "For more information, see README.md"
