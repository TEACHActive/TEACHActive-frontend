import React from "react";
import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  ZAxis,
  Scatter,
} from "recharts";

import { chunkArray } from "../../util";
import { AxisDomain } from "recharts/types/util/types";
import { BaseSession, VideoFrame, VideoFrameSession } from "../../api/types";
import { useSelector } from "react-redux";
import { getSelectedSession } from "../../redux/selectors";

export interface IInstructorMovementProps {
  videoFrames:
    | {
        instructor: VideoFrameSession[];
        student: VideoFrameSession[];
      }
    | undefined;
}
export interface IInstructorMovementState {
  selectedActivity: SelectedActivity;
  sitStandData: any[] | undefined;
  movementPatternData: any[] | undefined;
}

enum SelectedActivity {
  SitVsStand,
  InstructorMovement,
}

const toPercent = (decimal: number, fixed = 0) =>
  `${(decimal * 100).toFixed(fixed)}%`;

export function InstructorMovement(props: IInstructorMovementProps) {
  const [selectedActivity, setSelectedActivity] = React.useState(
    SelectedActivity.SitVsStand
  );
  const [sitStandData, setSitStandData] = React.useState<any[]>();
  const [movementPatternData, setMovementPatternData] = React.useState<any[]>();

  const selectedSession: BaseSession | null = useSelector(
    (state: any) => getSelectedSession(state),
    BaseSession.equal
  );

  React.useEffect(() => {
    if (!props.videoFrames) {
      console.error("error here");
      return;
    }
    const testSitStandData = props.videoFrames.student[0].videoFrames
      .sort((a, b) => a.frameNumber - b.frameNumber)
      .map((frame) => {
        return {
          frameNumber: frame.frameNumber,
          sitStand:
            frame.people.length > 0 ? frame.people[0].sitStand : "error",
        };
      });
    // const sitStandData = FramesJSON.frames
    //   .sort(
    //     (frameA: any, frameB: any) => frameA.frameNumber - frameB.frameNumber
    //   )
    //   .map((frame: any) => {
    //     return {
    //       frameNumber: frame.frameNumber,
    //       sitStand:
    //         frame.people.length > 0
    //           ? frame.people[0].inference.posture.sitStand
    //           : "error",
    //     };
    //   });
    const test = chunkArray(testSitStandData, 10).map((chunk) =>
      chunk.reduce(
        (accumulator, currentValue) => {
          accumulator[currentValue.sitStand] =
            (accumulator[currentValue.sitStand] || 0) + 1;
          return accumulator;
        },
        { sit: 0, stand: 0, error: 0 }
      )
    );
    setSitStandData(test);

    const movementPatternData = props.videoFrames.instructor[0].videoFrames
      .sort((a, b) => a.frameNumber - b.frameNumber)
      .map((frame) => {
        return {
          frameNumber: frame.frameNumber,
          xPos: frame.people.length > 0 ? frame.people[0].body[3] : "error",
        };
      });

    setMovementPatternData(movementPatternData);
  }, []);

  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => setSelectedActivity(SelectedActivity.SitVsStand)}
      >
        Sit vs. Stand
      </Menu.Item>
      <Menu.Item
        onClick={() => setSelectedActivity(SelectedActivity.InstructorMovement)}
      >
        Instructor Movement
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          {SelectedActivity[selectedActivity]} <DownOutlined />
        </a>
      </Dropdown>
      {selectedActivity === SelectedActivity.SitVsStand && (
        <AreaChart
          width={400}
          height={300}
          data={sitStandData}
          stackOffset="expand"
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="frameNumber" />
          <YAxis tickFormatter={toPercent} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="sit"
            stackId="1"
            stroke="#82caFF"
            fill="#82caFF"
          />
          <Area
            type="monotone"
            dataKey="stand"
            stackId="1"
            stroke="#64FF88"
            fill="#64FF88"
          />
          <Area
            type="monotone"
            dataKey="error"
            stackId="1"
            stroke="#FF6464"
            fill="#FF6464"
          />
        </AreaChart>
      )}
      {selectedActivity === SelectedActivity.InstructorMovement && (
        <>
          <LineChart width={400} height={200} data={movementPatternData}>
            <Line type="monotone" dataKey="xPos" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="frameNumber" />
            <YAxis dataKey="xPos" />
            <Tooltip />
          </LineChart>
        </>
      )}
    </div>
  );
}
