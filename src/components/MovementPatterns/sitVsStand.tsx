import * as React from "react";
import { message, Spin } from "antd";
import {
  Area,
  XAxis,
  YAxis,
  Label,
  AreaChart,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";

import { chunkArray } from "../../util";
import {
  BaseSession,
  SitStand,
  SitStandInFrame,
  VideoFrame,
  VideoFrameSession,
} from "api/types";
import { useCallback } from "react";
import apiHandler from "api/handler";
import { useSelector } from "react-redux";
import { getSelectedSession } from "redux/selectors";
import { DurationObjectUnits } from "luxon";
import { RootState } from "redux/store";

export interface ISitVsStandProps {}

const toPercent = (decimal: number, fixed = 0) =>
  `${(decimal * 100).toFixed(fixed)}%`;

const defaultResolution = 10;

export function SitVsStand(props: ISitVsStandProps) {
  const selectedSession: BaseSession | null = useSelector(
    (state: RootState) => getSelectedSession(state),
    BaseSession.equal
  );

  const [loading, setLoading] = React.useState(true);
  const [sitStandData, setSitStandData] = React.useState<
    {
      sitNumber: number;
      standNumber: number;
      errorNumber: number;
      startTimeDiff: {
        [unit: string]: keyof DurationObjectUnits;
      };
    }[]
  >([]);
  // const [resolution, _] = React.useState(defaultResolution); //Todo: setResolution

  // const calculateSitStandData = useCallback(
  //   (studentVideoFrames: VideoFrame[]) => {
  //     const initialDateTime = studentVideoFrames[0].timestamp;
  //     const sitStandData = studentVideoFrames.map((frame) => {
  //       // const currentTimeMins = Math.round(
  //       //   frame.timestamp.diff(initialDateTime, "minutes").minutes
  //       // );
  //       return {
  //         frameNumber: frame.frameNumber,
  //         timestamp: frame.timestamp,
  //         sitStand:
  //           frame.people.length > 0 ? frame.people[0].sitStand : "error",
  //       };
  //     });

  //     const chunkLength = sitStandData.length / defaultResolution;
  //     const test = chunkArray<typeof sitStandData[0]>(sitStandData, chunkLength)
  //       .map((chunk) => {
  //         const beginingTimestampMins = Math.round(
  //           chunk[0].timestamp.diff(initialDateTime, "minutes").minutes
  //         );
  //         const beginingFrameNumber = chunk[0].frameNumber;
  //         return chunk.reduce(
  //           (accumulator, currentValue) => {
  //             // accumulator[currentValue.sitStand] =
  //             //   (accumulator[currentValue.sitStand] || 0) + 1;
  //             return {
  //               ...accumulator,
  //               sit: accumulator.sit +=
  //                 currentValue.sitStand === SitStand.Sit ? 1 : 0,
  //               stand: accumulator.stand +=
  //                 currentValue.sitStand === SitStand.Stand ? 1 : 0,
  //               error: accumulator.error +=
  //                 currentValue.sitStand === SitStand.Error ? 1 : 0,
  //               other: accumulator.other +=
  //                 currentValue.sitStand === SitStand.Other ? 1 : 0,
  //             };
  //           },
  //           {
  //             sit: 0,
  //             stand: 0,
  //             error: 0,
  //             other: 0,
  //             frameNumber: beginingFrameNumber,
  //             timestamp: beginingTimestampMins,
  //           }
  //         );
  //       })
  //       .map(
  //         (chunkedSitStandData: {
  //           sit: number;
  //           stand: number;
  //           error: number;
  //           other: number;
  //           frameNumber: number;
  //           timestamp: number;
  //         }) => {
  //           const {
  //             sit,
  //             stand,
  //             error,
  //             other,
  //             frameNumber,
  //             timestamp,
  //           } = chunkedSitStandData;
  //           const totalReadings = sit + stand + error + other;
  //           return {
  //             sit: Math.round((sit / totalReadings) * 100),
  //             stand: Math.round((stand / totalReadings) * 100),
  //             error: Math.round((error / totalReadings) * 100),
  //             other: Math.round((other / totalReadings) * 100),
  //             frameNumber: frameNumber,
  //             timestamp: timestamp,
  //           };
  //         }
  //       );
  //     setSitStandData(test);
  //     console.log(sitStandData);
  //   },
  //   []
  // );

  const getSitVsStand = useCallback(async () => {
    setLoading(true);
    const sitVsStandData = await apiHandler.getStudentSitVsStandInSession(
      selectedSession.id
    );

    if (sitVsStandData) {
      const chunkLength = sitVsStandData.length / defaultResolution;

      const chunkedEngagementData = chunkArray(sitVsStandData, chunkLength);

      const test = chunkedEngagementData
        .map((chunk) => {
          const startTimeDiff = chunk[0].timeDiff;
          return chunk.reduce(
            (acc, curr) => {
              return {
                ...acc,
                sitNumber: acc.sitNumber + curr.sitNumber,
                standNumber: acc.standNumber + curr.standNumber,
                errorNumber: acc.errorNumber + curr.errorNumber,
              };
            },
            {
              sitNumber: 0,
              standNumber: 0,
              errorNumber: 0,
              startTimeDiff: startTimeDiff,
            }
          );
        })
        .map((chunk) => {
          return {
            ...chunk,
            sitNumber: chunk.sitNumber / 15,
            standNumber: chunk.standNumber / 15,
            errorNumber: chunk.errorNumber / 15,
          };
        });

      setSitStandData(test);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    getSitVsStand();
  }, [getSitVsStand, selectedSession]);

  if (loading) {
    return <Spin />;
  }

  return (
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
      <XAxis dataKey="startTimeDiff.minutes">
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
          position: "insideLeft",
        }}
      />
      <RechartsTooltip />
      <Area
        type="monotone"
        dataKey="errorNumber"
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
