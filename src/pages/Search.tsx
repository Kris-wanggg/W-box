import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TopBar from '../components/TopBar';
import { Card, PrimaryButton } from '../components/ui';
import { useBooking } from '../state/BookingContext';

/** Restaurant/search reservation — Figma node 504:6317. */
export default function Search() {
  const navigate = useNavigate();
  const { booking } = useBooking();
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const query = () => {
    const normalized = code.trim().replace(/^#/, '').toUpperCase();
    // In this prototype the only "record" is the one made this session.
    if (
      booking.code &&
      (normalized === booking.code.toUpperCase() ||
        (phone.trim() && phone.trim() === booking.contact.phone.trim()))
    ) {
      navigate('/success');
      return;
    }
    setMessage('查無符合的訂位，請確認訂位編號或手機號碼是否正確。');
  };

  return (
    <Layout>
      <TopBar backLabel="預約首頁" backTo="/" step="免登入查詢" />

      <div className="flex flex-1 items-center justify-center py-6">
        <Card className="max-w-[460px] min-w-[320px] px-8 py-8">
          <h1 className="text-center text-2xl font-bold text-white">查詢我的訂位</h1>
          <p className="mb-6 mt-1 text-center text-sm text-muted">
            輸入訂位編號或手機號碼，查詢您的訂位
          </p>

          <div className="flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-sm text-cream-dim">訂位編號</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="例：#A20260721-018"
                className="w-full rounded-btn border border-gold-faint bg-panel-input px-4 py-3 text-base text-cream placeholder:text-muted focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-cream-dim">手機號碼</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                placeholder="訂位時填寫的手機號碼"
                className="w-full rounded-btn border border-gold-faint bg-panel-input px-4 py-3 text-base text-cream placeholder:text-muted focus:border-gold focus:outline-none"
              />
            </div>

            <div className="rounded-btn border border-gold-faint bg-panel-soft px-4 py-3 text-xs leading-relaxed text-muted">
              查詢資料時，請確認輸入是否正確，或洽店家客服 02-1234-5678。
            </div>

            {message && (
              <p className="text-center text-xs text-danger">{message}</p>
            )}

            <PrimaryButton className="text-base" onClick={query}>
              立即查詢
            </PrimaryButton>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
