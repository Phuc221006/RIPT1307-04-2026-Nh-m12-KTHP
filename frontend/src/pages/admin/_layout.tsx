import { useState } from 'react';
import { Layout, Menu, Avatar, Button, Badge, Dropdown } from 'antd';
import {
  BarChartOutlined, FileTextOutlined, AppstoreOutlined,
  BellOutlined, UserOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { removeToken } from '../../services/api';
import styles from './_layout.less';

const { Sider, Header, Content } = Layout;

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  })();

  const menuItems = [
    { key: '/admin/thong-ke', icon: <BarChartOutlined />, label: 'Thống kê' },
    { key: '/admin/danh-muc', icon: <AppstoreOutlined />, label: 'Quản lý Danh mục' },
    { key: '/admin/ho-so',    icon: <FileTextOutlined />, label: 'Quản lý Hồ sơ' },
  ];

  return (
    <Layout className={styles.layout}>
      <Sider width={220} collapsed={collapsed} className={styles.sider}>
        <div className={styles.brand}>
          {!collapsed && (
            <div className={styles.brandText}>
              <div className={styles.brandName}>Cổng thông tin</div>
              <div className={styles.brandSub}>Xét tuyển Đại học</div>
            </div>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          className={styles.menu}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={styles.collapseBtn}
          />
          <div className={styles.headerRight}>
            <Badge count={0} size="small">
              <Button icon={<BellOutlined />} className={styles.iconBtn} />
            </Badge>
            <div className={styles.userInfo}>
              <Avatar icon={<UserOutlined />} className={styles.avatar} />
              <span className={styles.userName}>{user.fullName || 'Admin'}</span>
            </div>
            <Button
              icon={<LogoutOutlined />}
              className={styles.logoutBtn}
              onClick={() => { removeToken(); navigate('/login'); }}
            >
              Đăng xuất
            </Button>
          </div>
        </Header>

        <Content className={styles.content}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}