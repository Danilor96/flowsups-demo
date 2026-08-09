export function CircleChart({
  total,
  count,
  barColor,
}: {
  total: number;
  count: number;
  barColor: string;
}) {
  // ----- global states -----

  // ----- local states -----
  const progress = (count / total) * 100;

  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <div className="progress-donut">
      <svg width="4.5vw" height="4.5vw" viewBox="0 0 120 120" className="donut">
        <circle
          className="donut-background"
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          strokeWidth="5.5"
        />
        <circle
          className="donut-progress rounded-full"
          cx="60"
          cy="60"
          r={radius}
          stroke={count === 0 ? '#6fc0b2' : barColor}
          fill="transparent"
          strokeWidth="5.5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="progress-text text-[1.5vh]">{count === 0 ? '0' : normalizedProgress.toFixed(1)}%</div>
    </div>
  );
}
