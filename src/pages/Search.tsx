/**
 * Figma: `Restaurant/ search reservation`,
 * `Restaurant/ search-reservation/success-wait to pay`,
 * `Restaurant/ search-reservation/success-paid`.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionRow, ReservationInfoCard } from '../components/blocks';
import { Screen } from '../components/layout';
import { Button, Card, Field, Input, Notice } from '../components/ui';
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

  return (
    <Screen backLabel="預約首頁" backTo="/" width="narrow">
      <Card>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-base font-semibold leading-6 text-ink">查詢我的訂位</h1>
          <p className="text-xs leading-[18px] text-ink-secondary">輸入訂位編號或手機號碼，查詢您的訂位</p>
        </div>

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

        <p className="text-xs leading-[18px] text-ink-secondary">
          查無資料時，請確認輸入是否正確，或洽店家客服 {SUPPORT_PHONE}。
        </p>

        <Button size="cta" block onClick={search}>
          立即查詢
        </Button>
      </Card>

      {found ? (
        <>
          {/* The 已付款 frame moves 修改訂位 out of the card and into the action
              row (822:534), so the card only carries the 28px chip when unpaid. */}
          <ReservationInfoCard
            status="已確認"
            paid={found === 'paid'}
            onReschedule={found === 'paid' ? undefined : '/reschedule'}
          />

          {found === 'unpaid' ? (
            <Notice tone="warn">
              付款期限：{PAYMENT_DEADLINE} 前完成轉帳，逾期訂位將自動釋出。
            </Notice>
          ) : null}

          {/* Unlike the status screens, the 訂位查詢 result row is 44px with
              14/21 labels (822:513 / 822:516). */}
          <ActionRow>
            <Button size="compact" variant="outline" onClick={() => navigate(found === 'paid' ? '/cancel-paid' : '/cancel')}>
              取消訂位
            </Button>
            <Button size="compact" onClick={() => navigate(found === 'paid' ? '/reschedule-paid' : '/payment')}>
              {found === 'paid' ? '修改訂位' : '前往支付訂金'}
            </Button>
          </ActionRow>
        </>
      ) : null}
    </Screen>
  );
}
