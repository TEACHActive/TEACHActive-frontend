import * as React from "react";
import h337 from "heatmap.js";

interface IHeatmapProps {
  data: number[];
}

const Heatmap: React.FunctionComponent<IHeatmapProps> = (props) => {
  React.useEffect(() => {
    const appContainer: HTMLElement | null = document.querySelector(
      ".instructorMovementChart"
    );

    if (appContainer) {
      let heatmapInstance = h337.create({
        // only container is required, the rest will be defaults
        container: appContainer,
      });
      // var points = [];
      var max = 0;
      let min = Number.MAX_SAFE_INTEGER;
      // var width = 1000;
      // var height = 200;
      // var len = 200;

      // while (len--) {
      //   var val = Math.floor(Math.random() * 100);
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
        const pos = Math.round(dataum) / 100;
        max = Math.max(max, pos);
        min = Math.min(min, pos);
        return {
          x: pos,
          y: 10,
          value: 1,
        };
      });

      var data = {
        max: max,
        min: min,
        data: newData,
      };

      // if you have a set of datapoints always use setData instead of addData
      // for data initialization
      heatmapInstance.setData(data);
    }
  }, []);

  return (
    <div
      className="instructorMovementChart"
      style={{ height: "20px", width: "500px" }}
    ></div>
  );
};

export default Heatmap;
