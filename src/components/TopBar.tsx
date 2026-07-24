import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from './icons';

/** Screen header: back link on the left, gold step badge on the right. */
export default function TopBar({
  backLabel = '返回',
  backTo = -1,
  step,
}: {
  backLabel?: string;
  /** route path, or a negative number to go back N entries in history */
  backTo?: string | number;
  step?: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex w-full max-w-content items-center justify-between px-2 py-1">
      <button
        onClick={() =>
          typeof backTo === 'number' ? navigate(backTo) : navigate(backTo)
        }
        className="flex items-center gap-1.5 rounded-md p-2 text-sm text-cream-dim transition-colors hover:text-gold-light"
      >
        <ChevronLeftIcon size={18} />
        {backLabel}
      </button>
      {step && (
        <span className="rounded-badge border border-gold bg-gold-soft px-3 py-1 text-xs font-medium text-gold-light">
          {step}
        </span>
      )}
    </div>
  );
}
