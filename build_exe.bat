@echo off
chcp 65001 >nul
echo =====================================
echo   打包项目为 Windows EXE
echo =====================================
echo.

rem 获取脚本所在目录并切换到项目根目录
cd /d %~dp0

echo [1/4] 激活虚拟环境...
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

echo [2/4] 安装 PyInstaller...
pip install pyinstaller -q
if %errorlevel% neq 0 (
    echo [错误] PyInstaller 安装失败
    pause
    exit /b 1
)

echo [3/4] 清理旧的打包文件...
if exist build rmdir /s /q build
if exist dist rmdir /s /q dist
if exist temp_zip_folder rmdir /s /q temp_zip_folder

echo [4/5] 开始打包 EXE...
pyinstaller build_exe.spec --clean
if %errorlevel% neq 0 (
    echo [错误] 打包失败
    pause
    exit /b 1
)

echo [5/5] 打包 Chrome 插件...
if exist chrome-extension (
    rem 创建临时文件夹结构
    mkdir temp_zip_folder\mini-chrome-plugin
    xcopy chrome-extension\* temp_zip_folder\mini-chrome-plugin\ /E /I /Q
    
    rem 打包成zip
    powershell -Command "Compress-Archive -Path 'temp_zip_folder\mini-chrome-plugin' -DestinationPath 'dist\mini-chrome-plugin.zip' -Force"
    if %errorlevel% neq 0 (
        echo [警告] Chrome 插件打包失败，但 EXE 已成功生成
    ) else (
        echo Chrome 插件已打包: dist\mini-chrome-plugin.zip
    )
    
    rem 清理临时文件夹
    rmdir /s /q temp_zip_folder
) else (
    echo [警告] 未找到 chrome-extension 目录
)

echo.
echo =====================================
echo   打包成功！
echo   EXE 位置: %CD%\dist\mini-chrome-plugin-server.exe
echo   插件位置: %CD%\dist\mini-chrome-plugin.zip
echo =====================================
echo.
pause
