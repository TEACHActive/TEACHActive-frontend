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

// import MovementPatternsJSON from "../../data/movementPatterns.json";
// import SitVsStandJSON from "../../data//sitVsStand.json";
import FramesJSON from "../../data/frames.json";
import { chunkArray } from "../../util";
import { AxisDomain } from "recharts/types/util/types";

export interface IInstructorMovementProps {}
export interface IInstructorMovementState {
  selectedActivity: SelectedActivity;
  sitStandData: any[] | undefined;
  movementPatternData: any[] | undefined;
}

enum SelectedActivity {
  SitVsStand,
  MovementPatterns,
}

const toPercent = (decimal: number, fixed = 0) =>
  `${(decimal * 100).toFixed(fixed)}%`;

  const data01 = [
    { hour: '12a', index: 1, value: 170 },
    { hour: '1a', index: 1, value: 180 },
    { hour: '2a', index: 1, value: 150 },
    { hour: '3a', index: 1, value: 120 },
    { hour: '4a', index: 1, value: 200 },
    { hour: '5a', index: 1, value: 300 },
    { hour: '6a', index: 1, value: 400 },
    { hour: '7a', index: 1, value: 200 },
    { hour: '8a', index: 1, value: 100 },
    { hour: '9a', index: 1, value: 150 },
    { hour: '10a', index: 1, value: 160 },
    { hour: '11a', index: 1, value: 170 },
    { hour: '12a', index: 1, value: 180 },
    { hour: '1p', index: 1, value: 144 },
    { hour: '2p', index: 1, value: 166 },
    { hour: '3p', index: 1, value: 145 },
    { hour: '4p', index: 1, value: 150 },
    { hour: '5p', index: 1, value: 170 },
    { hour: '6p', index: 1, value: 180 },
    { hour: '7p', index: 1, value: 165 },
    { hour: '8p', index: 1, value: 130 },
    { hour: '9p', index: 1, value: 140 },
    { hour: '10p', index: 1, value: 170 },
    { hour: '11p', index: 1, value: 180 },
  ];
  
  const data02 = [
    { hour: '12a', index: 1, value: 160 },
    { hour: '1a', index: 1, value: 180 },
    { hour: '2a', index: 1, value: 150 },
    { hour: '3a', index: 1, value: 120 },
    { hour: '4a', index: 1, value: 200 },
    { hour: '5a', index: 1, value: 300 },
    { hour: '6a', index: 1, value: 100 },
    { hour: '7a', index: 1, value: 200 },
    { hour: '8a', index: 1, value: 100 },
    { hour: '9a', index: 1, value: 150 },
    { hour: '10a', index: 1, value: 160 },
    { hour: '11a', index: 1, value: 160 },
    { hour: '12a', index: 1, value: 180 },
    { hour: '1p', index: 1, value: 144 },
    { hour: '2p', index: 1, value: 166 },
    { hour: '3p', index: 1, value: 145 },
    { hour: '4p', index: 1, value: 150 },
    { hour: '5p', index: 1, value: 160 },
    { hour: '6p', index: 1, value: 180 },
    { hour: '7p', index: 1, value: 165 },
    { hour: '8p', index: 1, value: 130 },
    { hour: '9p', index: 1, value: 140 },
    { hour: '10p', index: 1, value: 160 },
    { hour: '11p', index: 1, value: 180 },
  ];

export class InstructorMovement extends React.Component {
  state = {
    selectedActivity: SelectedActivity.SitVsStand,
    sitStandData: undefined,
    movementPatternData: undefined
  };

  componentDidMount() {
    const sitStandData = FramesJSON.frames
      .sort(
        (frameA: any, frameB: any) => frameA.frameNumber - frameB.frameNumber
      )
      .map((frame: any) => {
        return {
          frameNumber: frame.frameNumber,
          sitStand:
            frame.people.length > 0
              ? frame.people[0].inference.posture.sitStand
              : "error",
        };
      });
    const test = chunkArray(sitStandData, 10).map((chunk) =>
      chunk.reduce(
        (accumulator, currentValue) => {
          accumulator[currentValue.sitStand] =
            (accumulator[currentValue.sitStand] || 0) + 1;
          return accumulator;
        },
        { sit: 0, stand: 0, error: 0 }
      )
    );
    const movementPatternData = FramesJSON.frames
      .sort(
        (frameA: any, frameB: any) => frameA.frameNumber - frameB.frameNumber
      )
      .map((frame: any) => {
        return {
          frameNumber: frame.frameNumber,
          xPos:
            frame.people.length > 0
              ? frame.people[0].body[3]
              : "error",
        };
      });

    this.setState({
      sitStandData: test,
      movementPatternData: movementPatternData
    });
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item
          onClick={() =>
            this.setState({ selectedActivity: SelectedActivity.SitVsStand })
          }
        >
          Sit vs. Stand
        </Menu.Item>
        <Menu.Item
          onClick={() =>
            this.setState({
              selectedActivity: SelectedActivity.MovementPatterns,
            })
          }
        >
          Movement Patterns
        </Menu.Item>
      </Menu>
    );

    const parseDomain = (data01: any, data02: any): AxisDomain | undefined => [
      0,
      Math.max(
        Math.max.apply(
          null,
          data01.map((entry: any) => entry.value),
        ),
        Math.max.apply(
          null,
          data02.map((entry: any) => entry.value),
        ),
      ),
    ];

    const { selectedActivity, sitStandData, movementPatternData } = this.state;

    const domain = parseDomain(data01, data02);
    const range = [16, 225];
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
        {selectedActivity === SelectedActivity.MovementPatterns && (
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
}

// export function InstructorMovement(props: IInstructorMovementProps) {
//   const [selectedActivity, setSelectedActivity] = React.useState(
//     SelectedActivity.SitVsStand
//   );
//   const menu = (
//     <Menu>
//       <Menu.Item
//         onClick={() => setSelectedActivity(SelectedActivity.SitVsStand)}
//       >
//         Sit vs. Stand
//       </Menu.Item>
//       <Menu.Item
//         onClick={() => setSelectedActivity(SelectedActivity.MovementPatterns)}
//       >
//         Movement Patterns
//       </Menu.Item>
//     </Menu>
//   );
//   // console.log(FramesJSON);

//   let movementPatternsData;
//   let sitVsStandData;

//   React.useEffect(function () {
//     console.log("useeffect");

//     movementPatternsData = FramesJSON.frames
//       .sort(
//         (frameA: any, frameB: any) => frameA.frameNumber - frameB.frameNumber
//       )
//       .map((frame: any) => {
//         // console.log(frame);

//         return {
//           frameNumber: frame.frameNumber,
//           xPos:
//             frame.people && frame.people[0]
//               ? frame.people[0].body[3] ||
//                 frame.people[0].body[0] ||
//                 frame.people[0].body[24]
//               : null,
//         };
//       });

//     const groupEvery = 10;
//     // console.log(FramesJSON.frames.length / groupEvery);

//     let groupedSitStandData: any = new Array(
//       Math.ceil(FramesJSON.frames.length / groupEvery)
//     ).fill([]);

//     console.log(1, groupedSitStandData);

//     FramesJSON.frames.forEach((frame: any, i: number) => {
//       // if (Math.floor(i / groupEvery) === 0) console.log(2, groupedSitStandData);
//       //console.log(groupedSitStandData[Math.floor(i / groupEvery)]);

//       console.log(i, Math.floor(i / groupEvery));
//       groupedSitStandData[Math.floor(i / groupEvery)].push({});

//       // groupedSitStandData[Math.floor(i / groupEvery)].push({
//       //   frameNumber: frame.frameNumber,
//       //   sitStand:
//       //     frame.people.length > 0
//       //       ? frame.people[0].inference.posture.sitStand
//       //       : "error",
//       // });
//     });
//     console.log(4, groupedSitStandData);
//     sitVsStandData = groupedSitStandData.map(
//       (group: Array<{ frameNumber: number; sitStand: string }>) => {
//         let sitNum = 0,
//           standNum = 0,
//           errorNum = 0;

//         group.forEach((sitStandData) => {
//           switch (sitStandData.sitStand) {
//             case "sit":
//               sitNum++;
//               break;
//             case "stand":
//               standNum++;
//               break;
//             case "error":
//               errorNum++;
//               break;
//             default:
//               break;
//           }
//         });

//         return {
//           frameNumber: group[0].frameNumber,
//           sitNum: sitNum,
//           standNum: standNum,
//           errorNum: errorNum,
//         };
//       }
//     );
//   }, []);

//   // [
//   //   { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
//   //   { name: "Page B", uv: 300, pv: 2400, amt: 2400 },
//   //   { name: "Page C", uv: 300, pv: 2400, amt: 2400 },
//   //   { name: "Page D", uv: 200, pv: 2400, amt: 2400 },
//   //   { name: "Page E", uv: 278, pv: 2400, amt: 2400 },
//   //   { name: "Page F", uv: 189, pv: 2400, amt: 2400 },
//   // ];

//   const toPercent = (decimal: number, fixed = 0) =>
//     `${(decimal * 100).toFixed(fixed)}%`;

//   const getPercent = (value: number, total: number) => {
//     const ratio = total > 0 ? value / total : 0;

//     return toPercent(ratio, 2);
//   };

//   return (
//     <div>
//       <Dropdown overlay={menu}>
//         <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
//           {SelectedActivity[selectedActivity]} <DownOutlined />
//         </a>
//       </Dropdown>
//       {selectedActivity === SelectedActivity.SitVsStand && (
//         <AreaChart
//           width={500}
//           height={400}
//           data={sitVsStandData}
//           stackOffset="expand"
//           margin={{
//             top: 10,
//             right: 30,
//             left: 0,
//             bottom: 0,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="frameNumber" />
//           <YAxis tickFormatter={toPercent} />
//           <Area
//             type="monotone"
//             dataKey="a"
//             stackId="1"
//             stroke="#8884d8"
//             fill="#8884d8"
//           />
//           <Area
//             type="monotone"
//             dataKey="b"
//             stackId="1"
//             stroke="#82ca9d"
//             fill="#82ca9d"
//           />
//           <Area
//             type="monotone"
//             dataKey="c"
//             stackId="1"
//             stroke="#ffc658"
//             fill="#ffc658"
//           />
//         </AreaChart>
//       )}
//       {selectedActivity === SelectedActivity.MovementPatterns && (
//         <LineChart width={400} height={200} data={movementPatternsData}>
//           <Line type="monotone" dataKey="xPos" stroke="#8884d8" />
//           <CartesianGrid stroke="#ccc" />
//           <XAxis dataKey="frameNumber" />
//           <YAxis dataKey="xPos" />
//           <Tooltip />
//         </LineChart>
//       )}
//     </div>
//   );
// }





// <ResponsiveContainer width="100%" height={60}>
//           <ScatterChart
//             width={800}
//             height={60}
//             margin={{
//               top: 10,
//               right: 0,
//               bottom: 0,
//               left: 0,
//             }}
//           >
//             <XAxis
//               type="category"
//               dataKey="hour"
//               interval={0}
//               tick={{ fontSize: 0 }}
//               tickLine={{ transform: 'translate(0, -6)' }}
//             />
//             <YAxis
//               type="number"
//               dataKey="index"
//               name="sunday"
//               height={10}
//               width={80}
//               tick={false}
//               tickLine={false}
//               axisLine={false}
//               label={{ value: 'Sunday', position: 'insideRight' }}
//             />
//             <ZAxis type="number" dataKey="value" domain={domain} range={range} />
//             <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
//             <Scatter data={data01} fill="#8884d8" className=""/>
//           </ScatterChart>
//         </ResponsiveContainer>