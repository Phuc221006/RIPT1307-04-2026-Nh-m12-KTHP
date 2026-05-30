import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: 'login/index' },
    { path: '/register', component: 'register/index' },
    { path: '/dashboard', component: 'dashboard/index' },
  ],
  npmClient: 'npm',
  title: 'Hệ thống Tuyển sinh',
});