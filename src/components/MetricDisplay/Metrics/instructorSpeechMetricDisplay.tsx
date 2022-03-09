import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import MetricDisplay from "../metricDisplay";
import { selectSelectedSession } from "redux/sessionSlice";
import BlockContent from "components/BlockContent/blockContent";
import { _useGetSpeechTotalsInSecondsQuery } from "api/services/speech";
import { MetricNumberType, SessionMetricType } from "../metricDisplay.types";

export interface IInstructorSpeechMetricDisplayProps {
  sessionId?: string;
}

export function InstructorSpeechMetricDisplay(
  props: IInstructorSpeechMetricDisplayProps
) {
  // const selectedSession = useSelector(selectSelectedSession);
  const {
    data,
    isError,
    isFetching,
    isLoading,
    // isSuccess,
  } = _useGetSpeechTotalsInSecondsQuery(
    { sessionId: props.sessionId || "", minSpeakingAmp: 0 },
    props.sessionId ? null : skipToken
  );
  return (
    <BlockContent
      color={{
        dark: "#01332A",
        light: "#004D40",
      }}
      name="Instructor Speech"
      help_text="The total time of instructor talk (in minutes) during the class session"
      has_alert={false}
      icon={"comment"}
      style={{ marginTop: "2em", marginBottom: "2em" }}
    >
      <MetricDisplay<MetricNumberType>
        metric={new MetricNumberType((data?.instructor || 0) / 60)}
        canEdit={false}
        trend={undefined}
        metricPrepend={"~"}
        unit="min"
        trend_metric={undefined}
        metricType={SessionMetricType.InstructorSpeech}
        loading={isFetching || isLoading}
        isError={isError}
      ></MetricDisplay>
    </BlockContent>
  );
}
