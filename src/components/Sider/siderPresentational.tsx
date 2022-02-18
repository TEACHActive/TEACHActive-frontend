import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons";

import { ElementRoute, HomeRoute } from "routes";

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
  const navigate = useNavigate();

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
      trigger={
        props.collapsed ? (
          <StepForwardOutlined className="collapseIcon" />
        ) : (
          <StepBackwardOutlined className="collapseIcon" />
        )
      }
    >
      {props.collapsed ? (
        <Link className="logo logoSmall" to={HomeRoute.link()}>
          <img src={LogoSmall} alt="TEACHActive Logo" />
        </Link>
      ) : (
        <Link className="logo logoMain" to={HomeRoute.link()}>
          <img src={MainLogo} alt="TEACHActive Main Logo" />
        </Link>
      )}
      <Menu mode="inline" theme="dark" className="siderMenu">
        {props.menuItems.map((menuItem, i) => {
          return (
            <Menu.Item
              icon={menuItem.icon}
              key={i}
              className={
                props.collapsed
                  ? "siderMenuItem--collapsed"
                  : "siderMenuItem--expanded"
              }
              onClick={() => navigate(menuItem.link({}))}
            >
              {menuItem.name}
            </Menu.Item>
          );
        })}
      </Menu>
    </AntSider>
  );
}
