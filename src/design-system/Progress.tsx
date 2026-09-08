type ProgressProps = { label: string; max?: number; showScale?: boolean; value: number };

export function Progress({ label, max = 100, showScale = label === "Lesson progress", value }: ProgressProps) {
  const safeMax = max > 0 ? max : 100;
  const safeValue = Math.min(Math.max(value, 0), safeMax);
  const percentage = Math.round((safeValue / safeMax) * 100);
  return <div className={`v2-progress${showScale ? " v2-progress--scaled" : ""}`}>
    <div className="v2-progress__copy"><span>{label}</span><span aria-hidden="true">{percentage}% complete</span></div>
    <div className="v2-progress__track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={safeValue} aria-valuetext={`${percentage}%`}>
      <div className="v2-progress__bar" style={{ width: `${percentage}%` }} />
    </div>
    {showScale && <div className="v2-progress__scale" aria-hidden="true"><span>0%</span><span>100%</span></div>}
  </div>;
}
