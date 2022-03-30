import * as React from "react";

import { InfoCard } from "../infoCard";
import { SitVsStand } from "components/Graphs/SitVsStand/sitVsStand";

import "../infoCard.scss";

export interface ISitVStandInfoCardProps {
  sessionId?: string;
}

export function SitVStandInfoCard(props: ISitVStandInfoCardProps) {
  return (
    <InfoCard
      color={{ light: "#ED80A2", dark: "#D1728F" }}
      title="Sit vs Stand"
      helpWindowContent={<p>Sit vs stand data in session</p>}
      style={{ margin: ".5em" }}
    >
      <div className="infoCardContent">
        <SitVsStand sessionId={props.sessionId} />
      </div>
    </InfoCard>
  );
}
