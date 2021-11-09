import * as React from "react";

import { Menu, Dropdown, Button, Space, Spin } from "antd";
import MainLogo from "../../images/MainLogo.png";
import dashboardIcon from "../../images/dashboard.png";
import goalsIcon from "../../images/goals.png";
import progressIcon from "../../images/progress.png";
import reflectionsIcon from "../../images/reflections.png";
import userIcon from "../../images/user.png";
import { Link } from "react-router-dom";
import { MetricsRoute, GoalsRoute, ProgressRoute } from "../../routes";

import "./home.css";
import apiHandler from "api/handler";

export interface IHomePageProps {
  user: firebase.default.User;
}

export default function HomePage(props: IHomePageProps) {
  const [instructorName, setInstructorName] = React.useState<
    string | undefined
  >(undefined);

  React.useEffect(() => {
    async function fetchMyAPI() {
      let response;
      try {
        response = await apiHandler.getInstructorName(props.user.uid);
        setInstructorName(response?.name);
      } catch (e) {}
    }
    fetchMyAPI();
  }, []);

  if (!instructorName) {
    return <Spin />;
  }

  return (
    <div className="homePage">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="homeMenu">
          <Dropdown overlay={menu} placement="bottomRight">
            <Button className="userMenuButton" />
          </Dropdown>
        </div>

        <div className="homePageTop">
          <img className="topMainLogo" src={MainLogo} />
        </div>
      </div>
      <div className="homePageCenter">
        <p className="title">
          <b>{`Welcome back ${instructorName}!`}</b>
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
          <Link to={MetricsRoute.link()}>
            <Button className="mainMenuButton">
              <div>
                <img className="mainMenuIcon" src={dashboardIcon} />
                <p className="subtitle">Dashboard</p>
              </div>
            </Button>
          </Link>

          <Link to={GoalsRoute.link()}>
            <Button className="mainMenuButton">
              <div>
                <img className="mainMenuIcon" src={reflectionsIcon} />
                <p className="subtitle">Reflections</p>
              </div>
            </Button>
          </Link>

          <Link to={GoalsRoute.link()}>
            <Button className="mainMenuButton">
              <div>
                <img className="mainMenuIcon" src={goalsIcon} />
                <p className="subtitle">Goals</p>
              </div>
            </Button>
          </Link>

          <Link to={ProgressRoute.link()}>
            <Button className="mainMenuButton">
              <div>
                <img className="mainMenuIcon" src={progressIcon} />
                <p className="subtitle">Progress</p>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

const menu = (
  <Menu>
    {/* <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="">
        Profile
      </a>
    </Menu.Item> */}
    <Menu.Item>
      <Link to="/">
        <a target="_blank" rel="noopener noreferrer">
          Logout
        </a>
      </Link>
    </Menu.Item>
  </Menu>
);
