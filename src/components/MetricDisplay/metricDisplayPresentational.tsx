import { Input, Button, Spin } from "antd";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./metricDisplay.css";

export interface IMetricDisplayPresentationalProps {
  unit?: string;
  icon?: IconProp;
  metric: number;
  canEdit: boolean;
  processing: boolean;
  denominator?: number;
  trend_metric?: number;
  metricPrepend: string;
  editingMetric: boolean;
  trend_metric_unit?: string;
  loading: boolean;

  updateMetric?: (newMetric: number) => Promise<boolean>;
  setProcessing: (value: boolean) => void;
  setNewMetric: (newMetric: string) => void;
  setEditingMetric: (val: boolean) => void;
}

export function MetricDisplayPresentational(
  props: IMetricDisplayPresentationalProps
) {
  const content = (
    <>
      {props.canEdit && !props.editingMetric && (
        <FontAwesomeIcon
          icon="edit"
          size="1x"
          onClick={() => {
            props.setEditingMetric(true);
          }}
          className="sessionTitleEdit"
        />
      )}

      {props.editingMetric ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "50%",
          }}
        >
          <Input
            placeholder={props.metric ? props.metric.toString() : ""}
            onChange={(event) => props.setNewMetric(event.target.value)}
            disabled={props.processing}
          />
          <div style={{ display: "flex" }}>
            <Button type="primary" size="small" disabled={props.processing}>
              <FontAwesomeIcon
                icon="check"
                size="1x"
                color="blue"
                onClick={async (event) => {
                  props.setProcessing(true);
                  //Todo: Reimpliment
                  // const success = await props.updateMetric();
                  // if (success) {
                  //   props.setNewMetric("");
                  // }
                  props.setEditingMetric(false);
                  props.setProcessing(false);
                }}
              />
            </Button>
            <Button
              type="default"
              size="small"
              danger
              disabled={props.processing}
            >
              <FontAwesomeIcon
                icon="ban"
                size="1x"
                color="red"
                onClick={(event) => {
                  props.setEditingMetric(false);
                  props.setNewMetric("");
                }}
              />
            </Button>
          </div>
        </div>
      ) : props.loading ? (
        <Spin />
      ) : (
        <h1 className="metric-text">
          {props.metricPrepend}
          {props.metric === undefined
            ? "-"
            : props.metric % 1 !== 0
            ? props.metric.toFixed(2)
            : props.metric}
        </h1>
      )}

      {props.loading ? (
        <Spin />
      ) : (
        <>
          {props.denominator && <span>/ {props.denominator}</span>}

          <span>{props.unit}</span>
          {props.icon && (
            <FontAwesomeIcon
              style={{ color: "blue" }}
              size="2x"
              icon={props.icon}
            />
          )}
          <span>
            {props.trend_metric} {props.trend_metric_unit}
          </span>
        </>
      )}
    </>
  );
  return (
    <div className="MetricDisplay--bottom">
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          margin: "1em",
          marginTop: "3em",
          width: "100%",
        }}
      >
        {content}
      </div>
      {/* {props.children} Todo: Re add this */}
    </div>
  );
}
