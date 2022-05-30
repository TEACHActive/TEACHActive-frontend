import * as React from "react";
import { ResourcesPagePresentational } from "./resourcesPresentational";

import "./resources.scss";

export interface IResourcesPageProps {}

export function ResourcesPage(props: IResourcesPageProps) {
  return (
    <div style={{ height: "100%" }}>
      <ResourcesPagePresentational />
    </div>
  );
}
