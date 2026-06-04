import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: 'login/index', layout: false },
    { path: '/register', component: 'register/index', layout: false },
    { path: '/dashboard', component: 'dashboard/index' },
<<<<<<< HEAD
    { path: '/admin/thong-ke', component: 'admin/thong-ke/index', layout: false },
    { path: '/admin/ho-so',    component: 'admin/ho-so/index',    layout: false },
    { path: '/admin/danh-muc', component: 'admin/danh-muc/index', layout: false },
=======
    { path: '/admin', component: 'admin/index', layout: false },
>>>>>>> fbce2b8ae4ea56640057ae1ca968c085bd5513d9
  ],
  npmClient: 'npm',
  title: 'Hệ thống Tuyển sinh',
});