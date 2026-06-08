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
});