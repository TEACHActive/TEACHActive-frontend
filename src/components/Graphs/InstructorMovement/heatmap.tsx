import * as React from "react";
import h337 from "heatmap.js";

import ClassroomImage from "images/classroom.jpg";

import "./heatmap.scss";

export interface IHeatmapProps {
  data: any[];
  sessionId: string;
}

export function Heatmap(props: IHeatmapProps) {
  let heatmapInstance: h337.Heatmap<"value", "x", "y">;

  React.useEffect(() => {
    const appContainer: HTMLElement | null = document.querySelector(
      ".instructorMovementChart"
    );

    if (appContainer) {
      if (!heatmapInstance) {
        heatmapInstance = h337.create({
          // only container is required, the rest will be defaults
          container: appContainer,
        });
      }
      heatmapInstance.setData({
        max: 0,
        min: 0,
        data: [],
      });
      heatmapInstance.repaint();

      // var points = [];
      var max = Number.MIN_SAFE_INTEGER;
      let min = Number.MAX_SAFE_INTEGER;
      // var width = 500;
      // var height = 20;
      // var len = 20;

      // while (len--) {
      //   var val = Math.floor(Math.random() * 1);
      //   max = Math.max(max, val);
      //   min = Math.min(min, val);
      //   var point = {
      //     x: Math.floor(Math.random() * width),
      //     y: Math.floor(Math.random() * height),
      //     value: val,
      //   };
      //   points.push(point);
      // }

      const newData = props.data.map((dataum) => {
        const pos = Math.round((500 * dataum) / 3838); //500 is width of heatmap, 3838 is number of horizontal pixels in heatmap
        max = Math.max(max, pos);
        min = Math.min(min, pos);
        return {
          x: pos,
          y: 10,
          value: 75,
        };
      });

      let data = {
        max: max,
        min: min,
        data: newData,
      };

      // if you have a set of datapoints always use setData instead of addData
      // for data initialization
      heatmapInstance.setData(data);
    }
  }, [props.data, props.sessionId]);

  // console.log(props.data);

  return (
    <div>
      <div className="instructorMovementChart" />
      <br />
      <p>Left {"<==>"} Right</p>
    </div>
    // <div style={{ display: "flex" }}>
    //   <div className="classroomHeatmapHolder">
    //     <div className="instructorMovementChart" />
    //     <img className="classroomImage" src={ClassroomImage} />
    //   </div>
    // </div>
  );
}
