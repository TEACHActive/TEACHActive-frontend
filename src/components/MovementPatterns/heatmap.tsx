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

      var data = {
        max: max,
        min: min,
        data: newData,
      };

      console.log(newData);

      // if you have a set of datapoints always use setData instead of addData
      // for data initialization
      heatmapInstance.setData(data);
    }
  }, []);

  // console.log(props.data);

  return (
    <div style={{ display: "flex" }}>
      <p style={{ marginRight: "5px" }}>Left</p>
      <div
        className="instructorMovementChart"
        style={{ height: "20px", width: "100%", border: "2px solid black" }}
      />
      <p style={{ marginLeft: "5px" }}>Right</p>
    </div>
  );
};

export default Heatmap;
