import * as React from "react";

import BlockContent from "../../components/BlockContent/blockContent";

export interface IProgressPagePresentationalProps {}

export function ProgressPagePresentational(
  props: IProgressPagePresentationalProps
) {
  return (
    <div>
      <BlockContent
        color={item.color}
        name={item.name}
        help_text={item.help_text}
        has_alert={item.has_alert}
        icon={icon}
      ></BlockContent>
    </div>
  );
}
