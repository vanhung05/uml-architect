# Hướng dẫn đẩy code lên GitHub

## Bước 1: Tạo Repository trên GitHub

1. Truy cập https://github.com/new
2. Điền thông tin:
   - Repository name: `uml-architect` (hoặc tên bạn muốn)
   - Description: `UML Diagram Generator with Gemini AI`
   - Chọn **Public** hoặc **Private**
   - **KHÔNG** chọn "Add a README file" (vì đã có rồi)
   - **KHÔNG** chọn "Add .gitignore" (vì đã có rồi)
3. Click "Create repository"

## Bước 2: Kết nối và đẩy code

Sau khi tạo repository, GitHub sẽ hiển thị hướng dẫn. Chạy các lệnh sau trong terminal:

### Thay YOUR_USERNAME và YOUR_REPO bằng thông tin của bạn:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Ví dụ cụ thể:
Nếu username GitHub của bạn là `hungdev` và repository tên là `uml-architect`:

```bash
git remote add origin https://github.com/hungdev/uml-architect.git
git branch -M main
git push -u origin main
```

## Bước 3: Nhập thông tin đăng nhập

Khi chạy `git push`, bạn sẽ được yêu cầu đăng nhập:
- Username: Tên GitHub của bạn
- Password: **Personal Access Token** (KHÔNG phải mật khẩu GitHub)

### Tạo Personal Access Token:

1. Vào https://github.com/settings/tokens
2. Click "Generate new token" > "Generate new token (classic)"
3. Điền:
   - Note: `UML Architect Deploy`
   - Expiration: `90 days` hoặc `No expiration`
   - Chọn scope: **repo** (tất cả các checkbox trong repo)
4. Click "Generate token"
5. **QUAN TRỌNG**: Copy token ngay (chỉ hiển thị 1 lần)
6. Dùng token này làm password khi git push

## Bước 4: Kiểm tra

Sau khi push thành công:
1. Refresh trang GitHub repository
2. Bạn sẽ thấy tất cả code đã được upload
3. Sẵn sàng deploy lên Vercel!

## Lệnh hữu ích

```bash
# Kiểm tra trạng thái
git status

# Xem remote repository
git remote -v

# Push code mới (sau lần đầu)
git add .
git commit -m "Update: mô tả thay đổi"
git push
```

## Lưu ý

- File `.env.local` chứa API key sẽ KHÔNG được push lên GitHub (đã có trong .gitignore)
- Bạn sẽ cần thêm API key vào Vercel Environment Variables khi deploy
