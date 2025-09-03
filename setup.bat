@echo off
echo 🚀 QuickBooks MCP Chat Assistant Setup
echo ======================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2,3 delims=." %%a in ('node -v') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% LSS 18 (
    echo ❌ Node.js version 18+ is required. Current version: 
    node -v
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node -v

REM Install dependencies
echo 📦 Installing dependencies...
call npm run install:all

REM Create .env file if it doesn't exist
if not exist "mcp-server\.env" (
    echo 🔧 Creating environment file...
    copy mcp-server\env.example mcp-server\.env
    echo ✅ Environment file created at mcp-server\.env
) else (
    echo ✅ Environment file already exists
)

REM Build MCP server
echo 🔨 Building MCP server...
cd mcp-server
call npm run build
cd ..

echo ✅ MCP server built successfully

echo.
echo 🔧 Claude Desktop Configuration
echo ==============================
echo Windows detected. Please copy mcp.json to:
echo %%APPDATA%%\Claude\mcp.json
echo.
echo Command:
echo copy mcp.json "%%APPDATA%%\Claude\mcp.json"

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Copy mcp.json to Claude Desktop config directory (see above)
echo 2. Restart Claude Desktop
echo 3. Run 'npm run dev' to start the application
echo 4. Open http://localhost:3000 in your browser
echo.
echo For more information, see README.md
pause
