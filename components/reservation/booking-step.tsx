import { Check } from "lucide-react";

type StepProps = {
  number: string;
  label: string;
  active?: boolean;
  completed?: boolean;
};

export function Step({
  number,
  label,
  active = false,
  completed = false,
}: StepProps) {
  const className = [
    "booking-step",
    active ? "is-active" : "",
    completed ? "is-complete" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      aria-current={active ? "step" : undefined}
      className={className}
    >
      <span
        className="booking-step-number"
        aria-hidden="true"
      >
        {completed ? (
          <Check
            size={13}
            strokeWidth={1.7}
          />
        ) : (
          number
        )}
      </span>

      <span className="booking-step-label">
        {label}
      </span>

      {completed && (
        <span className="sr-only">
          Completed
        </span>
      )}
    </div>
  );
}