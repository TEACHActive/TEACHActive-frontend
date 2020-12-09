import React from "react";

import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import SessionPage from "./pages/session/sessionPage";

export class ComponentRoute {
  name: string;
  path: string;
  component: React.ReactNode;
  icon: any;
  link: string;
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
    link: "/",
    inSidebar: false,
    exact: true,
  },
  {
    name: "Session",
    path: "/session/:id",
    component: <SessionPage />,
    icon: <UserOutlined />,
    link: "/session/1",
    inSidebar: true,
    exact: false,
  },
  {
    name: "Progress",
    path: "/progress",
    component: <div>Progress</div>,
    icon: <UploadOutlined />,
    link: "/progress",
    inSidebar: true,
    exact: true,
  },
  {
    name: "C",
    path: "/c",
    component: <div>C</div>,
    icon: <VideoCameraOutlined />,
    link: "/c",
    inSidebar: true,
    exact: true,
  },
];
