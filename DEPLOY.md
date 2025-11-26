# Hướng dẫn Deploy lên Vercel

## Bước 1: Chuẩn bị

1. Tạo tài khoản Vercel tại https://vercel.com (có thể đăng nhập bằng GitHub)
2. Đảm bảo code đã được push lên GitHub repository

## Bước 2: Deploy từ Vercel Dashboard

### Cách 1: Deploy qua Vercel Website (Đơn giản nhất)

1. Truy cập https://vercel.com/new
2. Import repository GitHub của bạn
3. Vercel sẽ tự động detect Vite framework
4. **QUAN TRỌNG**: Thêm Environment Variable:
   - Click "Environment Variables"
   - Thêm biến: `GEMINI_API_KEY` = `your-api-key-here`
   - Chọn "Production", "Preview", và "Development"
5. Click "Deploy"
6. Đợi vài phút để build xong

### Cách 2: Deploy qua Vercel CLI

1. Cài đặt Vercel CLI:
```bash
npm install -g vercel
```

2. Login vào Vercel:
```bash
vercel login
```

3. Deploy project:
```bash
vercel
```

4. Làm theo hướng dẫn:
   - Set up and deploy? Yes
   - Which scope? Chọn account của bạn
   - Link to existing project? No
   - Project name? (Enter để dùng tên mặc định)
   - In which directory is your code located? ./
   - Want to override settings? No

5. Thêm Environment Variable:
```bash
vercel env add GEMINI_API_KEY
```
   - Nhập API key của bạn
   - Chọn Production, Preview, Development

6. Deploy production:
```bash
vercel --prod
```

## Bước 3: Cấu hình Environment Variables

Sau khi deploy, bạn cần thêm API key:

1. Vào Vercel Dashboard
2. Chọn project của bạn
3. Vào Settings > Environment Variables
4. Thêm:
   - Key: `GEMINI_API_KEY`
   - Value: API key của bạn từ Google AI Studio
   - Environments: Production, Preview, Development
5. Click "Save"
6. Redeploy project (Deployments > ... > Redeploy)

## Bước 4: Kiểm tra

1. Truy cập URL Vercel cung cấp (vd: https://your-project.vercel.app)
2. Test chức năng generate UML diagram
3. Kiểm tra console nếu có lỗi

## Lưu ý quan trọng

- **API Key**: Không commit API key vào Git. Luôn dùng Environment Variables
- **Build time**: Lần đầu build có thể mất 2-3 phút
- **Auto deploy**: Mỗi lần push code lên GitHub, Vercel sẽ tự động deploy
- **Domain**: Bạn có thể thêm custom domain trong Settings > Domains

## Troubleshooting

### Lỗi "API Key is missing"
- Kiểm tra Environment Variables đã được thêm chưa
- Redeploy sau khi thêm env vars

### Lỗi build
- Kiểm tra `npm run build` chạy thành công local chưa
- Xem build logs trong Vercel Dashboard

### Diagram không hiển thị
- Mở DevTools Console để xem lỗi
- Kiểm tra API key có đúng không
