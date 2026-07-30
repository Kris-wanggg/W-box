import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RESTAURANT_NAME } from '../data/menu';
import { currency, dateTimeLabel, paymentDeadline } from '../lib/format';
import { useBooking } from '../store/BookingContext';
import { PageShell } from '../components/layout/PageShell';
import { Button } from '../components/ui/Button';
import { Card, InfoRow, Notice } from '../components/ui/Card';

/** Figma: `Restaurant/booking success` (668:4365). */
export default function BookingSuccess() {
  const navigate = useNavigate();
  const booking = useBooking();

  useEffect(() => {
    if (booking.reservationNo === null) navigate('/', { replace: true });
  }, [booking.reservationNo, navigate]);

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
            訂位成立！
          </h1>
          <p className="text-r-body text-text-secondary">
            請於期限內完成訂金支付，以保留您的訂位
          </p>
        </div>

        <Card className="flex flex-col gap-4">
          <h2 className="text-r-h1 text-text-primary">訂位資訊</h2>

          <dl className="divide-y divide-divider">
            <InfoRow label="訂位編號">{booking.reservationNo}</InfoRow>
            <InfoRow label="訂位人">{booking.contact.name}</InfoRow>
            <InfoRow label="聯絡電話">
              {booking.contact.phone.replace(/\s/g, '')}
            </InfoRow>
            <InfoRow label="餐廳名稱">{RESTAURANT_NAME}</InfoRow>
            <InfoRow
              label="日期時段"
              action={
                <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                  修改訂位
                </Button>
              }
            >
              {dateTimeLabel(booking.date, booking.time)}
            </InfoRow>
            <InfoRow label="用餐人數">{booking.partySize} 位</InfoRow>
          </dl>

          <div className="flex items-baseline justify-between gap-2 border-t border-border pt-4">
            <span className="text-r-label text-text-secondary">訂金金額</span>
            <span className="text-[20px] font-semibold leading-7 tabular-nums text-text-primary">
              {currency(booking.deposit)}
            </span>
          </div>
        </Card>

        <Notice icon="⚠" tone="warning">
          付款期限：{paymentDeadline(booking.date)} 前完成轉帳，逾期訂位將自動釋出。
        </Notice>

        <div className="flex flex-col gap-3 md:flex-row">
          <Button
            variant="danger"
            size="lg"
            block
            onClick={() => {
              booking.reset();
              navigate('/');
            }}
          >
            取消訂位
          </Button>
          <Button size="lg" block onClick={() => navigate('/payment')}>
            前往支付訂金
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
