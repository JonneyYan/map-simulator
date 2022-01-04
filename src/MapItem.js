import React from "react";
import styled from "styled-components";
const Hexagon = styled.div`
  width: 100px;
  height: 55px;
  background: ${(props) => props.color || "palevioletred"};
  position: relative;
  margin: 0 5px;

  &:before {
    content: "";
    position: absolute;
    top: -25px;
    left: 0;
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 25px solid ${(props) => props.color || "palevioletred"};
  }
  &:after {
    content: "";
    position: absolute;
    bottom: -25px;
    left: 0;
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-top: 25px solid ${(props) => props.color || "palevioletred"};
  }
`;
const Row = styled.div`
  width: 200000000px;
  margin: 35px 0;
  display: flex;
  &:nth-child(2n) {
    margin-left: 50px;
  }
`;
function MapItem({ hexagonMap, showLabel }) {
  return (
    <div>
      {hexagonMap?.map((row, x) => {
        return (
          <Row key={x}>
            {row.map((item) => (
              <Hexagon key={`${item.vector[0]}-${item.vector[1]}`} color={item.color}>
                {showLabel && (
                  <>
                    <div className="map-label">{item.value}</div>
                    <div className="map-label">
                      [{item.vector[0]}, {item.vector[1]}]
                    </div>
                  </>
                )}
              </Hexagon>
            ))}
          </Row>
        );
      })}
    </div>
  );
}
export default React.memo(MapItem);
