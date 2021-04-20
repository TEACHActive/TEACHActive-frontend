import React from "react";
import { Menu, Layout } from "antd";

import { ComponentRoute, routes } from "routes";
import { useHistory } from "react-router-dom";

const { Sider } = Layout;

export interface ISidebarProps {}

export function Sidebar(props: ISidebarProps) {
  const history = useHistory();
  return (
    <Sider breakpoint="lg" collapsedWidth="0" style={{ flexGrow: 4 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div style={{ flexGrow: 10 }}>
          <div className="logo" />

          <Menu theme="dark" mode="inline">
            {routes
              .filter((item: ComponentRoute) => item.inSidebar)
              .map((item: ComponentRoute, i: number) => (
                <Menu.Item
                  key={i}
                  icon={item.icon}
                  title={item.name}
                  onClick={() => history.push(item.link())}
                >
                  {item.name}
                </Menu.Item>
              ))}
          </Menu>
        </div>
        <p
          style={{
            flexShrink: 1,
            color: "white",
            alignSelf: "center",
            fontSize: 10,
          }}
        >
          Version: {process.env.REACT_APP_VERSION}
        </p>
      </div>
    </Sider>
  );
}
