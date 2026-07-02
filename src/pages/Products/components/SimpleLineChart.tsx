import * as React from 'react';
import { cn } from '@/lib/utils';

type Point = { date: string; value: number };

export default function SimpleLineChart(props: { points: Point[]; height?: number; className?: string }) {
  const { points, height = 320, className } = props;
  const width = 900;
  const padL = 44;
  const padR = 16;
  const padT = 16;
  const padB = 28;

  if (!points || points.length === 0) {
    return (
      <div className={cn('flex items-center justify-center text-gray-500', className)} style={{ height }}>
        暂无数据
      </div>
    );
  }

  const values = points.map((p) => p.value);
  const max = Math.max(1, ...values);
  const min = 0;
  const w = width - padL - padR;
  const h = height - padT - padB;

  const x = (i: number) => padL + (points.length === 1 ? 0 : (i / (points.length - 1)) * w);
  const y = (v: number) => padT + ((max - v) / (max - min)) * h;

  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(2)} ${y(p.value).toFixed(2)}`)
    .join(' ');

  const yTicks = [max, Math.round(max / 2), 0];

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <svg width={width} height={height} className="block bg-white">
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={padL} y1={y(t)} x2={width - padR} y2={y(t)} stroke="#E5E7EB" />
            <text x={8} y={y(t) + 4} fontSize="12" fill="#6B7280">
              {t}
            </text>
          </g>
        ))}

        <path d={d} fill="none" stroke="#3B82F6" strokeWidth="2" />
        {points.map((p, i) => (
          <circle key={p.date} cx={x(i)} cy={y(p.value)} r="3" fill="#3B82F6" />
        ))}

        <text x={padL} y={height - 10} fontSize="12" fill="#6B7280">
          {points[0].date}
        </text>
        <text x={width - padR - 70} y={height - 10} fontSize="12" fill="#6B7280">
          {points[points.length - 1].date}
        </text>
      </svg>
    </div>
  );
}
