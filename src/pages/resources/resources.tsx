import * as React from "react";
import { ResourcesPagePresentational } from "./resourcesPresentational";

import "./resources.scss";

export interface IResourcesPageProps {}

export function ResourcesPage(props: IResourcesPageProps) {
  return <ResourcesPagePresentational />;
}
