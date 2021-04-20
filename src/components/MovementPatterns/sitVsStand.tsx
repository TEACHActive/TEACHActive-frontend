import { message, Spin, Tooltip } from "antd";
import * as React from "react";
import {
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  Tooltip as RechartsTooltip,
  Label,
} from "recharts";
import { SitStand, VideoFrame, VideoFrameSession } from "../../api/types";
import { chunkArray } from "../../util";

export interface ISitVsStandProps {
  videoFrames: {
    instructor: VideoFrameSession[];
    student: VideoFrameSession[];
  };
}

const toPercent = (decimal: number, fixed = 0) =>
  `${(decimal * 100).toFixed(fixed)}%`;

const defaultResolution = 10;

export function SitVsStand(props: ISitVsStandProps) {
  const [sitStandData, setSitStandData] = React.useState<
    {
      sit: number;
      stand: number;
      error: number;
      other: number;
      frameNumber: number;
      timestamp: number;
    }[]
  >();
  const [resolution, setResolution] = React.useState(defaultResolution);

  React.useEffect(() => {
    if (props.videoFrames.student[0])
      calculateSitStandData(props.videoFrames.student[0].videoFrames);
    else message.error("error whil processing sit stand data");
  }, []);

  const calculateSitStandData = (studentVideoFrames: VideoFrame[]) => {
    const initialDateTime = studentVideoFrames[0].timestamp;
    const sitStandData = studentVideoFrames.map((frame) => {
      // const currentTimeMins = Math.round(
      //   frame.timestamp.diff(initialDateTime, "minutes").minutes
      // );
      return {
        frameNumber: frame.frameNumber,
        timestamp: frame.timestamp,
        sitStand: frame.people.length > 0 ? frame.people[0].sitStand : "error",
      };
    });

    const chunkLength = sitStandData.length / resolution;
    const test = chunkArray<typeof sitStandData[0]>(sitStandData, chunkLength)
      .map((chunk) => {
        const beginingTimestampMins = Math.round(
          chunk[0].timestamp.diff(initialDateTime, "minutes").minutes
        );
        const beginingFrameNumber = chunk[0].frameNumber;
        return chunk.reduce(
          (accumulator, currentValue) => {
            // accumulator[currentValue.sitStand] =
            //   (accumulator[currentValue.sitStand] || 0) + 1;
            return {
              ...accumulator,
              sit: accumulator.sit +=
                currentValue.sitStand === SitStand.Sit ? 1 : 0,
              stand: accumulator.stand +=
                currentValue.sitStand === SitStand.Stand ? 1 : 0,
              error: accumulator.error +=
                currentValue.sitStand === SitStand.Error ? 1 : 0,
              other: accumulator.other +=
                currentValue.sitStand === SitStand.Other ? 1 : 0,
            };
          },
          {
            sit: 0,
            stand: 0,
            error: 0,
            other: 0,
            frameNumber: beginingFrameNumber,
            timestamp: beginingTimestampMins,
          }
        );
      })
      .map(
        (chunkedSitStandData: {
          sit: number;
          stand: number;
          error: number;
          other: number;
          frameNumber: number;
          timestamp: number;
        }) => {
          const {
            sit,
            stand,
            error,
            other,
            frameNumber,
            timestamp,
          } = chunkedSitStandData;
          const totalReadings = sit + stand + error + other;
          return {
            sit: Math.round((sit / totalReadings) * 100),
            stand: Math.round((stand / totalReadings) * 100),
            error: Math.round((error / totalReadings) * 100),
            other: Math.round((other / totalReadings) * 100),
            frameNumber: frameNumber,
            timestamp: timestamp,
          };
        }
      );
    setSitStandData(test);
    console.log(sitStandData);
  };

  if (!sitStandData) {
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
      <XAxis dataKey="timestamp">
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
        dataKey={SitStand.Sit}
        stackId="1"
        stroke="#1e7fc7"
        fill="#1e7fc7"
      />
      <Area
        type="monotone"
        dataKey={SitStand.Stand}
        stackId="1"
        stroke="#2bc44f"
        fill="#2bc44f"
      />
      <Area
        type="monotone"
        dataKey={SitStand.Error}
        stackId="1"
        stroke="#ffffff"
        fill="#ffffff"
      />
    </AreaChart>
  );
}
