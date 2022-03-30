import * as React from "react";

import { InfoCard } from "../infoCard";
import { BehavioralEngagement } from "components/Graphs/BehavioralEngagement/behavioralEngagement";

import "../infoCard.scss";

export interface IClassroomDynamicsInfoCardProps {
  sessionId?: string;
}

export function ClassroomDynamicsInfoCard(
  props: IClassroomDynamicsInfoCardProps
) {
  return (
    <InfoCard
      color={{ light: "#FAB558", dark: "#E09F4B" }}
      title="Classroom Dynamics"
      helpWindowContent={<p>Behavioral Engagement during class</p>}
      style={{ margin: ".5em" }}
    >
      <div className="infoCardContent">
        <BehavioralEngagement sessionId={props.sessionId} />
      </div>
    </InfoCard>
  );
}
