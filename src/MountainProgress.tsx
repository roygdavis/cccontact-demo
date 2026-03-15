import React from 'react';

interface Props {
  /** 0 = base camp, 1 = summit */
  progress: number;
}

// The mountain ridge as SVG coordinate waypoints (left base → peak → right base).
// We place the stickman along the left-to-peak segment only (the climb).
const RIDGE: [number, number][] = [
  [20, 280],   // left base
  [100, 220],  // lower left shoulder
  [160, 160],  // mid left slope
  [230, 80],   // near-peak
  [270, 40],   // summit
];

// Secondary ridge for right side of mountain (visual only, stickman doesn't go here)
const RIDGE_RIGHT: [number, number][] = [
  [270, 40],   // summit
  [340, 110],  // near-peak right
  [400, 190],  // mid right slope
  [450, 245],  // lower right shoulder
  [510, 280],  // right base
];

const ALL_RIDGE = [...RIDGE, ...RIDGE_RIGHT.slice(1)];

/** Linearly interpolate along a polyline, returning the [x, y] at fraction t (0..1) */
function pointOnPolyline(points: [number, number][], t: number): [number, number] {
  if (t <= 0) return points[0];
  if (t >= 1) return points[points.length - 1];

  // Compute total length
  let totalLen = 0;
  const segs: number[] = [];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i - 1][0];
    const dy = points[i][1] - points[i - 1][1];
    const len = Math.hypot(dx, dy);
    segs.push(len);
    totalLen += len;
  }

  let target = t * totalLen;
  for (let i = 0; i < segs.length; i++) {
    if (target <= segs[i]) {
      const frac = target / segs[i];
      return [
        points[i][0] + frac * (points[i + 1][0] - points[i][0]),
        points[i][1] + frac * (points[i + 1][1] - points[i][1]),
      ];
    }
    target -= segs[i];
  }
  return points[points.length - 1];
}

/** Returns the angle (in degrees) of the slope at position t */
function slopeAngle(points: [number, number][], t: number): number {
  const eps = 0.01;
  const [x1, y1] = pointOnPolyline(points, Math.max(0, t - eps));
  const [x2, y2] = pointOnPolyline(points, Math.min(1, t + eps));
  return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
}

const MountainProgress: React.FC<Props> = ({ progress }) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const [sx, sy] = pointOnPolyline(RIDGE, clampedProgress);
  const angle = slopeAngle(RIDGE, clampedProgress);

  // Stickman dimensions
  const headR = 7;
  const bodyLen = 14;
  const legLen = 10;
  const armLen = 9;

  // The stickman is drawn upright, then rotated to match the slope
  // We position him standing on the ridge point
  const stickman = (
    <g
      transform={`translate(${sx}, ${sy}) rotate(${angle})`}
      className="stickman"
    >
      {/* body — drawn so feet are at origin */}
      <line x1={0} y1={0} x2={0} y2={-(bodyLen)} stroke="#e63946" strokeWidth={2} />
      {/* head */}
      <circle cx={0} cy={-(bodyLen + headR)} r={headR} fill="none" stroke="#e63946" strokeWidth={2} />
      {/* arms — animated walking pose */}
      <line x1={0} y1={-(bodyLen * 0.65)} x2={armLen} y2={-(bodyLen * 0.3)} stroke="#e63946" strokeWidth={2} />
      <line x1={0} y1={-(bodyLen * 0.65)} x2={-armLen} y2={-(bodyLen)} stroke="#e63946" strokeWidth={2} />
      {/* legs */}
      <line x1={0} y1={0} x2={legLen} y2={legLen * 0.9} stroke="#e63946" strokeWidth={2} />
      <line x1={0} y1={0} x2={-legLen * 0.7} y2={legLen} stroke="#e63946" strokeWidth={2} />
    </g>
  );

  const ridgeStr = ALL_RIDGE.map(([x, y]) => `${x},${y}`).join(' ');

  // Decorative elements: snow cap, depth lines on mountain face
  const snowCapPoints = '250,55 270,40 290,55 280,65 260,65';

  // Ground line
  const groundY = 285;

  return (
    <svg
      viewBox="0 0 530 300"
      xmlns="http://www.w3.org/2000/svg"
      className="mountain-progress-svg"
      aria-label={`Progress: ${Math.round(clampedProgress * 100)}%`}
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e3a5f" />
        </linearGradient>
        <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2d3a4a" />
          <stop offset="100%" stopColor="#1a2535" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="530" height="300" fill="url(#skyGrad)" />

      {/* Stars (static decorative dots) */}
      {[
        [50, 30], [90, 15], [150, 25], [200, 10], [320, 20],
        [370, 35], [430, 12], [480, 28], [510, 50], [30, 60],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1} fill="white" opacity={0.7} />
      ))}

      {/* Mountain fill */}
      <polygon
        points={`${ALL_RIDGE.map(([x, y]) => `${x},${y}`).join(' ')} 510,${groundY} 20,${groundY}`}
        fill="url(#mountainGrad)"
      />

      {/* Mountain wireframe ridge */}
      <polyline
        points={ridgeStr}
        fill="none"
        stroke="#4a9eff"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Inner depth lines on the mountain face */}
      <line x1={20} y1={groundY} x2={270} y2={40} stroke="#2a4a6a" strokeWidth={1} strokeDasharray="4 6" opacity={0.5} />
      <line x1={270} y1={40} x2={510} y2={groundY} stroke="#2a4a6a" strokeWidth={1} strokeDasharray="4 6" opacity={0.5} />

      {/* Contour lines */}
      <line x1={80} y1={220} x2={350} y2={170} stroke="#2a4a6a" strokeWidth={1} opacity={0.4} />
      <line x1={130} y1={165} x2={320} y2={120} stroke="#2a4a6a" strokeWidth={1} opacity={0.3} />

      {/* Snow cap */}
      <polygon
        points={snowCapPoints}
        fill="white"
        stroke="#aaccff"
        strokeWidth={1}
        opacity={0.9}
      />

      {/* Ground line */}
      <line x1={0} y1={groundY} x2={530} y2={groundY} stroke="#4a9eff" strokeWidth={1.5} opacity={0.5} />

      {/* Progress path highlight (the part of the ridge already climbed) */}
      {clampedProgress > 0 && (() => {
        const climbed: [number, number][] = [];
        const steps = 40;
        for (let i = 0; i <= steps; i++) {
          climbed.push(pointOnPolyline(RIDGE, (i / steps) * clampedProgress));
        }
        return (
          <polyline
            points={climbed.map(([x, y]) => `${x},${y}`).join(' ')}
            fill="none"
            stroke="#ffd700"
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.85}
          />
        );
      })()}

      {/* Summit flag */}
      <line x1={270} y1={40} x2={270} y2={15} stroke="#aaaaaa" strokeWidth={1.5} />
      <polygon points="270,15 285,20 270,25" fill="#e63946" />

      {/* Stickman */}
      {stickman}

      {/* Progress label */}
      <text
        x={265}
        y={298}
        textAnchor="middle"
        fill="#aaccff"
        fontSize={10}
        fontFamily="monospace"
      >
        {Math.round(clampedProgress * 100)}% to the top
      </text>
    </svg>
  );
};

export default MountainProgress;
