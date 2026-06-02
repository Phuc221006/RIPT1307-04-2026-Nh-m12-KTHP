import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: 'login/index', layout: false },
    { path: '/register', component: 'register/index', layout: false },
    { path: '/dashboard', component: 'dashboard/index' },
    { path: '/admin', component: 'admin/index', layout: false },
  ],
  npmClient: 'npm',
  title: 'Hệ thống Tuyển sinh',
});