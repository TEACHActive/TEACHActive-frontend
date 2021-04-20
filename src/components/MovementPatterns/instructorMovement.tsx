import * as React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";

export interface IInstructorMovementProps {
  movementPatternData: any[] | undefined;
}

export function InstructorMovement(props: IInstructorMovementProps) {
  // console.log(props.movementPatternData);

  const agumentedMovementPatternData = props.movementPatternData?.map(
    (data) => {
      return {
        ...data,
        podiumPos: [960, 980],
      };
    }
  );

  return (
    <ComposedChart width={400} height={200} data={agumentedMovementPatternData}>
      <Line
        type="monotone"
        dataKey="avgXPos"
        stroke="#8884d8"
        strokeWidth={2}
      />
      <Area
        type="monotone"
        dataKey="podiumPos"
        stroke="#8884d8"
        dot={false}
        strokeWidth={2}
      />
      <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
      <XAxis dataKey="timestamp">
        <Label
          value="Minutes elapsed in session"
          offset={0}
          position="insideBottom"
        />
      </XAxis>
      <Tooltip />
      <YAxis
        domain={["dataMin", "dataMax"]}
        label={{
          value: "Left <==> Right",
          angle: -90,
          position: "insideBottomLeft",
        }}
      />
    </ComposedChart>
  );
}
