import { Spin } from "antd";
import * as React from "react";
import { Collapse } from "antd";
import { useSelector } from "react-redux";

import apiHandler from "api/handler";
import { RootState } from "redux/store";
import { getMetrics } from "redux/selectors";
import BlockContent from "components/BlockContent/blockContent";
import MetricDisplay from "components/MetricDisplay/metricDisplay";

import { camelize } from "../../util";
import { SectionForm } from "./sectionForm";
import { BaseSession } from "../../api/types";
import { Reflections } from "./goalsPage.types";

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

  const handRaiseMetric = metrics.find(
    (metric) => metric.name === "Hand Raises"
  );
  const studentSpeechMetric = metrics.find(
    (metric) => metric.name === "Student Speech"
  );
  const instructorSpeechMetric = metrics.find(
    (metric) => metric.name === "Instructor Speech"
  );

  const reflectionSectionMetricMap = new Map<
    string,
    { metricDisplay: React.ReactNode; comment: React.ReactNode }
  >();

  [
    {
      metric: handRaiseMetric,
      comment: (
        <p>
          During this section there were{" "}
          <strong>{handRaiseMetric.metric}</strong> seconds of hand raises
        </p>
      ),
    },
    {
      metric: instructorSpeechMetric,
      comment: (
        <p>
          During this section there were{" "}
          <strong>{instructorSpeechMetric.metric}</strong>
        </p>
      ),
    },
    {
      metric: studentSpeechMetric,
      comment: (
        <p>
          During this section there were{" "}
          <strong>{studentSpeechMetric.metric}</strong>
        </p>
      ),
    },
  ].forEach((currentMetric) => {
    reflectionSectionMetricMap.set(camelize(currentMetric.metric.name), {
      metricDisplay: (
        <BlockContent
          color={currentMetric.metric.color}
          name={currentMetric.metric.name}
          help_text={currentMetric.metric.help_text}
          has_alert={currentMetric.metric.has_alert}
          icon={currentMetric.metric.icon}
        >
          <MetricDisplay
            metricType={currentMetric.metric.metricType}
            metric={currentMetric.metric.metric}
            metricPrepend={currentMetric.metric.metricPrepend}
            denominator={currentMetric.metric.denominator}
            hasDenominator={currentMetric.metric.hasDenominator}
            unit={currentMetric.metric.unit}
            trend={currentMetric.metric.trend}
            trend_metric={currentMetric.metric.trend_metric}
            trend_metric_unit={currentMetric.metric.trend_metric_unit}
            canEdit={currentMetric.metric.canEdit}
            updateMetric={(newMetric: string) =>
              currentMetric.metric.updateMetric(newMetric)
            }
          >
            {currentMetric.metric.children}
          </MetricDisplay>
        </BlockContent>
      ),
      comment: currentMetric.comment,
    });
  });

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
