import React from "react";
import { MetricLayout } from "./components/MetricLayout/metricLayout";
// import MetricDisplay from "./components/MetricDisplay/metricDisplay";

import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

export class ComponentRoute {
  name: string;
  path: string;
  component: React.ReactNode;
  icon: any;
  link: string;
  inSidebar: boolean;

  constructor(data: any) {
    this.name = data.name;
    this.path = data.path;
    this.component = data.component;
    this.icon = data.icon;
    this.link = data.link;
    this.inSidebar = data.inSidebar;
  }
}

export const routes: ComponentRoute[] = [
  {
    name: "Session",
    path: "/",
    component: <div>content</div>,
    icon: <UserOutlined />,
    link: "/session",
    inSidebar: false,
  },
  {
    name: "Session",
    path: "/session",
    component: (
      <div style={{ display: "flex" }}>
        <MetricLayout />
      </div>
    ),
    icon: <UserOutlined />,
    link: "/session",
    inSidebar: true,
  },
  {
    name: "Progress",
    path: "/progress",
    component: <div>Progress</div>,
    icon: <UploadOutlined />,
    link: "/progress",
    inSidebar: true,
  },
  {
    name: "C",
    path: "/c",
    component: <div>C</div>,
    icon: <VideoCameraOutlined />,
    link: "/c",
    inSidebar: true,
  },
];
