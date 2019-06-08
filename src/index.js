import "./styles.css";

const svg = document.getElementById("control");

const scale = (inNum, inMin, inMax, outMin, outMax) => {
  if (inMin === inMax) {
    return outMin;
  }
  return ((inNum - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

const clip = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const getScaled = value => {
  const head = Math.PI * 2;
  const middle = Math.PI * 1;
  const scaled = scale(value, 0, 0.5, head, middle);
  const end = clip(scaled, middle, head);

  const start = Math.PI;
  return { start, end };
};

// const getHandleLine = (center, radius, value) => {
//   return {
//     x: center.x + Math.cos(value) * radius,
//     y: center.y + Math.sin(value) * (radius * -1)
//   };
// };

export const polarToCartesian = (
  { radius, theta },
  { x, y } = { x: 0, y: 0 }
) => ({
  x: x + radius * Math.cos(theta),
  y: y + radius * Math.sin(theta)
});

const draw = (rect, path, e) => {
  const radius = 50;
  const { left, top } = rect;
  const x = e.clientX - left;
  const y = e.clientY - top;

  const start = { x: radius, y: radius };
  const current = {
    x: scale(radius - x, 0, x, 0, radius),
    y: scale(radius - y, 0, y, 0, radius)
  };

  const theta = Math.atan2(current.y, current.x);
  const end = polarToCartesian({ radius, theta }, start);
  console.log(current, end, theta);

  path.setAttribute("d", `M${start.x},${start.y} ${end.x},${end.y}`);
};

const moveListener = (rect, path) => e => {
  draw(rect, path, e);
};

const upListener = e => {
  console.log(e.type);
  document.removeEventListener("mousemove", moveListener);
  document.removeEventListener("mouseup", upListener);
};

const downListener = e => {
  console.log(e.type);

  const rect = svg.getBoundingClientRect();
  const path = svg.getElementById("path");

  document.addEventListener("mousemove", moveListener(rect, path));
  document.addEventListener("mouseup", upListener);

  draw(rect, path, e);
};

svg.addEventListener("mousedown", downListener);
