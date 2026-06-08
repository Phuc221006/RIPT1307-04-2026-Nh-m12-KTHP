# TODO - Quản lý danh mục Tuyển sinh (Universities / Majors / Combinations)

## Step 1: Backend catalogs API
- [x] Kiểm tra `catalog_controller.ts` có hỗ trợ `GET/POST/PUT/DELETE /api/v1/catalogs/:type`
- [x] Đảm bảo ràng buộc khóa ngoại khi xóa (universities -> majors, majors -> combinations, combinations -> applications)
- [x] Bổ sung hỗ trợ query `page/limit/search` cho GET catalogs

## Step 2: Frontend admin (Ant Design)
- [x] Tách 3 trang quản trị:
  - [x] `frontend/src/pages/admin/catalogs/universities.tsx`
  - [x] `frontend/src/pages/admin/catalogs/majors.tsx`
  - [x] `frontend/src/pages/admin/catalogs/combinations.tsx`
- [x] Tạo Axios service gọi API catalogs:
  - [x] `frontend/src/services/catalogApi.ts`
- [x] Sử dụng AntD Table/Modal/Confirm

## Step 3: Liên kết dữ liệu khi thêm trường mới
- [ ] Khi thêm University, đảm bảo UI/flow tạo cả Majors và Combinations tương ứng (để không tồn tại trường không có ngành)



