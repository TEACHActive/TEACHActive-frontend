/**
 * Contains the routes to be available in the dashboard
 */
import React from "react";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

import { Error404Page, LoginPage } from "./pages";
import { RouteObject } from "react-router-dom";
//  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Details describing routes and elements that show
 */
export interface IElementRoute {
  routeObject: RouteObject; // Contains path, element, and children
  name: string; // The name of the route
  icon: React.ReactNode; // Icon representing the path
  link: (data?: any) => string; //
  visible: boolean; //
  secureRoute: boolean; //
  pathExtras: {
    showSidebar: boolean;
    showHeader: boolean;
  };
}

export class ElementRoute implements IElementRoute {
  routeObject: RouteObject;
  name: string;
  icon: React.ReactNode;
  link: (data: any) => string;
  visible: boolean;
  secureRoute: boolean;
  pathExtras: {
    showSidebar: boolean;
    showHeader: boolean;
  };

  constructor(data: IElementRoute) {
    this.routeObject = data.routeObject;
    this.name = data.name;
    this.icon = data.icon;
    this.link = data.link;
    this.visible = data.visible;
    this.secureRoute = data.secureRoute;
    this.pathExtras = data.pathExtras ?? {
      showSidebar: false,
      showHeader: false,
    };
  }
}

const basePath = "";
export const BaseRoute: IElementRoute = new ElementRoute({
  routeObject: {
    path: basePath,
    element: (
      <>
        <h1>Base Path</h1>
      </>
    ),
  },
  name: "Base",
  icon: <UserOutlined />,
  link: () => basePath,
  visible: true,
  secureRoute: false,
  pathExtras: {
    showSidebar: false,
    showHeader: false,
  },
});

const homePath = "home";
export const HomeRoute: IElementRoute = new ElementRoute({
  routeObject: {
    path: homePath,
    element: (
      <>
        <h1>Home Path</h1>
      </>
    ),
  },
  name: "Home",
  icon: <UserOutlined />,
  link: () => homePath,
  visible: true,
  secureRoute: true,
  pathExtras: {
    showSidebar: false,
    showHeader: false,
  },
});

const metricsPath = "metrics";
export const MetricsRoute: IElementRoute = new ElementRoute({
  routeObject: {
    path: metricsPath,
    element: (
      <>
        <h1>Metrics Path</h1>
      </>
    ),
  },
  name: "Metrics",
  icon: <UserOutlined />,
  link: () => metricsPath,
  visible: true,
  secureRoute: true,
  pathExtras: {
    showSidebar: true,
    showHeader: true,
  },
});

const progressPath = "progress";
export const ProgressRoute: IElementRoute = new ElementRoute({
  routeObject: {
    path: progressPath,
    element: (
      <>
        <h1>Progress Path</h1>
      </>
    ),
  },
  name: "Progress",
  icon: <UserOutlined />,
  link: () => progressPath,
  visible: true,
  secureRoute: true,
  pathExtras: {
    showSidebar: true,
    showHeader: true,
  },
});

const goalsPath = "goals";
export const GoalsRoute: IElementRoute = new ElementRoute({
  routeObject: {
    path: progressPath,
    element: (
      <>
        <h1>Goals Path</h1>
      </>
    ),
  },
  name: "Goals",
  icon: <UserOutlined />,
  link: () => goalsPath,
  visible: true,
  secureRoute: true,
  pathExtras: {
    showSidebar: true,
    showHeader: true,
  },
});

const settingsPath = "settings";
export const SettingsRoute: IElementRoute = new ElementRoute({
  routeObject: {
    path: settingsPath,
    element: (
      <>
        <h1>Settings Path</h1>
      </>
    ),
  },
  name: "Settings",
  icon: <UserOutlined />,
  link: () => settingsPath,
  visible: true,
  secureRoute: true,
  pathExtras: {
    showSidebar: true,
    showHeader: true,
  },
});

const logInPath = "login";
export const LogInRoute: IElementRoute = new ElementRoute({
  routeObject: {
    path: logInPath,
    element: <LoginPage />,
  },
  name: "Sign In",
  icon: <VideoCameraOutlined />,
  link: () => "/login",
  visible: true,
  secureRoute: false,
  pathExtras: {
    showSidebar: false,
    showHeader: false,
  },
});

const error404Path = "*";
export const Error404Route: IElementRoute = new ElementRoute({
  routeObject: {
    path: error404Path,
    element: <Error404Page />,
  },
  name: "Error 404",
  icon: <VideoCameraOutlined />,
  link: () => "",
  visible: true,
  secureRoute: false,
  pathExtras: {
    showSidebar: false,
    showHeader: false,
  },
});

export const appRoutes: IElementRoute[] = [
  BaseRoute,
  HomeRoute,
  MetricsRoute,
  ProgressRoute,
  GoalsRoute,
  SettingsRoute,
  LogInRoute,
  Error404Route,
];
