import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RESTAURANT_NAME } from '../data/menu';
import { currency, dateTimeLabel } from '../lib/format';
import { lineTotal } from '../lib/pricing';
import { useBooking } from '../store/BookingContext';
import { PageShell } from '../components/layout/PageShell';
import { Button } from '../components/ui/Button';
import { Card, InfoRow, Notice } from '../components/ui/Card';
import { Field } from '../components/ui/Field';

/** Figma: `Restaurant/contact info` (668:3955) — 步驟 3 / 3. */
export default function Contact() {
  const navigate = useNavigate();
  const booking = useBooking();
  const [touched, setTouched] = useState({ name: false, phone: false });

  useEffect(() => {
    if (booking.date === null || booking.time === null) navigate('/', { replace: true });
  }, [booking.date, booking.time, navigate]);

  const nameError = booking.contact.name.trim().length === 0;
  // 09xxxxxxxx — 10 digits, spaces allowed while typing.
  const phoneDigits = booking.contact.phone.replace(/\D/g, '');
  const phoneError = !/^09\d{8}$/.test(phoneDigits);

  const submit = () => {
    setTouched({ name: true, phone: true });
    if (nameError || phoneError) return;
    booking.confirmBooking();
    navigate('/success');
  };

  return (
    <PageShell backLabel="選擇餐點" backTo="/meals" step={3}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <Card className="flex flex-1 flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-r-h1 text-text-primary">聯絡資料</h1>
            <p className="text-r-note text-text-secondary">
              <span className="text-status-error" aria-hidden="true">
                ＊
              </span>{' '}
              為必填欄位
            </p>
          </div>

          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className="flex flex-col gap-1">
              <Field
                label="姓名"
                required
                placeholder="請輸入訂位人姓名"
                value={booking.contact.name}
                autoComplete="name"
                aria-invalid={touched.name && nameError}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                onChange={(e) => booking.setContact({ name: e.target.value })}
              />
              {touched.name && nameError && (
                <p className="text-r-note text-status-error">請填寫訂位人姓名。</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Field
                label="手機號碼"
                required
                inputMode="numeric"
                placeholder="例：0912 345 678"
                hint="用於接收 LINE／簡訊 訂位通知"
                value={booking.contact.phone}
                autoComplete="tel"
                aria-invalid={touched.phone && phoneError}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                onChange={(e) => booking.setContact({ phone: e.target.value })}
              />
              {touched.phone && phoneError && (
                <p className="text-r-note text-status-error">
                  請填寫 10 位數的台灣手機號碼（09 開頭）。
                </p>
              )}
            </div>

            <Field
              label="特製需求"
              placeholder="例：兒童座椅、輪椅友善座位、過敏原註記…"
              value={booking.contact.request}
              onChange={(e) => booking.setContact({ request: e.target.value })}
            />
            <p className="-mt-3 text-r-note text-text-secondary">（選填）</p>
          </form>
        </Card>

        <Card as="aside" className="flex flex-col gap-4 lg:w-[400px] lg:shrink-0">
          <h2 className="text-r-h1 text-text-primary">訂位摘要</h2>

          <dl className="divide-y divide-divider">
            <InfoRow label="餐廳名稱">{RESTAURANT_NAME}</InfoRow>
            <InfoRow label="日期時段">
              {dateTimeLabel(booking.date, booking.time)}
            </InfoRow>
            <InfoRow label="用餐人數">{booking.partySize} 位</InfoRow>
          </dl>

          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <p className="text-r-label text-text-secondary">已選餐點</p>
            {booking.lines.length === 0 ? (
              <p className="text-r-note text-text-secondary">未加點餐點（現場再點）</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {booking.lines.map((line) => (
                  <li
                    key={line.id}
                    className="flex items-baseline justify-between gap-2 text-r-note"
                  >
                    <span className="min-w-0 flex-1 text-text-primary">
                      {line.name} x{line.qty}
                    </span>
                    <span className="tabular-nums text-text-primary">
                      {currency(lineTotal(line))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-baseline justify-between gap-2 border-t border-border pt-4">
            <span className="text-r-label text-text-secondary">合計</span>
            <span className="text-r-h1 tabular-nums text-text-primary">
              {currency(booking.subtotal)}
            </span>
          </div>

          <Button size="lg" block onClick={submit}>
            確認，開始配對桌位
          </Button>

          <Notice>送出後系統將自動配對桌位；若該時段已滿，將轉人工或提供候補。</Notice>
        </Card>
      </div>
    </PageShell>
  );
}
