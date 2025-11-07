@echo off
chcp 65001 >nul
echo =====================================
echo   文件上传服务启动脚本
echo =====================================
echo.

:: 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Python,请先安装Python 3.8+
    pause
    exit /b 1
)

echo [1/3] 检查依赖...
pip show flask >nul 2>&1
if %errorlevel% neq 0 (
    echo [提示] Flask未安装,正在安装依赖...
    pip install flask flask-cors
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
)

echo [2/3] 创建上传目录...
if not exist "uploads" mkdir uploads

echo [3/3] 启动服务...
echo.
echo =====================================
echo   服务启动成功！
echo   监听地址: http://localhost:19666
echo   上传目录: %cd%\uploads
echo   按 Ctrl+C 停止服务
echo =====================================
echo.

python main.py
