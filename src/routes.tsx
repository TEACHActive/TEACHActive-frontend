/**
 * Contains the routes to be available in the dashboard
 */
import React from "react";
import {
  UserOutlined,
  MessageOutlined,
  SettingOutlined,
  DashboardOutlined,
  LineChartOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { RouteObject } from "react-router-dom";

import * as Page from "./pages";
import { WithBreadcrumbs } from "hocs/withBreadcrumbs";
import { Link } from "react-router-dom";

/**
 * Details describing routes and elements that show
 */
export interface IElementRoute {
  routeObject: RouteObject; // Contains path, element, and children
  name: string; // The name of the route
  icon: React.ReactNode; // Icon representing the path
  link: (data?: any) => string; // The prefered way to get the path of a route when navigating to it (in case any params need to be passed)
  visible: boolean; // If false, path will not be used in route switch
  secureRoute: boolean; // If true, route is protected by authentication
  showInSidebar: boolean;
  pathExtras: {
    showSider: boolean;
    showHeader: boolean;
    showFooter: boolean;
  };
}

export class ElementRoute implements IElementRoute {
  routeObject: RouteObject;
  name: string;
  icon: React.ReactNode;
  link: (data: any) => string;
  visible: boolean;
  secureRoute: boolean;
  showInSidebar: boolean;
  pathExtras: {
    showSider: boolean;
    showHeader: boolean;
    showFooter: boolean;
  };

  constructor(data: IElementRoute) {
    this.routeObject = data.routeObject;
    this.name = data.name;
    this.icon = data.icon;
    this.link = data.link;
    this.visible = data.visible;
    this.secureRoute = data.secureRoute;
    this.showInSidebar = data.showInSidebar;
    this.pathExtras = data.pathExtras ?? {
      showSider: false,
      showHeader: false,
      showFooter: false,
    };
  }
}

const iconFontSize = "30px";

const homePath = "";
export const HomeRoute: IElementRoute = new ElementRoute({
  routeObject: {
    path: homePath,
    element: <Page.HomePage />,
  },
  name: "Home",
  icon: <UserOutlined />,
  link: () => (homePath === "" ? "/" : homePath),
  visible: true,
  secureRoute: true,
  showInSidebar: false,
  pathExtras: {
    showSider: false,
    showHeader: false,
    showFooter: false,
  },
});

const metricsPath = "metrics";
export const MetricsRoute: IElementRoute = new ElementRoute({
  routeObject: {
    path: metricsPath,
    element: WithBreadcrumbs({ children: <Page.MetricsPage /> }, [
      <Link to={HomeRoute.link()}>Home</Link>,
      "Metrics",
    ]),
  },
  name: "Metrics",
  icon: <DashboardOutlined style={{ fontSize: iconFontSize }} />,
  link: () => metricsPath,
  visible: true,
  secureRoute: true,
  showInSidebar: true,
  pathExtras: {
    showSider: true,
    showHeader: true,
    showFooter: false,
  },
});

const progressPath = "progress";
export const ProgressRoute: IElementRoute = new ElementRoute({
  routeObject: {
    path: progressPath,
    element: WithBreadcrumbs({ children: <Page.ProgressPage /> }, [
      <Link to={HomeRoute.link()}>Home</Link>,
      "Progress",
    ]),
  },
  name: "Progress",
  icon: <LineChartOutlined style={{ fontSize: iconFontSize }} />,
  link: () => progressPath,
  visible: true,
  secureRoute: true,
  showInSidebar: true,
  pathExtras: {
    showSider: true,
    showHeader: true,
    showFooter: false,
  },
});

const goalsPath = "goals";
export const GoalsRoute: IElementRoute = new ElementRoute({
  routeObject: {
    path: goalsPath,
    element: WithBreadcrumbs({ children: <Page.GoalsPage /> }, [
      <Link to={HomeRoute.link()}>Home</Link>,
      "Goals",
    ]),
  },
  name: "Goals",
  icon: <MessageOutlined style={{ fontSize: iconFontSize }} />,
  link: () => goalsPath,
  visible: true,
  secureRoute: true,
  showInSidebar: true,
  pathExtras: {
    showSider: true,
    showHeader: true,
    showFooter: false,
  },
});

const settingsPath = "settings";
export const SettingsRoute: IElementRoute = new ElementRoute({
  routeObject: {
    path: settingsPath,
    element: WithBreadcrumbs({ children: <Page.SettingsPage /> }, [
      <Link to={HomeRoute.link()}>Home</Link>,
      "Settings",
    ]),
  },
  name: "Settings",
  icon: <SettingOutlined style={{ fontSize: iconFontSize }} />,
  link: () => settingsPath,
  visible: true,
  secureRoute: true,
  showInSidebar: true,
  pathExtras: {
    showSider: true,
    showHeader: true,
    showFooter: false,
  },
});

const logInPath = "login";
export const LogInRoute: IElementRoute = new ElementRoute({
  routeObject: {
    path: logInPath,
    element: <Page.LoginPage />,
  },
  name: "Sign In",
  icon: <VideoCameraOutlined />,
  link: () => "/login",
  visible: true,
  secureRoute: false,
  showInSidebar: false,
  pathExtras: {
    showSider: false,
    showHeader: false,
    showFooter: false,
  },
});

const logoutPath = "logout";
export const LogoutRoute: IElementRoute = new ElementRoute({
  routeObject: {
    path: logoutPath,
    element: <Page.LogoutPage />,
  },
  name: "Log Out",
  icon: <VideoCameraOutlined />,
  link: () => "/logout",
  visible: true,
  secureRoute: false,
  showInSidebar: false,
  pathExtras: {
    showSider: false,
    showHeader: false,
    showFooter: false,
  },
});

const forgotPasswordPath = "forgot-password";
export const ForgotPasswordRoute: IElementRoute = new ElementRoute({
  routeObject: {
    path: forgotPasswordPath,
    element: <Page.ForgotPasswordPage />,
  },
  name: "Forgot Password",
  icon: <VideoCameraOutlined />,
  link: () => `/${forgotPasswordPath}`,
  visible: true,
  secureRoute: false,
  showInSidebar: false,
  pathExtras: {
    showSider: false,
    showHeader: false,
    showFooter: false,
  },
});

const error404Path = "*";
export const Error404Route: IElementRoute = new ElementRoute({
  routeObject: {
    path: error404Path,
    element: <Page.Error404Page />,
  },
  name: "Error 404",
  icon: <VideoCameraOutlined />,
  link: () => "",
  visible: true,
  secureRoute: false,
  showInSidebar: false,
  pathExtras: {
    showSider: false,
    showHeader: false,
    showFooter: false,
  },
});

export const appRoutes: IElementRoute[] = [
  HomeRoute,
  MetricsRoute,
  ProgressRoute,
  GoalsRoute,
  SettingsRoute,
  LogInRoute,
  Error404Route,
  LogoutRoute,
  ForgotPasswordRoute,
];
