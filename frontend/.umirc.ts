import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: 'login/index', layout: false },
    { path: '/register', component: 'register/index', layout: false },
    { path: '/dashboard', component: 'dashboard/index' },
    { path: '/admin', component: 'admin/index', layout: false },
    { path: '/admin/catalogs/universities', component: 'admin/catalogs/universities', layout: false },
    { path: '/admin/catalogs/majors', component: 'admin/catalogs/majors', layout: false },
    { path: '/admin/catalogs/combinations', component: 'admin/catalogs/combinations', layout: false },
  ],
  npmClient: 'npm',
  title: 'Hệ thống Tuyển sinh',

  // Ép UmiJS thay thế toàn bộ biến gọi API thành link Render online khi biên dịch
  define: {
    'REACT_APP_API_BASE_URL': 'https://api-nhom12-kthp.onrender.com/api/v1',
    'process.env.REACT_APP_API_BASE_URL': 'https://api-nhom12-kthp.onrender.com/api/v1'
  }
});