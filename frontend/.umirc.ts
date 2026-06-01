import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: 'login/index' },
    { path: '/register', component: 'register/index' },
    { path: '/dashboard', component: 'dashboard/index' },
    { path: '/admin/thong-ke', component: 'admin/thong-ke/index', layout: false },
    { path: '/admin/ho-so',    component: 'admin/ho-so/index',    layout: false },
    { path: '/admin/danh-muc', component: 'admin/danh-muc/index', layout: false },
  ],
  npmClient: 'npm',
  title: 'Hệ thống Tuyển sinh',
});