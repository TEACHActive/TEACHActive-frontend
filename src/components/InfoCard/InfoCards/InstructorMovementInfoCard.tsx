import { InstructorMovement } from "components/Graphs/InstructorMovement/instructorMovement";
import * as React from "react";

import { InfoCard } from "../infoCard";

import "../infoCard.scss";

export interface IInstructorMovementInfoCardProps {
  sessionId?: string;
}

export function InstructorMovementInfoCard(
  props: IInstructorMovementInfoCardProps
) {
  return (
    <InfoCard
      color={{ light: "#ED80A2", dark: "#D1728F" }}
      title="Instructor Movement"
      helpWindowContent={<p>Movement Patterns during class</p>}
      style={{
        margin: ".5em",
        overflowY: "auto",
        overflowX: "hidden",
        height: "100%",
      }}
    >
      <div className="infoCardContent">
        <InstructorMovement sessionId={props.sessionId} />
      </div>
    </InfoCard>
  );
}
