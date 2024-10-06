import { Modal } from "antd";
import React from "react";

type PropsType = {
  title: string;
  icon: React.ReactNode;
  onOk: () => void;
  onCancel?: () => void;
};

export const showDeleteConfirm = ({
  title,
  icon,
  onOk,
  onCancel,
}: PropsType) => {
  Modal.confirm({
    width: "600px",
    title,
    icon,
    okText: "Xác nhận",
    okType: "danger",
    cancelText: "Hủy",
    centered: true,
    onOk,
    onCancel,
  });
};
