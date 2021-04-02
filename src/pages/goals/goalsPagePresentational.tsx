import * as React from "react";
import { Typography, Collapse } from "antd";
import { Session } from "../metric/metricPage.types";
import HandRaisesForm from "./handRaisesForm";
import InstructorSpeechForm from "./instructorSpeechForm";
import StudentSpeechForm from "./studentSpeechForm";

const { Title } = Typography;
const { Panel } = Collapse;

export interface IGoalsPagePresentationalProps {
  session: Session;
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
    <Collapse accordion defaultActiveKey={["1"]} style={{ width: "50%" }}>
      <Panel header="Hand Raises" key="1">
        <HandRaisesForm session={props.session} />
      </Panel>
      <Panel header="Instructor Speech" key="2">
        <InstructorSpeechForm session={props.session} />
      </Panel>
      <Panel header="Student Speech" key="3">
        <StudentSpeechForm session={props.session} />
      </Panel>
    </Collapse>
  );
}
