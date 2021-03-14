import * as React from "react";
import { Typography, Collapse } from "antd";
import { Session } from "../metric/metricPage.types";
import HandRaisesForm from "./handRaisesForm";

const { Title } = Typography;
const { Panel } = Collapse;

export interface IGoalsPagePresentationalProps {
  session: Session;
  reflections: any[];
}

/**
 * Page for setting goals and logging reflections
 * Note: This component would benifit from using Formik
 * @param props
 */
export default function GoalsPagePresentational(
  props: IGoalsPagePresentationalProps
) {
  return (
    <Collapse defaultActiveKey={["1"]}>
      <Panel header="Hand Raises" key="1">
        <HandRaisesForm session={props.session} />
      </Panel>
      <Panel header="Hand" key="2"></Panel>
    </Collapse>
  );
}
