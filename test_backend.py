#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
快速测试脚本 - 验证后端服务是否正常工作
"""
import os
import time
import requests
from io import BytesIO

def test_backend():
    """测试后端文件上传功能"""
    print("=" * 50)
    print("后端服务测试")
    print("=" * 50)
    print()
    
    # 测试服务是否启动
    print("[1/3] 检查服务状态...")
    try:
        response = requests.get('http://localhost:19666/', timeout=5)
        if response.status_code == 200:
            print("✓ 服务正常运行")
            print(f"  响应: {response.json()}")
        else:
            print(f"✗ 服务响应异常: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ 无法连接到服务,请确保后端服务已启动 (运行 python main.py)")
        return False
    except Exception as e:
        print(f"✗ 连接错误: {e}")
        return False
    
    print()
    print("[2/3] 创建测试文件...")
    # 创建一个测试文件
    test_content = b"This is a test file content.\nHello World!\n" * 1000
    test_filename = "test_upload.txt"
    
    print(f"  文件名: {test_filename}")
    print(f"  文件大小: {len(test_content)} 字节")
    
    print()
    print("[3/3] 测试文件上传...")
    try:
        files = {'file': (test_filename, BytesIO(test_content), 'text/plain')}
        response = requests.post('http://localhost:19666/upload', files=files, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            if result.get('status') == 'success':
                print("✓ 文件上传成功!")
                print(f"  保存的文件名: {result.get('filename')}")
                print(f"  文件大小: {result.get('filesize')} 字节")
                
                # 验证文件是否存在
                saved_file = os.path.join('uploads', result.get('filename'))
                if os.path.exists(saved_file):
                    print(f"✓ 文件已保存到: {os.path.abspath(saved_file)}")
                    return True
                else:
                    print(f"✗ 文件未找到: {saved_file}")
                    return False
            else:
                print(f"✗ 上传失败: {result.get('message')}")
                return False
        else:
            print(f"✗ 上传请求失败: {response.status_code}")
            print(f"  响应内容: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ 上传错误: {e}")
        return False

if __name__ == '__main__':
    print()
    print("提示: 请先在另一个终端运行 'python main.py' 启动后端服务")
    print()
    input("按回车键开始测试...")
    print()
    
    success = test_backend()
    
    print()
    print("=" * 50)
    if success:
        print("测试结果: ✓ 通过")
        print("后端服务工作正常,可以继续安装Chrome插件进行测试")
    else:
        print("测试结果: ✗ 失败")
        print("请检查后端服务是否正常启动")
    print("=" * 50)
    print()
    input("按回车键退出...")
