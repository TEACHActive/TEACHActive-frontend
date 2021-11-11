import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";

import { ElementRoute } from "routes";

import MainLogoGray from "images/MainLogo-Gray.png";
import LogoSmallGray from "images/LogoSmall-Gray.png";
import MainLogoWhite from "images/MainLogo-Gray.png";
import LogoSmallWhite from "images/LogoSmall-Gray.png";

import "./sider.scss";

const { Sider: AntSider } = Layout;

export interface ISiderPresentationalProps {
  menuItems: ElementRoute[];
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function SiderPresentational(props: ISiderPresentationalProps) {
  let navigate = useNavigate();

  const useDefaultColors = false;
  const MainLogo = useDefaultColors ? MainLogoWhite : MainLogoGray;
  const LogoSmall = useDefaultColors ? LogoSmallWhite : LogoSmallGray;

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
          <img src={LogoSmall} alt="TEACHActive Logo" />
        </div>
      ) : (
        <div className="logo logoMain">
          <img src={MainLogo} alt="TEACHActive Main Logo" />
        </div>
      )}
      <Menu mode="inline" theme="dark" className="siderMenu">
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
