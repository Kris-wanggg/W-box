/**
 * Figma: `Restaurant/ search reservation` (668:5213),
 * `Restaurant/ search-reservation/success-wait to pay` (668:5260),
 * `Restaurant/ search-reservation/success-paid` (668:5359).
 *
 * A 560px `Content Stack` centred in the viewport. The form card stays at the
 * top once a reservation is found; the result appends `Reservation Info Card`,
 * a warning `[Comp] Field` and an `Action Buttons` row beneath it.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionRow, ReservationInfoCard } from '../components/blocks';
import { HeaderNote, Screen } from '../components/layout';
import { Button, Field, Input, Notice } from '../components/ui';
import { PAYMENT_DEADLINE, SUPPORT_PHONE } from '../data/reservation';

export default function Search({ result }: { result?: 'unpaid' | 'paid' }) {
  const navigate = useNavigate();
  const [id, setId] = useState(result ? 'A20260808' : '');
  const [phone, setPhone] = useState(result ? '0912345678' : '');
  const [found, setFound] = useState<'unpaid' | 'paid' | undefined>(result);
  const [error, setError] = useState<string>();

  const search = () => {
    if (!id.trim() && !phone.trim()) {
      setError('請至少輸入訂位編號或手機號碼');
      setFound(undefined);
      return;
    }
    setError(undefined);
    setFound('unpaid');
  };

  const paid = found === 'paid';

  return (
    <Screen backLabel="預約首頁" backTo="/" width="search" headerAction={<HeaderNote>免登入查詢</HeaderNote>}>
      {/* `Search Form Card` — 32px of padding, 20px between its blocks. */}
      <section className="rounded-panel bg-card shadow-card">
        <div className="flex flex-col gap-5 p-8">
          <header className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-h2-loose text-ink">查詢我的訂位</h1>
            <p className="text-body-sm text-ink-secondary">輸入訂位編號或手機號碼，查詢您的訂位</p>
          </header>

          <Field label="訂位編號">
            <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="A-123456789" />
          </Field>

          <Field label="手機號碼" error={error}>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="訂位時填寫的手機號碼"
              inputMode="tel"
            />
          </Field>

          <p className="text-body-sm text-ink-secondary">
            查無資料時，請確認輸入是否正確，或洽店家客服 {SUPPORT_PHONE}。
          </p>

          <Button block onClick={search}>
            立即查詢
          </Button>
        </div>
      </section>

      {found ? (
        <>
          {/* The 已付款 frame moves 修改訂位 out of the card and into the action
              row (822:534), so the card only carries the 28px chip when unpaid. */}
          <ReservationInfoCard status="已確認" paid={paid} onReschedule={paid ? undefined : '/reschedule'} />

          {/* Both result frames carry a warning `[Comp] Field`; the design left
              its copy as the component placeholder, so each state reuses the
              line the file already publishes for that state. */}
          <Notice tone="warn">
            {paid ? (
              <>
                如需變更，請於<span className="font-medium text-emphasis">用餐前一天 18:00</span>
                前完成操作，取消退款依店家規則辦理。
              </>
            ) : (
              <>付款期限：{PAYMENT_DEADLINE} 前完成轉帳，逾期訂位將自動釋出。</>
            )}
          </Notice>

          {/* 44px with 14/21 labels, unlike the 48px status rows (822:513). */}
          <ActionRow>
            <Button size="M" state="Default" onClick={() => navigate(paid ? '/cancel-paid' : '/cancel')}>
              取消訂位
            </Button>
            <Button size="M" onClick={() => navigate(paid ? '/reschedule-paid' : '/payment')}>
              {paid ? '修改訂位' : '前往支付訂金'}
            </Button>
          </ActionRow>
        </>
      ) : null}
    </Screen>
  );
}
