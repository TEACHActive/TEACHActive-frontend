import { Link } from "react-router-dom";
import { Dropdown, Button, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";

import { MetricsRoute, GoalsRoute, ProgressRoute } from "routes";
import { LogoutButton } from "components/UserManagment/logoutButton";

import goalsIcon from "images/goals.png";
import MainLogo from "images/MainLogo.png";
import progressIcon from "images/progress.png";
import dashboardIcon from "images/dashboard.png";
import reflectionsIcon from "images/reflections.png";

import "./home.scss";

export interface IHomePagePresentationalProps {
  instructorName: string;
}

const menu = (
  <Menu>
    {/* <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="">
          Profile
        </a>
      </Menu.Item> */}
    <Menu.Item key="logout">
      <LogoutButton />
    </Menu.Item>
  </Menu>
);

export function HomePagePresentational(props: IHomePagePresentationalProps) {
  return (
    <div className="homePage">
      <div>
        <div className="homeMenu">
          <Dropdown overlay={menu} placement="bottomRight">
            <Button className="userMenuButton">
              <UserOutlined style={{ fontSize: "18px" }} />
            </Button>
          </Dropdown>
        </div>

        <div className="homePageTop">
          <img className="topMainLogo" src={MainLogo} alt="TEACHActive Logo" />
        </div>
      </div>
      <div className="homePageCenter">
        <p className="title">
          <b>{`Welcome back ${props.instructorName}!`}</b>
        </p>
        <div>
          <p className="subtitle">What would you like to see today?</p>
        </div>
      </div>

      <div
        style={{
          flexGrow: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div className="homePageBottom">
          {[
            {
              to: MetricsRoute.link(),
              imgSrc: dashboardIcon,
              name: "Dashboard",
              alt: "Go to Dashboard",
            },
            {
              to: GoalsRoute.link(),
              imgSrc: reflectionsIcon,
              name: "Reflections",
              alt: "Go to Reflections",
            },
            {
              to: GoalsRoute.link(),
              imgSrc: goalsIcon,
              name: "Goals",
              alt: "Go to Goals",
            },
            {
              to: ProgressRoute.link(),
              imgSrc: progressIcon,
              name: "Progress",
              alt: "Go to Progress",
            },
          ].map((link, i) => (
            <Link to={link.to} key={i}>
              <Button className="mainMenuButton">
                <div>
                  <img
                    className="mainMenuIcon"
                    src={link.imgSrc}
                    alt={link.alt}
                  />
                  <p className="subtitle">{link.name}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
