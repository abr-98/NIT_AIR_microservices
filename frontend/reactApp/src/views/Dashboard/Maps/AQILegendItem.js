import React, { useCallback } from "react";

const AQILegendItem = (props) => {
  const canvasFill = useCallback((node) => {
    if (node) {
      let ctx = node.getContext("2d");
      ctx.fillStyle = props.color;
      ctx.fillRect(0, 0, node.width, node.height);
    }
  });

  return props.titleFirst ? (
    <>
      <span style={{ padding: "5px" }}>{props.title}</span>
      <span>
        <canvas ref={canvasFill} id={props.title} height={15} width={25} />
      </span>
    </>
  ) : (
    <>
      <span>
        <canvas ref={canvasFill} id={props.title} height={15} width={25} />
      </span>
      <span style={{ padding: "5px" }}>{props.title}</span>
    </>
  );
};

export default AQILegendItem;
