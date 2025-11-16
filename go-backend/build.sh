#!/bin/bash

echo "开始编译 Go 文件上传服务..."
echo ""

# 下载依赖
echo "1. 下载依赖..."
go mod download
echo ""

# 编译 Linux 64位版本
echo "2. 编译 Linux 64位版本..."
GOOS=linux GOARCH=amd64 go build -o bin/file-upload-server-linux-amd64 main.go
if [ $? -eq 0 ]; then
    echo "✓ Linux 64位版本编译成功: bin/file-upload-server-linux-amd64"
else
    echo "✗ Linux 64位版本编译失败"
    exit 1
fi
echo ""

# 编译 Windows 64位版本
echo "3. 编译 Windows 64位版本..."
GOOS=windows GOARCH=amd64 go build -o bin/file-upload-server-windows-amd64.exe main.go
if [ $? -eq 0 ]; then
    echo "✓ Windows 64位版本编译成功: bin/file-upload-server-windows-amd64.exe"
else
    echo "✗ Windows 64位版本编译失败"
    exit 1
fi
echo ""

echo "========================================="
echo "编译完成！"
echo "========================================="
echo "Linux 版本: bin/file-upload-server-linux-amd64"
echo "Windows 版本: bin/file-upload-server-windows-amd64.exe"
echo ""
