import * as React from "react";
import { Collapse } from "antd";
import axios from "axios";
import { Spin } from "antd";
import HandRaisesForm from "./handRaisesForm";
import InstructorSpeechForm from "./instructorSpeechForm";
import StudentSpeechForm from "./studentSpeechForm";
import { BaseSession } from "../../api/types";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { getMetrics } from "redux/selectors";
import apiHandler from "api/handler";
import { Reflections } from "./goalsPage.types";
import { SectionForm } from "./sectionForm";
import BlockContent from "components/BlockContent/blockContent";
import MetricDisplay from "components/MetricDisplay/metricDisplay";

const { Panel } = Collapse;

export interface IGoalsPagePresentationalProps {
  session: BaseSession;
  user: firebase.default.User;
}

/**
 * Page for setting goals and logging reflections
 * Note: This component would benifit from using Formik
 * @param props
 */
export default function GoalsPagePresentational(
  props: IGoalsPagePresentationalProps
) {
  const metrics: any[] = useSelector((state: RootState) => getMetrics(state));

  const [reflections, setReflections] = React.useState<Reflections>();

  React.useEffect(() => {
    async function fetchMyAPI() {
      const reflections = await apiHandler.getReflections(
        props.session.id,
        props.user.uid
      );
      if (reflections) setReflections(reflections);
    }

    fetchMyAPI();
  }, []);

  if (!reflections) return <Spin />;
  console.log(reflections);

  let handRaiseMetric = metrics.find((metric) => metric.name === "Hand Raises");
  const handRaiseMetricDisplay = (
    <BlockContent
      color={handRaiseMetric.color}
      name={handRaiseMetric.name}
      help_text={handRaiseMetric.help_text}
      has_alert={handRaiseMetric.has_alert}
      icon={handRaiseMetric.icon}
    >
      <MetricDisplay
        metricType={handRaiseMetric.metricType}
        metric={handRaiseMetric.metric}
        metricPrepend={handRaiseMetric.metricPrepend}
        denominator={handRaiseMetric.denominator}
        hasDenominator={handRaiseMetric.hasDenominator}
        unit={handRaiseMetric.unit}
        trend={handRaiseMetric.trend}
        trend_metric={handRaiseMetric.trend_metric}
        trend_metric_unit={handRaiseMetric.trend_metric_unit}
        canEdit={handRaiseMetric.canEdit}
        updateMetric={(newMetric: string) =>
          handRaiseMetric.updateMetric(newMetric)
        }
      >
        {handRaiseMetric.children}
      </MetricDisplay>
    </BlockContent>
  );

  const reflectionSectionMetricMap = new Map([
    [
      "handRaises",
      {
        metricDisplay: handRaiseMetricDisplay,
        comment: (
          <p>
            During this section there were{" "}
            <strong>{handRaiseMetric.metric}</strong> seconds of hand raises
          </p>
        ),
      },
    ],
  ]);

  return (
    <Collapse accordion>
      {reflections.reflectionSections.map((reflectionSection, i) => {
        const metricMap = reflectionSectionMetricMap.get(
          reflectionSection.name
        );
        return (
          <Panel
            header={reflectionSection.title}
            key={i}
            style={{ fontSize: "large", fontWeight: "bolder" }}
            // disabled={
            //   metrics.findIndex((metric) => metric.name == "Hand Raises") == -1 ||
            //   reflections.reflectionSections.findIndex(
            //     (section) => section.name == "handRaises"
            //   ) == -1
            // }
          >
            <SectionForm
              section={reflectionSection}
              metricDisplay={metricMap?.metricDisplay}
              comment={metricMap?.comment}
              sessionId={props.session.id}
              userUID={props.user.uid}
            />
          </Panel>
        );
      })}
    </Collapse>
  );
}

{
  /* <HandRaisesForm
          session={props.session}
          metric={metrics.find((metric) => metric.name == "Hand Raises")}
          user={props.user}
          handRaiseReflections={handRaiseReflections}
        /> */
}
