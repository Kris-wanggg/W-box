import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { restaurantName, depositPerGuest } from '../data/menu';
import { formatCurrency, formatDateTime, type BookingState } from '../booking';

/** Figma: `Restaurant/booking success` (923:3698) */
export interface BookingSuccessScreenProps {
  state: BookingState;
  onCancelReservation: () => void;
  onPayDeposit: () => void;
  onBack: () => void;
}

export function BookingSuccessScreen({
  state,
  onCancelReservation,
  onPayDeposit,
  onBack,
}: BookingSuccessScreenProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const guests = state.adults + state.children;
  const deposit = guests * depositPerGuest;

  const rows: [string, string][] = [
    ['訂位編號', state.reservationId ?? '—'],
    ['訂位人', state.contact.name || '—'],
    ['聯絡電話', state.contact.phone || '—'],
    ['餐廳名稱', restaurantName],
    ['日期時段', formatDateTime(state.date, state.time)],
    ['用餐人數', `${guests} 位`],
    ['訂金金額', formatCurrency(deposit)],
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar backLabel="預約首頁" onBack={onBack} />

      <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-6 px-4 py-6">
        <section aria-label="訂位狀態" className="flex flex-col items-center gap-2">
          <p
            aria-hidden="true"
            className="flex size-14 items-center justify-center rounded-pill bg-primary text-heading-h1 text-text-inverse"
          >
            ✓
          </p>
          <h1 className="text-heading-h1 text-text-primary">訂位成立！</h1>
          <p className="text-body-base text-text-secondary">
            請於期限內完成訂金支付，以保留您的訂位
          </p>
        </section>

        <section
          aria-label="訂位資訊"
          className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6"
        >
          <h2 className="text-heading-h3 text-text-primary">訂位資訊</h2>
          <dl className="flex flex-col gap-3">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col gap-1 border-b border-divider pb-3 last:border-b-0 last:pb-0 md:flex-row md:items-center md:justify-between"
              >
                <dt className="text-body-small text-text-secondary">{label}</dt>
                <dd className="text-body-base text-text-primary">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p
          role="status"
          className="flex gap-2 rounded-md border border-status-warning bg-surface-alt p-4 text-body-small text-text-secondary"
        >
          <span aria-hidden="true">⚠</span>
          付款期限：08/07（五）23:59 前完成轉帳，逾期訂位將自動釋出。
        </p>

        <div className="flex flex-col gap-3 md:flex-row md:justify-end">
          <Button variant="danger" size="lg" onClick={() => setConfirmOpen(true)}>
            取消訂位
          </Button>
          <Button size="lg" onClick={onPayDeposit}>
            前往支付訂金
          </Button>
        </div>
      </main>

      <Footer />

      <Dialog
        open={confirmOpen}
        title="是否取消這筆訂位？"
        description="取消後座位將立即釋出，需重新訂位。"
        confirmLabel="確認取消"
        cancelLabel="保留訂位"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onCancelReservation();
        }}
      />
    </div>
  );
}
