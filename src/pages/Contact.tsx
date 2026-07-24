import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TopBar from '../components/TopBar';
import OrderSummary from '../components/OrderSummary';
import { Card, PrimaryButton } from '../components/ui';
import { useBooking } from '../state/BookingContext';

/** Restaurant/contact info — Figma node 500:5576. */
export default function Contact() {
  const navigate = useNavigate();
  const { booking, update } = useBooking();
  const [touched, setTouched] = useState(false);

  const { name, phone, email, note } = booking.contact;
  const setContact = (patch: Partial<typeof booking.contact>) =>
    update({ contact: { ...booking.contact, ...patch } });

  const phoneOk = /^09\d{2}[\s-]?\d{3}[\s-]?\d{3}$/.test(phone.trim());
  const nameOk = name.trim().length > 0;
  const valid = nameOk && phoneOk;

  const submit = () => {
    setTouched(true);
    if (!valid) return;
    const d = booking.date ?? new Date();
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
      d.getDate()
    ).padStart(2, '0')}`;
    const seq = String(Math.floor(Math.random() * 900) + 100);
    update({ code: `A${ymd}-${seq}` });
    navigate('/success');
  };

  return (
    <Layout>
      <TopBar backLabel="選擇餐點" backTo="/meal" step="步驟 3 / 3" />

      <div className="mx-auto grid w-full max-w-content gap-6 px-2 py-4 lg:grid-cols-[1fr_380px]">
        {/* Left: form */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-cream">聯絡資料</h2>
          <p className="mb-5 text-sm text-muted">
            <span className="text-gold-light">*</span> 為必填欄位
          </p>

          <div className="flex flex-col gap-5">
            <Field label="姓名" required error={touched && !nameOk ? '請輸入姓名' : undefined}>
              <input
                value={name}
                onChange={(e) => setContact({ name: e.target.value })}
                placeholder="請輸入訂位人姓名"
                className="w-full rounded-btn border border-gold-faint bg-panel-input px-4 py-3 text-base text-cream placeholder:text-muted focus:border-gold focus:outline-none"
              />
            </Field>

            <Field
              label="手機號碼"
              required
              hint="用於接收 LINE / 簡訊 訂位通知"
              error={touched && !phoneOk ? '請輸入有效的手機號碼' : undefined}
            >
              <input
                value={phone}
                onChange={(e) => setContact({ phone: e.target.value })}
                inputMode="tel"
                placeholder="例：0912 345 678"
                className="w-full rounded-btn border border-gold-faint bg-panel-input px-4 py-3 text-base text-cream placeholder:text-muted focus:border-gold focus:outline-none"
              />
            </Field>

            <Field label="Email" hint="用於寄送訂位確認信（選填）">
              <input
                value={email}
                onChange={(e) => setContact({ email: e.target.value })}
                inputMode="email"
                placeholder="例：you@example.com"
                className="w-full rounded-btn border border-gold-faint bg-panel-input px-4 py-3 text-base text-cream placeholder:text-muted focus:border-gold focus:outline-none"
              />
            </Field>

            <Field label="特殊需求" hint="（選填）">
              <textarea
                value={note}
                onChange={(e) => setContact({ note: e.target.value })}
                rows={3}
                placeholder="例：兒童座椅、輪椅友善座位、過敏原註記…"
                className="w-full resize-none rounded-btn border border-gold-faint bg-panel-input px-4 py-3 text-base text-cream placeholder:text-muted focus:border-gold focus:outline-none"
              />
            </Field>
          </div>
        </Card>

        {/* Right: summary */}
        <div>
          <OrderSummary
            totalLabel="合計"
            action={
              <PrimaryButton onClick={submit} className="text-base">
                送出，開始配對桌位
              </PrimaryButton>
            }
            footnote="ⓘ 送出後系統將自動媒合桌位；若匹配時已滿，將轉入人工處理或候補。"
          />
        </div>
      </div>
    </Layout>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-cream-dim">
        {label} {required && <span className="text-gold-light">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}
