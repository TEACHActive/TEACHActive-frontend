import React from "react";

import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  GoalsPage,
  ProgressPage,
  MetricPage,
  SettingsPage,
  GettingStartedPage,
  SignInPage,
} from "./pages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Session } from "./pages/metric/metricPage.types";

export class ComponentRoute {
  name: string;
  path: string;
  component: React.ReactNode;
  icon: any;
  link: (id?: string) => string;
  inSidebar: boolean;
  exact: boolean;
  secure: boolean;

  constructor(data: any) {
    this.name = data.name;
    this.path = data.path;
    this.component = data.component;
    this.icon = data.icon;
    this.link = data.link;
    this.inSidebar = data.inSidebar;
    this.exact = data.exact;
    this.secure = data.secure;
  }
}

export const BaseRoute: ComponentRoute = new ComponentRoute({
  name: "Base",
  path: "/",
  component: <GettingStartedPage />,
  icon: <UserOutlined />,
  link: () => "/",
  inSidebar: false,
  exact: true,
  secure: false,
});

export const SessionRoute: ComponentRoute = new ComponentRoute({
  name: "Session",
  path: "/session",
  component: <>Test</>,
  icon: <UserOutlined />,
  link: () => "/session",
  inSidebar: false,
  exact: true,
  secure: true,
});

export const MetricsRoute: ComponentRoute = new ComponentRoute({
  name: "Metrics",
  path: "/metrics",
  component: <MetricPage />,
  icon: <UserOutlined />,
  link: () => "/metrics",
  inSidebar: true,
  exact: true,
  secure: true,
});
export const ProgressRoute: ComponentRoute = new ComponentRoute({
  name: "Progress",
  path: "/progress",
  component: <ProgressPage />,
  icon: <UploadOutlined />,
  link: () => "/progress",
  inSidebar: true,
  exact: true,
  secure: true,
});
export const GoalsRoute: ComponentRoute = new ComponentRoute({
  name: "Reflections & Goals",
  path: "/goals",
  component: <GoalsPage />,
  icon: <FontAwesomeIcon icon="book-reader" />,
  link: () => "/goals",
  inSidebar: true,
  exact: true,
  secure: true,
});
export const SettingsRoute: ComponentRoute = new ComponentRoute({
  name: "Settings",
  path: "/settings",
  component: <SettingsPage />,
  icon: <VideoCameraOutlined />,
  link: () => "/settings",
  inSidebar: false,
  exact: true,
  secure: true,
});
export const SignInRoute: ComponentRoute = new ComponentRoute({
  name: "Sign In",
  path: "/login",
  component: <SignInPage />,
  icon: <VideoCameraOutlined />,
  link: () => "/login",
  inSidebar: false,
  exact: true,
  secure: false,
});

export const routes: ComponentRoute[] = [
  BaseRoute,
  SessionRoute,
  MetricsRoute,
  ProgressRoute,
  GoalsRoute,
  SettingsRoute,
  SignInRoute,
];
