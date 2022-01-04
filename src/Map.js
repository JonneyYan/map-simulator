import React, { useState, useMemo, useEffect } from "react";
import { Button, Select, Slider } from "antd";
import { times } from "lodash";
import Chart from "./charts";
import MapItem from "./MapItem";

export default function Map({ data, showLabel, rowCount }) {
  const [scale, setScale] = useState(0.5);
  const [hexagonMap, statics] = useMemo(() => {
    const statics = {};
    if (data.length === 0) {
      return [];
    }
    const res = [];
    const type = data[0].slice(1, 9);

    function getType(x, y) {
      let probability = [];
      let total = 100;
      if (x === 0 && y === 0) {
        probability = data[1].slice(1, 9);
      } else {
        const neighbor1 = y > 0 && res[x][y - 1]?.index;
        const neighbor2 = x > 0 && res[x - 1][y]?.index;
        const neighbor3 = x > 0 && res[x - 1][y + 1]?.index;

        total = 0;
        for (let index = 1; index <= 8; index++) {
          const base = +data[1][index].value;
          const v1 = neighbor1 ? +data[neighbor1][index].value : 0;
          const v2 = neighbor2 ? +data[neighbor2][index].value : 0;
          const v3 = neighbor3 ? +data[neighbor3][index].value : 0;
          const value = base + v1 + v2 + v3;
          total += value;
          probability.push({ value });
        }
      }

      const random = Math.ceil(Math.random() * total);

      let sum = 0;
      for (let index = 0; index < probability.length; index++) {
        const p = probability[index];
        sum += p.value;
        if (sum >= random) {
          return type[index];
        }
      }
    }

    for (let x = 0; x < rowCount; x++) {
      res[x] = [];
      for (let y = 0; y < rowCount; y++) {
        const item = {
          vector: [x, y],
          ...getType(x, y),
        };
        statics[item.value] = {
          color: item.color,
          value: statics[item.value]?.value ? statics[item.value].value + 1 : 1,
        };
        res[x][y] = item
      }
    }

    return [res, statics];
  }, [data, rowCount]);
  return (
    <div className="map">
      <div className="statics">
        <Chart statics={statics} />
        缩放
        <Slider style={{ width: "200px" }} max={1} min={0.05} step={0.05} value={scale} onChange={setScale} />
      </div>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <MapItem hexagonMap={hexagonMap} showLabel={showLabel} />
      </div>
    </div>
  );
}
