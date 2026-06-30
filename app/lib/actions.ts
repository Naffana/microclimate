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

export function generateTicksForRange(minTs: number, maxTs: number): number[] {
  const range = maxTs - minTs;
  if (range <= 0) return [minTs];

  const MINUTE = 60_000;
  const HOUR = 3_600_000;
  const DAY = 86_400_000;

  const intervals: { ms: number; align: (ts: number) => number }[] = [
    { ms: 1 * MINUTE, align: (ts) => ts - (ts % MINUTE) },
    { ms: 5 * MINUTE, align: (ts) => ts - (ts % (5 * MINUTE)) },
    { ms: 10 * MINUTE, align: (ts) => ts - (ts % (10 * MINUTE)) },
    { ms: 15 * MINUTE, align: (ts) => ts - (ts % (15 * MINUTE)) },
    { ms: 30 * MINUTE, align: (ts) => ts - (ts % (30 * MINUTE)) },
    { ms: 1 * HOUR, align: (ts) => ts - (ts % HOUR) },
    { ms: 2 * HOUR, align: (ts) => ts - (ts % (2 * HOUR)) },
    { ms: 6 * HOUR, align: (ts) => ts - (ts % (6 * HOUR)) },
    { ms: 12 * HOUR, align: (ts) => ts - (ts % (12 * HOUR)) },
    { ms: 1 * DAY, align: (ts) => { const d = new Date(ts); d.setUTCHours(0, 0, 0, 0); return d.getTime(); } },
    { ms: 2 * DAY, align: (ts) => { const d = new Date(ts); d.setUTCHours(0, 0, 0, 0); return d.getTime() - (d.getUTCDate() % 2) * DAY; } },
    { ms: 7 * DAY, align: (ts) => { const d = new Date(ts); d.setUTCHours(0, 0, 0, 0); return d.getTime() - d.getUTCDay() * DAY; } },
  ];

  const TARGET_TICKS = 8;
  let chosen = intervals[0];
  for (const iv of intervals) {
    if (range / iv.ms <= TARGET_TICKS * 1.5) {
      chosen = iv;
      break;
    }
    chosen = iv;
  }

  const aligned = chosen.align(minTs);
  const ticks: number[] = [];
  for (let t = aligned; t <= maxTs + chosen.ms; t += chosen.ms) {
    if (t >= minTs - chosen.ms && t <= maxTs + chosen.ms) {
      ticks.push(t);
    }
  }

  return ticks.length > 0 ? ticks : [minTs, maxTs];
}

