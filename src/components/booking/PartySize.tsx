import { Stepper } from '../ui/Stepper';
import { Notice } from '../ui/Card';

/** Figma: `Party Size Column` inside frame 779:2572. */
interface PartySizeProps {
  adults: number;
  childCount: number;
  onAdults: (n: number) => void;
  onChildren: (n: number) => void;
}

export function PartySize({ adults, childCount, onAdults, onChildren }: PartySizeProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-r-h2 text-text-primary">用餐人數</h3>

      <div className="flex flex-col gap-3">
        <Row label="成人">
          <Stepper value={adults} min={1} max={8} onChange={onAdults} itemLabel="成人" />
        </Row>
        <Row label="小孩 (0-7歲)">
          <Stepper
            value={childCount}
            min={0}
            max={8}
            onChange={onChildren}
            itemLabel="小孩"
          />
        </Row>
      </div>

      <Notice>
        <span className="font-medium text-text-primary">預約說明：</span>{' '}
        超過 8 人的團體預約，請直接撥打電話聯繫我們的專屬客服。
      </Notice>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-r-label text-text-primary">{label}</span>
      {children}
    </div>
  );
}
