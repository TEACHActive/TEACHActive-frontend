import { Input, Button, Spin, message } from "antd";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { IMetricTypeDisplayable } from "./metricDisplay.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./metricDisplay.css";

export interface IMetricDisplayPresentationalProps<
  T extends IMetricTypeDisplayable
> {
  unit?: string;
  icon?: IconProp;
  metric: T;
  canEdit: boolean;
  processing: boolean;
  denominator?: number;
  trend_metric?: number;
  metricPrepend?: string;
  editingMetric: boolean;
  trend_metric_unit?: string;
  loading: boolean;
  isError: boolean;
  newMetric: number;

  updateMetric?: (newMetric: number) => Promise<string>;
  setProcessing: (value: boolean) => void;
  setNewMetric: (newMetric: string) => void;
  setEditingMetric: (val: boolean) => void;
}

export function MetricDisplayPresentational<T extends IMetricTypeDisplayable>(
  props: IMetricDisplayPresentationalProps<T>
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
            placeholder={
              props.metric ? props.metric.getValue()?.toString() : ""
            }
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
                  if (props.updateMetric) {
                    try {
                      const updateMessage = await props.updateMetric(
                        props.newMetric
                      );
                      props.setNewMetric("");
                    } catch (e) {
                      message.error(e as string);
                    }
                  }
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
          {props.metricPrepend}{" "}
          {props.metric.getValueNode() === -1
            ? "-"
            : props.metric.getValueNode()}
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
        {props.isError ? <h1>Error</h1> : content}
      </div>
      {/* {props.children} TODO: Re add this */}
      {/* TODO: Display error better */}
    </div>
  );
}
