import { Navigate, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TopBar from '../components/TopBar';
import { Card, GhostButton, PrimaryButton } from '../components/ui';
import { CheckIcon } from '../components/icons';
import { totalGuests, useBooking } from '../state/BookingContext';
import { twd } from '../data/menu';

const CN_WEEK = ['日', '一', '二', '三', '四', '五', '六'];

/** Restaurant/booking success — Figma node 512:5931. */
export default function BookingSuccess() {
  const navigate = useNavigate();
  const { booking } = useBooking();

  // Guard: reaching this screen requires a submitted booking.
  if (!booking.code) return <Navigate to="/" replace />;

  const d = booking.date;
  const dateStr = d
    ? `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(
        2,
        '0'
      )} (${CN_WEEK[d.getDay()]})`
    : '—';
  const guests = totalGuests(booking);
  const deposit = guests * 300;

  return (
    <Layout>
      <TopBar backLabel="預約首頁" backTo="/" />

      <div className="mx-auto flex w-full max-w-[560px] flex-col items-center px-2 py-6">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-gold-soft text-gold-light">
          <CheckIcon size={30} />
        </div>
        <h1 className="text-2xl font-bold text-white">訂位成立！</h1>
        <p className="mb-6 mt-1 text-center text-sm text-muted">
          請於期限內完成訂金支付，以保留您的訂位
        </p>

        <Card className="w-full p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-cream">訂位資訊</h2>
            <span className="rounded-badge border border-gold bg-gold-soft px-3 py-1 text-xs font-medium text-gold-light">
              已確認
            </span>
          </div>

          <dl className="flex flex-col gap-3 text-sm">
            <Row label="訂位編號" value={`#${booking.code}`} />
            <Row label="訂位人" value={booking.contact.name || '—'} />
            <Row label="聯絡電話" value={booking.contact.phone || '—'} />
            <Row label="餐廳名稱" value="第28區中餐廳" />
            <Row label="日期時段" value={`${dateStr} ${booking.time ?? ''} · 標準訂位`} />
            <Row label="用餐人數" value={`${guests} 位`} />
            <div className="flex items-center justify-between">
              <dt className="text-cream-dim">訂位金額</dt>
              <dd className="flex items-center gap-2">
                <span className="font-bold text-gold-light">{twd(deposit)}</span>
                <span className="rounded-badge bg-[rgba(229,72,77,0.15)] px-2 py-0.5 text-xs text-danger">
                  未付款
                </span>
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex items-start gap-2 rounded-btn border border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.08)] px-4 py-3 text-xs leading-relaxed text-[#e0b050]">
            <span>⚠</span>
            <span>
              付款期限：請於用餐日前 24 小時完成繳費，逾時訂位將有自動釋出風險。
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <GhostButton
              className="text-base"
              onClick={() => navigate('/')}
            >
              取消訂位
            </GhostButton>
            <PrimaryButton
              className="text-base"
              onClick={() => alert('付款流程為設計稿示意，此原型未串接金流。')}
            >
              前往支付訂金
            </PrimaryButton>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-cream-dim">{label}</dt>
      <dd className="font-medium text-cream">{value}</dd>
    </div>
  );
}
