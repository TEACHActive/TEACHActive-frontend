import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import MetricDisplay from "../metricDisplay";
import { selectSelectedSession } from "redux/sessionSlice";
import BlockContent from "components/BlockContent/blockContent";
import { _useGetSpeechTotalsQuery } from "api/services/speech";
import { MetricNumberType, SessionMetricType } from "../metricDisplay.types";

export interface IStudentSpeechMetricDisplayProps {
  sessionId?: string;
}

export function StudentSpeechMetricDisplay(
  props: IStudentSpeechMetricDisplayProps
) {
  const {
    data,
    isError,
    isFetching,
    isLoading,
    // isSuccess,
  } = _useGetSpeechTotalsQuery(
    { sessionId: props.sessionId || "", minSpeakingAmp: 0 },
    props.sessionId ? null : skipToken
  );
  return (
    <BlockContent
      color={{
        dark: "#CB1859",
        light: "#D81B60",
      }}
      name="Student Speech"
      help_text="The total time of student talk (in minutes) during the class session"
      has_alert={false}
      icon={"users"}
      style={{ marginTop: "2em", marginBottom: "2em" }}
    >
      <MetricDisplay<MetricNumberType>
        metric={
          new MetricNumberType((data?.speakingPercent.student || 0) * 100)
        }
        canEdit={false}
        trend={undefined}
        metricPrepend={"~"}
        unit="%"
        trend_metric={undefined}
        metricType={SessionMetricType.StudentSpeech}
        loading={isFetching || isLoading}
        isError={isError}
      ></MetricDisplay>
    </BlockContent>
  );
}
