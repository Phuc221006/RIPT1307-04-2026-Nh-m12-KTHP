import { Layout, Avatar, Typography } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { Outlet } from 'umi';
import styles from './index.less';

const { Header, Sider, Content, Footer } = Layout;


export default function RootLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} className={styles.sider}>
        <div className={styles.logo}>Tuyển sinh Đại học</div>
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerLeft}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            <Typography.Title level={4} className={styles.title}>
              Hệ thống quản lý Tuyển sinh Trực tuyến
            </Typography.Title>
          </div>
          <div className={styles.userArea}>
            <Avatar icon={<UserOutlined />} />
            <span>Phúc</span>
          </div>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
        <Footer className={styles.footer}>
          © 2026 Hệ thống quản lý Tuyển sinh Đại học Trực tuyến
        </Footer>
      </Layout>
    </Layout>
  );
}

