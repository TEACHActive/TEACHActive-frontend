import * as React from "react";

import "./resources.scss";

export interface IResourcesPagePresentationalProps {}

export function ResourcesPagePresentational(
  props: IResourcesPagePresentationalProps
) {
  return (
    <div className="resourcesPresentational" style={{ height: "100%" }}>
      <iframe
        className="docFrame"
        src="https://docs.google.com/document/d/e/2PACX-1vSGO9onowmc5-7SBN2-YHLNx9CyyTrNkiqvzlYOHHoL43LrCW8ixi1tKgq1i8LJ98wX9CQ8pwLgxyaQ/pub?embedded=true"
      ></iframe>
    </div>
  );
}
