import React, { useCallback, useState } from "react";

const MapLegendItem = (props) => {
  const canvasFill = useCallback((node) => {
    if (node) {
      let ctx = node.getContext("2d");
      ctx.fillStyle = props.color;
      ctx.fillRect(0, 0, node.width, node.height);
    }
  });

  return (
    <div style={{ fontSize: "0.9em" }}>
      <span>
        <canvas ref={canvasFill} id={props.title} height={15} width={25} />
      </span>
      <span style={{ padding: "5px" }}>{props.title}</span>
    </div>
  );
};

export default MapLegendItem;
