// Ye helper function 3 points ka angle calculate karta hai
export interface Point { x: number; y: number; }
export function calculateAngle(a: Point, b: Point, c: Point) {
  // a = shoulder, b = elbow, c = wrist
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };

  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
  const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);

  const angle = Math.acos(dot / (magAB * magCB));
  return (angle * 180) / Math.PI; // radians → degrees
}
