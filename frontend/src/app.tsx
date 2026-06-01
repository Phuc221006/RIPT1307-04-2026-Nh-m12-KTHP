// Tắt reset.css của antd để không phá vỡ giao diện Dark Theme
// import 'antd/dist/reset.css';
import "./global.less";
import type { ReactNode } from "react";

export function rootContainer(container: ReactNode) {
  return container;
}
