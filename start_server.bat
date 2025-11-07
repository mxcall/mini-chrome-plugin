@echo off
chcp 65001 >nul
echo =====================================
echo   文件上传服务启动脚本
echo =====================================
echo.

rem 获取脚本所在目录并切换到项目根目录
cd /d %~dp0

echo [1/2] 激活虚拟环境...
if not exist .venv\Scripts\activate.bat (
    echo [错误] 未找到 .venv 虚拟环境，请先创建虚拟环境
    pause
    exit /b 1
)

call .venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo [错误] 虚拟环境激活失败
    pause
    exit /b 1
)

echo [2/2] 创建上传目录...
if not exist uploads mkdir uploads

echo.
echo =====================================
echo   服务启动成功！
echo   项目目录: %CD%
echo   监听地址: http://localhost:19666
echo   上传目录: %CD%\uploads
echo   按 Ctrl+C 停止服务
echo =====================================
echo.

python main.py
