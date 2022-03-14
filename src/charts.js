import React, { useState, useEffect } from "react";
import { Pie, G2 } from "@ant-design/charts";

export default function Chart({ statics }) {
  const G = G2.getEngine("canvas");

  const data = Object.keys(statics || {}).map((key) => {
    return {
      type: key,
      value: statics[key].sum,
      color: statics[key].color,
    };
  });

  const cfg = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "color", //
    color: (data) => {
      return data.color;
    },
    radius: 0.75,
    legend: false,
    label: {
      type: "spider",
      labelHeight: 40,
      formatter: (data, mappingData) => {
        const group = new G.Group({});
        group.addShape({
          type: "circle",
          attrs: {
            x: 0,
            y: 0,
            width: 40,
            height: 50,
            r: 5,
            fill: data.color,
          },
        });
        group.addShape({
          type: "text",
          attrs: {
            x: 10,
            y: 8,
            text: `${data.type}`,
            fill: data.color,
          },
        });
        group.addShape({
          type: "text",
          attrs: {
            x: 0,
            y: 25,
            text: `${data.value}个 ${(data.percent * 100).toFixed(2)}%`,
            fill: "rgba(0, 0, 0, 0.65)",
            fontWeight: 700,
          },
        });
        return group;
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
  };
  const config = cfg;
  return (
    <div>
      <h1>共计：{data.reduce((p, c) => p + c.value, 0)}</h1>
      <Pie {...config} />
    </div>
  );
}
