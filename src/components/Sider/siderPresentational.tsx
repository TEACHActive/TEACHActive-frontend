import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";

import { ElementRoute } from "routes";

import MainLogoWhite from "images/MainLogo-White.png";
import LogoSmallWhite from "images/LogoSmall-White.png";

import "./sider.css";

const { Sider: AntSider } = Layout;

export interface ISiderPresentationalProps {
  menuItems: ElementRoute[];
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function SiderPresentational(props: ISiderPresentationalProps) {
  let navigate = useNavigate();

  return (
    <AntSider
      collapsible
      collapsed={props.collapsed}
      onCollapse={(collapsed: boolean) => props.setCollapsed(collapsed)}
      width={200}
      theme="dark"
      className="sider"
    >
      {props.collapsed ? (
        <div className="logo logoSmall">
          <img src={LogoSmallWhite} alt="TEACHActive Logo" />
        </div>
      ) : (
        <div className="logo logoMain">
          <img src={MainLogoWhite} alt="TEACHActive Main Logo" />
        </div>
      )}
      <Menu mode="inline" theme="dark">
        {props.menuItems.map((menuItem, i) => (
          <Menu.Item
            icon={menuItem.icon}
            key={i}
            className="siderMenuItem"
            onClick={() => navigate(menuItem.link({}))}
          >
            {menuItem.name}
          </Menu.Item>
        ))}
      </Menu>
    </AntSider>
  );
}
