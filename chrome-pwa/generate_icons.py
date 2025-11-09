"""
生成 PWA 应用图标
需要安装 Pillow: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
    
    def create_icon(size, filename):
        """创建应用图标"""
        # 创建图像
        img = Image.new('RGB', (size, size), color='white')
        draw = ImageDraw.Draw(img)
        
        # 绘制渐变背景 (简化版本,使用纯色)
        draw.rectangle([(0, 0), (size, size)], fill='#667eea')
        
        # 绘制文件夹图标
        icon_size = int(size * 0.5)
        center_x = size // 2
        center_y = size // 2
        
        # 文件夹主体 (白色矩形)
        folder_width = icon_size
        folder_height = int(icon_size * 0.7)
        folder_x = center_x - folder_width // 2
        folder_y = center_y - folder_height // 4
        
        # 绘制白色文件夹
        draw.rounded_rectangle(
            [(folder_x, folder_y), (folder_x + folder_width, folder_y + folder_height)],
            radius=int(size * 0.04),
            fill='white'
        )
        
        # 绘制文件夹标签
        tab_width = int(folder_width * 0.4)
        tab_height = int(icon_size * 0.2)
        tab_y = folder_y - int(icon_size * 0.15)
        
        draw.rounded_rectangle(
            [(folder_x, tab_y), (folder_x + tab_width, tab_y + tab_height)],
            radius=int(size * 0.02),
            fill='white'
        )
        
        # 绘制上传箭头 (蓝色)
        arrow_size = int(icon_size * 0.3)
        arrow_y = center_y + int(icon_size * 0.05)
        
        # 箭头形状
        arrow_points = [
            (center_x, arrow_y - arrow_size // 2),  # 顶点
            (center_x - arrow_size // 3, arrow_y),  # 左上
            (center_x - arrow_size // 6, arrow_y),  # 左中
            (center_x - arrow_size // 6, arrow_y + arrow_size // 2),  # 左下
            (center_x + arrow_size // 6, arrow_y + arrow_size // 2),  # 右下
            (center_x + arrow_size // 6, arrow_y),  # 右中
            (center_x + arrow_size // 3, arrow_y),  # 右上
        ]
        
        draw.polygon(arrow_points, fill='#667eea')
        
        # 保存图像
        current_dir = os.path.dirname(os.path.abspath(__file__))
        filepath = os.path.join(current_dir, filename)
        img.save(filepath, 'PNG', quality=95)
        print(f'✅ 已生成: {filename} ({size}x{size})')
        return filepath
    
    # 生成图标
    print('开始生成 PWA 图标...')
    print()
    
    icon_192 = create_icon(192, 'icon-192.png')
    icon_512 = create_icon(512, 'icon-512.png')
    
    print()
    print('✅ 所有图标生成完成!')
    print(f'   - icon-192.png')
    print(f'   - icon-512.png')
    print()
    print('提示: 如需自定义图标,请使用设计工具编辑这些文件')
    
except ImportError:
    print('❌ 错误: 未找到 Pillow 库')
    print()
    print('请先安装 Pillow:')
    print('   pip install Pillow')
    print()
    print('或者:')
    print('   1. 在浏览器中打开 generate-icons.html')
    print('   2. 点击下载按钮保存图标')
    print('   3. 将图标文件重命名并保存到当前目录')
except Exception as e:
    print(f'❌ 生成图标时出错: {e}')
    print()
    print('备选方案:')
    print('   1. 在浏览器中打开 generate-icons.html')
    print('   2. 点击下载按钮保存图标')
