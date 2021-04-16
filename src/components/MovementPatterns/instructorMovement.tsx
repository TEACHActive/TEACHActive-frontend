import * as React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Label } from "recharts";

export interface IInstructorMovementProps {
  movementPatternData: any[] | undefined;
}

export function InstructorMovement(props: IInstructorMovementProps) {
  return (
    <LineChart width={400} height={200} data={props.movementPatternData}>
      <Line
        type="monotone"
        dataKey="avgXPos"
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
      <YAxis
        label={{
          value: "Horizontal position in the room",
          angle: -90,
          position: "insideLeft",
        }}
      />
    </LineChart>
  );
}
