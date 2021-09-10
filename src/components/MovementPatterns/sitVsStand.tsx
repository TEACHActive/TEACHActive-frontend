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
  const getSitVsStand = useCallback(async (sessionId: string) => {
    setLoading(true);
    const sitVsStandData = await apiHandler.getStudentSitVsStandInSession(
      sessionId
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
            sitNumber: Math.round(chunk.sitNumber / 15),
            standNumber: Math.round(chunk.standNumber / 15),
            errorNumber: Math.round(chunk.errorNumber / 15),
          };
        });

      setSitStandData(test);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    console.log("reloading sit vs stand with id " + selectedSession.id);

    getSitVsStand(selectedSession.id);
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
