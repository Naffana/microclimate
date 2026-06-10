import { CombinedPoint, DeviceId, Point } from "./definitions";

function bucketMinute(ts: number): number {
  const d = new Date(ts);
  d.setSeconds(0, 0);
  return d.getTime();
}

export function combineByMinute(data: Point[]): { devices: DeviceId[]; combined: CombinedPoint[] } {
  const devices = Array.from(new Set(data.map((p) => p.device))).sort();

  const map = new Map<number, CombinedPoint>();

  for (const p of data) {
    const bucket = bucketMinute(p.ts);
    const deviceId = p.device;

    if (!map.has(bucket)) {
      map.set(bucket, {
        ts: bucket,
        time: new Date(bucket).toISOString(),
      });
    }

    const row = map.get(bucket)!;
    row[deviceId] = p.temp;
  }

  const combined = Array.from(map.values()).sort((a, b) => a.ts - b.ts);

  return { devices, combined };
}


export function buildTicks(min: number, max: number, start:Date, end:Date) {
  const startV = min - 10;
  const endV = max + 10;
  const ticksV: number[] = [];

  const from = Math.floor(startV / 5) * 5;
  const to = Math.ceil(endV / 5) * 5;

  for (let v = from; v <= to; v += 5) {
    ticksV.push(v);
  }

  const startTs = start.getTime();
  const endTs = end.getTime();

  if (endTs <= startTs) {
    return {domain: [from, to] as [number, number], ticksV, ticks: [startTs, endTs]};
  }

  const step = (endTs - startTs) / (5 - 1);
  const ticks: number[] = [];

  for (let i = 0; i < 5; i++) {
    ticks.push(Math.round(startTs + step * i));
  }

  return { domain: [from, to] as [number, number], ticksV, ticks};
}


