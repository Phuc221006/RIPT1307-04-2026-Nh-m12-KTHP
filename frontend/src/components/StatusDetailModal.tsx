import React from "react";
import { Modal, Typography, Button, Tag } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import styles from "./StatusDetailModal.less";

interface Props {
  visible: boolean;
  onClose: () => void;
  application?: any;
}

const StatusDetailModal: React.FC<Props> = ({ visible, onClose, application }) => {
  const status = (application?.status || "PENDING").toString().toUpperCase();
  const notes = application?.notes || application?.note || application?.feedback || "Không có thông tin bổ sung.";
  const applicantName = application?.users?.full_name || application?.userName || "Bạn";
  const reviewTime = application?.reviewedAt || application?.approvedAt || application?.updatedAt || application?.createdAt || new Date().toISOString();
  const reviewerName = application?.reviewerName || application?.approvedBy || application?.handledBy || "Ban tuyển sinh";
  const submissionDate = application?.createdAt || application?.submittedAt;

  const statusSettings = {
    APPROVED: {
      label: "Đã duyệt",
      icon: <CheckCircleOutlined />,
      color: "#096dd9",
      accentLight: "rgba(24, 144, 255, 0.18)",
      accentStrong: "#096dd9",
      statusText: "Hồ sơ đã được chấp nhận",
      description: `Xin chúc mừng ${applicantName}, hồ sơ của bạn đã được duyệt thành công.`, 
    },
    REJECTED: {
      label: "Từ chối",
      icon: <CloseCircleOutlined />,
      color: "#cf1322",
      accentLight: "rgba(255, 77, 79, 0.18)",
      accentStrong: "#cf1322",
      statusText: "Hồ sơ chưa đạt yêu cầu",
      description: `Rất tiếc, hồ sơ của bạn chưa đáp ứng đủ tiêu chuẩn hiện tại.`,
    },
    PENDING: {
      label: "Đang xử lý",
      icon: <ClockCircleOutlined />,
      color: "#faad14",
      accentLight: "rgba(250, 173, 20, 0.18)",
      accentStrong: "#faad14",
      statusText: "Hồ sơ đang được xem xét",
      description: `Hồ sơ của bạn đang trong tiến trình đánh giá. Vui lòng theo dõi thông báo mới nhất.`,
    },
  };

  const currentStatus = statusSettings[status as keyof typeof statusSettings] || statusSettings.PENDING;

  const detailRows = [
    { label: "Trạng thái hồ sơ", value: currentStatus.label },
    { label: "Ngày nộp", value: submissionDate ? new Date(submissionDate).toLocaleString("vi-VN") : "Chưa có" },
    { label: "Thời gian duyệt", value: reviewTime ? new Date(reviewTime).toLocaleString("vi-VN") : "Chưa có" },
    { label: "Tên cán bộ duyệt", value: reviewerName },
  ];

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      className={styles.statusDetailModal}
      wrapClassName={styles.statusDetailModalWrap}
      style={{ "--modal-accent-strong": currentStatus.accentStrong } as React.CSSProperties}
    >
      <div className={styles.modalHeader} style={{ "--modal-accent-light": currentStatus.accentLight } as React.CSSProperties}>
        <div className={styles.logoBadge} style={{ color: currentStatus.color, borderColor: currentStatus.color }}>
          {currentStatus.icon}
        </div>
        <div className={styles.headerText}>
          <Typography.Title level={4} className={styles.headerTextTitle}>
            Kết quả hồ sơ của bạn
          </Typography.Title>
          <Typography.Text className={styles.headerTextSubtitle}>
            {currentStatus.statusText}
          </Typography.Text>
        </div>
      </div>

      <div className={styles.modalContent}>
        <div className={styles.statusTag} style={{ borderColor: currentStatus.color, color: currentStatus.color }}>
          {currentStatus.icon}
          {currentStatus.label}
        </div>

        <Typography.Paragraph style={{ marginTop: 16, color: "rgba(15, 23, 42, 0.82)", fontSize: 15 }}>
          {currentStatus.description}
        </Typography.Paragraph>

        <div className={styles.detailTable}>
          {detailRows.map((row) => (
            <div key={row.label} className={styles.detailRow}>
              <div className={styles.detailLabel}>{row.label}</div>
              <div className={styles.detailValue}>{row.value}</div>
            </div>
          ))}
        </div>

        <div className={styles.notesSection}>
          <Typography.Text className={styles.notesLabel}>Ghi chú từ ban tuyển sinh</Typography.Text>
          <Typography.Paragraph className={styles.notesText} style={{ margin: 0 }}>
            {notes}
          </Typography.Paragraph>
        </div>

        <div className={styles.modalFooter}>
          
          <Button className={styles.footerButton} type="default" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StatusDetailModal;
