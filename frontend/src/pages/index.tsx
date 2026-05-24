import { Row, Col, Card, Statistic, Space } from 'antd';
import {
  UsergroupAddOutlined,
  FileSearchOutlined,
  ApartmentOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

export default function HomePage() {
  return (
    <div>
      <h1>Dashboard Tuyển sinh</h1>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title="Ứng viên mới" value={1248} prefix={<UsergroupAddOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title="Hồ sơ đang xử lý" value={320} prefix={<FileSearchOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title="Ngành học" value={42} prefix={<ApartmentOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title="Tuyển sinh thành công" value={874} prefix={<CheckCircleOutlined />} />
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
}
