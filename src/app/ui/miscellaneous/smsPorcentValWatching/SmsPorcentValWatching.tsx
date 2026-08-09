import { CircleChart } from '&/miscellaneous/smsPorcentValWatching/circleChart/CircleChart';

export function SmsPorcentValWatching({
  total,
  count,
  barColor,
  skipCircleChart,
  showCount = true,
}: {
  total: number;
  count: number;
  barColor: string;
  skipCircleChart?: boolean;
  showCount?: boolean;
}) {
  // ----- global states -----

  // ----- local states -----

  const progress = (count / total) * 100;

  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-fit h-fit flex flex-row justify-center items-center gap-[0.5vw] mx-auto">
      {showCount && <p className="text-[2vh]">{count}</p>}
      {!skipCircleChart && <CircleChart total={total} count={count} barColor={barColor} />}
      {skipCircleChart && <div className="text-[2vh]">{count === 0 ? '0' : normalizedProgress.toFixed(1)}%</div>}
    </div>
  );
}
