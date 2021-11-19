import {
  Line,
  Area,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  CartesianGrid,
  ComposedChart,
} from "recharts";
import { useSelector } from "react-redux";
import { DurationObjectUnits } from "luxon";
import { selectSelectedSession } from "redux/sessionSlice";
import { useGetInstructorMovementInSessionQuery } from "api/services/movement";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { Result, Spin } from "antd";
import { InstructorMovementFrame } from "api/services/movement/types";
import { Heatmap } from "./heatmap";

// import Heatmap from "./heatmap";

export interface IInstructorMovementProps {}

type AgumentedInstructorMovementData = {
  podiumPos: number[];
  startTimestamp: {
    [unit: string]: keyof DurationObjectUnits;
  };
  avgX: number;
}[];

export function InstructorMovement(props: IInstructorMovementProps) {
  const selectedSession = useSelector(selectSelectedSession);

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useGetInstructorMovementInSessionQuery(
    selectedSession
      ? { sessionId: selectedSession.id, numSegments: 50 }
      : skipToken
  );

  if (isLoading || isFetching) {
    return <Spin />;
  }
  if (isError || !data?.data) {
    return (
      <Result
        status="error"
        subTitle="Error when loading Instructor Movement"
      />
    );
  }

  const movementData = data.data.map(
    (frame) => new InstructorMovementFrame(frame)
  );

  console.log(movementData);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ComposedChart width={500} height={300} data={movementData}>
        <Line
          type="basis"
          dataKey="instructor.avg.xPos"
          stroke="#8884d8"
          strokeWidth={2}
          connectNulls={true}
          dot={false}
        />
        {/* <Area
          type="monotone"
          dataKey="podiumPos"
          stroke="#8884d8"
          dot={false}
          strokeWidth={2}
        /> */}
        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
        <XAxis dataKey="timeDiffMinutes">
          <Label
            value="Minutes elapsed in session"
            offset={0}
            position="insideBottom"
          />
        </XAxis>
        <Tooltip />
        <YAxis
          dataKey="instructor.avg.xPos"
          domain={["dataMin", "dataMax"]}
          label={{
            value: "Left <==> Right",
            angle: -90,
            position: "insideBottomLeft",
          }}
          tick={false}
        />
      </ComposedChart>
      <div style={{ margin: "2em" }}>
        <Heatmap data={movementData.map((im) => im.instructor.avg.xPos)} />
      </div>
    </div>
  );
}
