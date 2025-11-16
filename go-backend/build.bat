@echo off
chcp 65001 > nul
echo 开始编译 Go 文件上传服务...
echo.

REM 下载依赖
echo 1. 下载依赖...
go mod download
if %errorlevel% neq 0 (
    echo ✗ 依赖下载失败
    exit /b 1
)
echo.

REM 创建 bin 目录
if not exist "bin" mkdir bin

REM 编译 Linux 64位版本
echo 2. 编译 Linux 64位版本...
set GOOS=linux
set GOARCH=amd64
go build -o bin/file-upload-server-linux-amd64 main.go
if %errorlevel% equ 0 (
    echo ✓ Linux 64位版本编译成功: bin/file-upload-server-linux-amd64
) else (
    echo ✗ Linux 64位版本编译失败
    exit /b 1
)
echo.

REM 编译 Windows 64位版本
echo 3. 编译 Windows 64位版本...
set GOOS=windows
set GOARCH=amd64
go build -o bin/file-upload-server-windows-amd64.exe main.go
if %errorlevel% equ 0 (
    echo ✓ Windows 64位版本编译成功: bin/file-upload-server-windows-amd64.exe
) else (
    echo ✗ Windows 64位版本编译失败
    exit /b 1
)
echo.

echo =========================================
echo 编译完成！
echo =========================================
echo Linux 版本: bin/file-upload-server-linux-amd64
echo Windows 版本: bin/file-upload-server-windows-amd64.exe
echo.
pause
