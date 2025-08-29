# 视频文件说明

## 视频要求

为了实现类似Elimane网站的效果，同时优化流量使用，请按照以下要求准备视频文件：

### 文件格式

建议提供两种格式的视频文件：

1. **WebM格式**（主要）：
   - 文件名：`hero-video.webm`
   - 优点：文件体积小，通常比MP4小30-50%
   - 支持：现代浏览器（Chrome、Firefox、Edge等）

2. **MP4格式**（备用）：
   - 文件名：`hero-video.mp4`
   - 优点：兼容性好，几乎所有浏览器都支持
   - 用途：作为WebM的备用格式

### 视频参数建议

为了优化流量和性能，建议使用以下参数：

- **分辨率**：1280x720（720p）足够作为网页背景
- **比特率**：500-1000kbps
- **帧率**：24-30fps
- **时长**：5-10秒的短循环视频
- **编码**：
  - WebM：VP9编码
  - MP4：H.264编码

### 视频内容建议

- 使用简单、抽象的内容，避免复杂细节
- 选择暗色调背景，以便文字内容清晰可见
- 考虑使用渐变或微妙的动画效果
- 确保视频循环时无明显的衔接痕迹

## 视频优化工具

可以使用以下工具优化视频：

1. **FFmpeg**（命令行工具）：
   ```bash
   # 转换为WebM格式
   ffmpeg -i input.mp4 -c:v libvpx-vp9 -b:v 800k -pass 1 -an -f null /dev/null && \
   ffmpeg -i input.mp4 -c:v libvpx-vp9 -b:v 800k -pass 2 -c:a libopus hero-video.webm
   
   # 优化MP4格式
   ffmpeg -i input.mp4 -vf "scale=1280:720" -c:v libx264 -profile:v main -level 3.1 -preset slow -crf 23 -b:v 800k -maxrate 1000k -bufsize 1500k -an hero-video.mp4
   ```

2. **Handbrake**（图形界面工具）：
   - 使用「Web优化」预设
   - 选择合适的分辨率和比特率

3. **在线工具**：
   - Cloudinary
   - Shotstack
   - Clideo

## 放置位置

将准备好的视频文件放在此目录下：

```
public/video/
  ├── hero-video.webm  # 主要格式（体积更小）
  └── hero-video.mp4   # 备用格式（兼容性更好）
```

组件会自动检测并使用这些视频文件。