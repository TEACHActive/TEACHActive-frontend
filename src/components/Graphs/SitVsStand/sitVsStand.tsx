import {
  Area,
  XAxis,
  YAxis,
  Label,
  AreaChart,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import * as React from "react";
import apiHandler from "api/handler";
import { useCallback } from "react";
import { message, Spin } from "antd";
import { useSelector } from "react-redux";
import { DurationObjectUnits } from "luxon";
import { selectSelectedSession } from "redux/sessionSlice";

export interface ISitVsStandProps {}

const toPercent = (decimal: number, fixed = 0) =>
  `${(decimal * 100).toFixed(fixed)}%`;

// const defaultResolution = 10;

export function SitVsStand(props: ISitVsStandProps) {
  const selectedSession = useSelector(selectSelectedSession);

  //   const [loading, setLoading] = React.useState(true);
  //   const [sitStandData, setSitStandData] = React.useState<
  //     {
  //       sitNumber: number;
  //       standNumber: number;
  //       errorNumber: number;
  //       startTimeDiff: {
  //         [unit: string]: keyof DurationObjectUnits;
  //       };
  //     }[]
  //   >([]);
  //   const getSitVsStand = useCallback(async (sessionId: string) => {
  //     setLoading(true);
  //     const sitVsStandData = await apiHandler.getStudentSitVsStandInSession(
  //       sessionId
  //     );
  //     // console.log(sitVsStandData?.slice(0, 1000));

  //     if (sitVsStandData) {
  //       const chunkLength = sitVsStandData.length / defaultResolution;

  //       const chunkedEngagementData = chunkArray(sitVsStandData, chunkLength);
  //       // console.log(chunkedEngagementData);

  //       const test = chunkedEngagementData
  //         .map((chunk) => {
  //           const startTimeDiff = chunk[0].timeDiff;
  //           // const chunkLength = chunk.length;
  //           const initialFrameNumber = chunk[0].frameNumber;
  //           return chunk.reduce(
  //             (acc, curr) => {
  //               return {
  //                 ...acc,
  //                 sitNumber: acc.sitNumber + curr.sitNumber,
  //                 standNumber: acc.standNumber + curr.standNumber,
  //                 errorNumber: acc.errorNumber + curr.errorNumber,
  //                 totalFrameNumberSum: acc.totalFrameNumberSum + curr.frameNumber,
  //                 chunkNumberFrames: acc.chunkNumberFrames + 1,
  //               };
  //             },
  //             {
  //               sitNumber: 0,
  //               standNumber: 0,
  //               errorNumber: 0,
  //               startTimeDiff: startTimeDiff,
  //               totalFrameNumberSum: 0,
  //               chunkNumberFrames: 0,
  //               initialFrameNumber: initialFrameNumber,
  //             }
  //           );
  //         })
  //         .map((chunk, i, array) => {
  //           return {
  //             ...chunk,
  //             sitNumber: Math.round(chunk.sitNumber / 15),
  //             standNumber: Math.round(chunk.standNumber / 15),
  //             unknownNumber: Math.round(chunk.errorNumber / 15),
  //             frameNumber: chunk.totalFrameNumberSum / chunkLength,
  //             minutes: Math.round(
  //               (parseInt(array[array.length - 1].startTimeDiff.minutes) /
  //                 array.length) *
  //                 i
  //             ),
  //             // minutes: Math.round(
  //             //   (chunk.totalFrameNumberSum - chunk.initialFrameNumber) /
  //             //     chunk.chunkNumberFrames /
  //             //     15 /
  //             //     60
  //             // ),
  //           };
  //         });

  //       console.log(test);

  //       setSitStandData(test);
  //     }
  //     setLoading(false);
  //   }, []);

  //   React.useEffect(() => {
  //     // console.log("reloading sit vs stand with id " + selectedSession.id);

  //     getSitVsStand(selectedSession.id);
  //   }, [getSitVsStand, selectedSession]);

  //   if (loading) {
  //     return <Spin />;
  //   }

  return (
    <AreaChart
      width={400}
      height={300}
      data={[]}
      stackOffset="expand"
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="minutes">
        <Label
          value="Minutes elapsed in session"
          offset={0}
          position="insideBottom"
        />
      </XAxis>
      <YAxis
        tickFormatter={(value: any, index: number) => toPercent(value, 0)}
        label={{
          value: "Percentage of students in each state",
          angle: -90,
          position: "center",
        }}
      />
      <RechartsTooltip />
      <Area
        type="monotone"
        dataKey="unknownNumber"
        stackId="1"
        stroke="#f0000"
        fill="#ff0000"
      />
      <Area
        type="monotone"
        dataKey="standNumber"
        stackId="1"
        stroke="#2bc44f"
        fill="#2bc44f"
      />
      <Area
        type="monotone"
        dataKey="sitNumber"
        stackId="1"
        stroke="#1e7fc7"
        fill="#1e7fc7"
      />
    </AreaChart>
  );
}
