import React from "react";

import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { GoalsPage, ProgressPage, MetricPage, SettingsPage } from "./pages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class ComponentRoute {
  name: string;
  path: string;
  component: React.ReactNode;
  icon: any;
  link: (id?: string) => string;
  inSidebar: boolean;
  exact: boolean;

  constructor(data: any) {
    this.name = data.name;
    this.path = data.path;
    this.component = data.component;
    this.icon = data.icon;
    this.link = data.link;
    this.inSidebar = data.inSidebar;
    this.exact = data.exact;
  }
}

export const routes: ComponentRoute[] = [
  {
    name: "Base",
    path: "/",
    component: <div>content</div>,
    icon: <UserOutlined />,
    link: () => "/",
    inSidebar: false,
    exact: true,
  },
  {
    name: "Session",
    path: "/session",
    component: <>Test</>,
    icon: <UserOutlined />,
    link: () => "",
    inSidebar: true,
    exact: false,
  },
  {
    name: "Metrics",
    path: "/metrics/:id",
    component: <MetricPage />,
    icon: <UserOutlined />,
    link: (id) => (id ? `/metrics/${id}` : "metrics"),
    inSidebar: true,
    exact: false,
  },
  {
    name: "Progress",
    path: "/progress",
    component: <ProgressPage />,
    icon: <UploadOutlined />,
    link: () => "/progress",
    inSidebar: true,
    exact: false,
  },
  {
    name: "Reflections & Goals",
    path: "/goals",
    component: <GoalsPage />,
    icon: <FontAwesomeIcon icon="book-reader" />,
    link: () => "/goals",
    inSidebar: true,
    exact: false,
  },
  {
    name: "Settings",
    path: "/settings",
    component: <SettingsPage />,
    icon: <VideoCameraOutlined />,
    link: () => "/settings",
    inSidebar: true,
    exact: true,
  },
];
