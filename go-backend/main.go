package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/atotto/clipboard"
	"github.com/rs/cors"
)

const (
	UploadFolder   = "uploads"
	MaxUploadSize  = 3 * 1024 * 1024 * 1024 // 3GB
	ServerPort     = "19666"
	ServerHost     = "localhost"
)

type Response struct {
	Status   string `json:"status"`
	Message  string `json:"message,omitempty"`
	Filename string `json:"filename,omitempty"`
	Filesize int64  `json:"filesize,omitempty"`
	CharCount int   `json:"char_count,omitempty"`
	UploadEndpoint string `json:"upload_endpoint,omitempty"`
	Method   string `json:"method,omitempty"`
}

type TextUploadRequest struct {
	Content string `json:"content"`
}

// 初始化上传文件夹
func initUploadFolder() error {
	if _, err := os.Stat(UploadFolder); os.IsNotExist(err) {
		return os.MkdirAll(UploadFolder, 0755)
	}
	return nil
}

// 生成唯一的文件名
func getUniqueFilename(originalFilename string) string {
	filePath := filepath.Join(UploadFolder, originalFilename)

	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return originalFilename
	}

	// 分离文件名和扩展名
	ext := filepath.Ext(originalFilename)
	name := strings.TrimSuffix(originalFilename, ext)
	timestamp := time.Now().Format("20060102150405")
	return fmt.Sprintf("%s_%s%s", name, timestamp, ext)
}

// 打开文件管理器定位到文件
func openFileLocation(filePath string) {
	absPath, err := filepath.Abs(filePath)
	if err != nil {
		log.Printf("获取绝对路径失败: %v", err)
		return
	}

	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("explorer", "/select,", absPath)
	case "darwin": // macOS
		cmd = exec.Command("open", "-R", absPath)
	case "linux":
		// Linux 使用 xdg-open 打开包含文件的目录
		dir := filepath.Dir(absPath)
		cmd = exec.Command("xdg-open", dir)
	default:
		log.Printf("不支持的操作系统: %s", runtime.GOOS)
		return
	}

	if err := cmd.Start(); err != nil {
		log.Printf("打开文件管理器失败: %v", err)
	}
}

// 首页处理器
func indexHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Response{
		Status:         "success",
		Message:        "文件上传服务正在运行",
		UploadEndpoint: "/upload",
		Method:         "POST",
	})
}

// 文件上传处理器
func uploadFileHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(Response{
			Status:  "error",
			Message: "只支持 POST 方法",
		})
		return
	}

	// 解析 multipart form，设置最大内存
	err := r.ParseMultipartForm(32 << 20) // 32MB in memory
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{
			Status:  "error",
			Message: fmt.Sprintf("解析表单失败: %v", err),
		})
		return
	}

	// 获取上传的文件
	file, handler, err := r.FormFile("file")
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{
			Status:  "error",
			Message: "请求中没有文件字段",
		})
		return
	}
	defer file.Close()

	// 检查文件名
	if handler.Filename == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{
			Status:  "error",
			Message: "未选择文件",
		})
		return
	}

	// 生成唯一文件名
	uniqueFilename := getUniqueFilename(handler.Filename)
	savePath := filepath.Join(UploadFolder, uniqueFilename)

	// 创建目标文件
	dst, err := os.Create(savePath)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(Response{
			Status:  "error",
			Message: fmt.Sprintf("创建文件失败: %v", err),
		})
		return
	}
	defer dst.Close()

	// 流式复制文件内容
	fileSize, err := io.Copy(dst, file)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(Response{
			Status:  "error",
			Message: fmt.Sprintf("保存文件失败: %v", err),
		})
		return
	}

	// 打开文件管理器定位到文件
	go openFileLocation(savePath)

	// 返回成功响应
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Response{
		Status:   "success",
		Filename: uniqueFilename,
		Filesize: fileSize,
	})
}

// 文本上传处理器
func uploadTextHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(Response{
			Status:  "error",
			Message: "只支持 POST 方法",
		})
		return
	}

	// 解析 JSON 请求
	var req TextUploadRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{
			Status:  "error",
			Message: "请求中没有文本内容",
		})
		return
	}

	// 解码 base64 内容
	decodedBytes, err := base64.StdEncoding.DecodeString(req.Content)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{
			Status:  "error",
			Message: fmt.Sprintf("base64解码失败: %v", err),
		})
		return
	}

	textContent := string(decodedBytes)
	if strings.TrimSpace(textContent) == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{
			Status:  "error",
			Message: "文本内容为空",
		})
		return
	}

	// 保存到 copy_tmp.txt 文件
	savePath := filepath.Join(UploadFolder, "copy_tmp.txt")
	err = os.WriteFile(savePath, []byte(textContent), 0644)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(Response{
			Status:  "error",
			Message: fmt.Sprintf("保存文件失败: %v", err),
		})
		return
	}

	// 复制到剪贴板
	err = clipboard.WriteAll(textContent)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(Response{
			Status:  "error",
			Message: fmt.Sprintf("复制到剪贴板失败: %v", err),
		})
		return
	}

	// 返回成功响应
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Response{
		Status:    "success",
		CharCount: len(textContent),
		Message:   "文本已保存并复制到剪贴板",
	})
}

func main() {
	// 初始化上传文件夹
	if err := initUploadFolder(); err != nil {
		log.Fatalf("创建上传文件夹失败: %v", err)
	}

	// 创建路由
	mux := http.NewServeMux()
	mux.HandleFunc("/", indexHandler)
	mux.HandleFunc("/upload", uploadFileHandler)
	mux.HandleFunc("/upload-text", uploadTextHandler)

	// 配置 CORS
	handler := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	}).Handler(mux)

	// 打印启动信息
	absPath, _ := filepath.Abs(UploadFolder)
	fmt.Println("文件上传服务启动中...")
	fmt.Printf("监听地址: %s:%s\n", ServerHost, ServerPort)
	fmt.Printf("文件保存目录: %s\n", absPath)
	fmt.Println("按 Ctrl+C 停止服务")

	// 启动服务器
	addr := fmt.Sprintf("%s:%s", ServerHost, ServerPort)
	log.Fatal(http.ListenAndServe(addr, handler))
}
