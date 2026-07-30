import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RESTAURANT_NAME } from '../data/menu';
import { currency, dateTimeLabel, receiptTimestamp } from '../lib/format';
import { useBooking } from '../store/BookingContext';
import { PageShell } from '../components/layout/PageShell';
import { Button } from '../components/ui/Button';
import { Card, InfoRow } from '../components/ui/Card';

/** Figma: `Restaurant/ pay-success` (668:5692). */
export default function PaySuccess() {
  const navigate = useNavigate();
  const booking = useBooking();

  useEffect(() => {
    if (booking.paidAt === null) navigate('/', { replace: true });
  }, [booking.paidAt, navigate]);

  const surname = booking.contact.name.trim().slice(0, 1);

  return (
    <PageShell backLabel="預約首頁" backTo="/" narrow>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span
            aria-hidden="true"
            className="grid h-[68px] w-[68px] place-items-center rounded-full bg-status-success/15 ring-1 ring-status-success/30 text-[25px] text-status-success"
          >
            ✓
          </span>
          <h1 className="text-[24px] font-semibold leading-8 text-text-primary">
            訂金支付成功
          </h1>
          <p className="text-r-body text-text-secondary">
            已透過 Email 或 SMS 發送訂位成功通知
          </p>
        </div>

        <Card className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-r-h2 text-text-primary">{RESTAURANT_NAME}</p>
            <p className="text-r-note text-text-secondary">
              訂位編號 {booking.reservationNo}
            </p>
          </div>

          <p className="rounded-md bg-background px-4 py-3 text-r-body text-text-primary">
            【訂位成功通知】{surname} 您好，您的訂位已確認：
            {dateTimeLabel(booking.date, booking.time)} ‧ {booking.partySize} 位 訂金{' '}
            {currency(booking.deposit)}
          </p>
        </Card>

        <Card className="flex flex-col gap-3">
          <h2 className="text-r-h2 text-text-primary">訂金狀態</h2>
          <dl className="divide-y divide-divider">
            <InfoRow label="支付方式">{booking.paymentMethod}</InfoRow>
            <InfoRow label="支付時間">
              {booking.paidAt === null ? '—' : receiptTimestamp(booking.paidAt)}
            </InfoRow>
            <InfoRow label="金額">
              <span className="tabular-nums">{currency(booking.deposit)}</span>
            </InfoRow>
            <InfoRow label="狀態">
              <span className="rounded-pill bg-status-success/15 px-2 py-0.5 text-status-success">
                成功
              </span>
            </InfoRow>
          </dl>
        </Card>

        <p className="text-center text-r-note text-text-secondary">
          後續可至 Email 或預訂首頁查詢、修改或取消訂位。
        </p>

        <Button
          size="lg"
          block
          onClick={() => {
            booking.reset();
            navigate('/');
          }}
        >
          完成
        </Button>
      </div>
    </PageShell>
  );
}
