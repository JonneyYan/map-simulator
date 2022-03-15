import React, { useState, useMemo, useEffect } from "react";
import { Button, Checkbox, Slider } from "antd";
import { times } from "lodash";
import Chart from "./charts";
import MapItem from "./MapItem";

const typeOptions = [
  { label: "平原", value: 1 },
  { label: "山丘", value: 2 },
  { label: "沙漠", value: 3 },
  { label: "湖泊", value: 4 },
  { label: "草原", value: 5 },
  { label: "林地", value: 6 },
  { label: "雪地", value: 7 },
  { label: "冰川", value: 8 },
];
const TIER_IMAGES = [0, 3, 1, 2, 2, 2, 2, 1, 1];

export default function Map({ coord, probability, showLabel, mapSize }) {
  const [selected, setSelected] = useState(typeOptions.map((i) => i.value));
  const [scale, setScale] = useState(0.5);
  const [land, setLand] = useState({});

  useEffect(() => {
    loadLandFromLocation();
  }, []);

  function loadLandFromLocation() {
    try {
      const landJSON = localStorage.getItem("land");
      if (landJSON) {
        setLand(JSON.parse(landJSON));
      }
    } catch (error) {
      console.log("🚀 ~ file: Map.js ~ line 33 ~ loadLandFromLocation ~ error", error);
    }
  }

  useEffect(() => {
    localStorage.setItem("land", JSON.stringify(land));
  }, [land]);

  const [hexagonMap, statics] = useMemo(() => {
    const landMap = [];
    const statics = {};
    const type = probability[0];

    const originX = coord.x - mapSize / 2;
    const originY = coord.y - mapSize / 2;
    for (let i = 0; i < mapSize; i++) {
      landMap[i] = [];
      for (let j = 0; j < mapSize; j++) {
        const x = originX + i;
        const y = originY + j;

        const item = !land[`${x}-${y}`]
          ? {
              vector: [x, y],
              type: 0,
            }
          : {
              vector: [x, y],
              ...land[`${x}-${y}`],
            };
        if (item.type > 0) {
          const name = type[item.type].value;
          const color = type[item.type].color;
          statics[name] = {
            color,
            sum: statics[name]?.sum ? statics[name].sum + 1 : 1,
          };
        }

        landMap[i][j] = item;
      }
    }

    return [landMap, statics];
  }, [coord, land, mapSize]);

  function getRandomLand(item) {
    let p = [];
    let total = 100;
    const type = probability[0].slice(1, 9);

    const [x, y] = item.vector;

    const n1 = land[`${x}-${y - 1}`]?.type;
    const n2 = land[`${x - 1}-${y}`]?.type;
    const n3 = land[`${x - 1}-${y + 1}`]?.type;
    const n4 = land[`${x}-${y + 1}`]?.type;
    const n5 = land[`${x + 1}-${y + 1}`]?.type;
    const n6 = land[`${x + 1}-${y}`]?.type;

    if (!n1 && !n2 && !n3 && !n4 && !n5 && !n6) {
      p = probability[1].slice(1, 9);
    } else {
      total = 0;
      for (let index = 1; index <= 8; index++) {
        // const base = +data[1][index].value;
        const v1 = n1 ? +probability[n1][index].value : 0;
        const v2 = n2 ? +probability[n2][index].value : 0;
        const v3 = n3 ? +probability[n3][index].value : 0;
        const v4 = n4 ? +probability[n4][index].value : 0;
        const v5 = n5 ? +probability[n5][index].value : 0;
        const v6 = n6 ? +probability[n6][index].value : 0;

        const value = v1 + v2 + v3 + v4 + v5 + v6;
        total += value;
        p.push({ value });
      }
    }
    console.log(
      `[${x},${y}]地块概率：`,
      p.map((i) => i.value)
    );

    const random = Math.ceil(Math.random() * total);

    let sum = 0;
    for (let index = 0; index < p.length; index++) {
      const pp = p[index];
      sum += pp.value;
      if (sum >= random) {
        return {
          type: type[index].index,
          subType: (Math.ceil(Math.random() * 10) % TIER_IMAGES[type[index].index]) + 1,
        };
      }
    }
    return 1;
  }
  const handleExplore = (item) => {
    const [x, y] = item.vector;
    setLand({ ...land, [`${x}-${y}`]: getRandomLand(item) });
  };

  return (
    <div className="map">
      <div className="statics">
        <Chart statics={statics} />
        缩放
        <Slider style={{ width: "200px" }} max={1} min={0.05} step={0.05} value={scale} onChange={setScale} />
      </div>

      <div>
        <Checkbox.Group options={typeOptions} value={selected} onChange={setSelected} />
        <Button onClick={() => setSelected(typeOptions.map((i) => i.value))}>全选</Button>
        <Button style={{ margin: "0 10px" }} onClick={() => setSelected(typeOptions.filter((i) => !selected.includes(i.value)).map((i) => i.value))}>
          反选
        </Button>
        <Button
          onClick={() => {
            setLand({});
            localStorage.removeItem("land");
          }}
        >
          清空地块
        </Button>
      </div>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", marginTop: "50px" }}>
        <MapItem coord={coord} hexagonMap={hexagonMap} showLabel={showLabel} selected={selected} onExplore={handleExplore} />
      </div>
    </div>
  );
}
