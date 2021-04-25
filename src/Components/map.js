import React from 'react';

const Map = ({ routes, setAirport }) => (
  <svg className="map" viewBox="-180 -90 360 180">
    <g transform="scale(1 -1)">
      <image xlinkHref="equirectangular_world.jpg" href="equirectangular_world.jpg" x="-180" y="-90" height="100%" width="100%" transform="scale(1 -1)"/>
      
      {routes.map((r, idx) => {
        const srcX = r.source.long
        const srcY = r.source.lat
        const destX = r.destination.long
        const destY = r.destination.lat

        return (
          <g key={"SVG" + idx}>
          <circle className="source" cx={srcX} cy={srcY} onClick={setAirport} code={r.source.code}>
            <title>{r.source.name}</title>
          </circle> 

          <circle className="destination" cx={destX} cy={destY}  onClick={setAirport} code={r.destination.code}>
            <title>{r.destination.name}</title>
          </circle>

          <path d={`M ${srcX} ${srcY} L ${destX} ${destY}`} />
        </g>
        )
      })}        
    </g>
    <g className="legend">
      <text className="title" x={96} y={74}>Legend</text>
      <circle className="source" cx={100} cy={78}>
        <title>Source</title>
      </circle> 
      <text x={105} y={80}>Source</text>

      <circle className="destination" cx={100} cy={84}>
        <title>Destination</title>
      </circle>
      <text x={105} y={86}>Destination</text>
    </g>
  </svg>
)

export default Map;