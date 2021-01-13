import * as React from "react";
import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";

export interface IInstructorMovementProps {}

enum SelectedActivity {
  SitVsStand,
  MovementPatterns,
}

export function InstructorMovement(props: IInstructorMovementProps) {
  const [selectedActivity, setSelectedActivity] = React.useState(
    SelectedActivity.SitVsStand
  );
  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => setSelectedActivity(SelectedActivity.SitVsStand)}
      >
        Sit vs. Stand
      </Menu.Item>
      <Menu.Item
        onClick={() => setSelectedActivity(SelectedActivity.MovementPatterns)}
      >
        Movement Patterns
      </Menu.Item>
    </Menu>
  );
  const data = [
    { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 300, pv: 2400, amt: 2400 },
    { name: "Page C", uv: 300, pv: 2400, amt: 2400 },
    { name: "Page D", uv: 200, pv: 2400, amt: 2400 },
    { name: "Page E", uv: 278, pv: 2400, amt: 2400 },
    { name: "Page F", uv: 189, pv: 2400, amt: 2400 },
  ];
  return (
    <div>
      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          {SelectedActivity[selectedActivity]} <DownOutlined />
        </a>
      </Dropdown>
      {selectedActivity === SelectedActivity.SitVsStand && (
        <LineChart width={400} height={200} data={data}>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
        </LineChart>
      )}
    </div>
  );
}
