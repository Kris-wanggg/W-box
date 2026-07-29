/**
 * Figma: `Restaurant/ search reservation`,
 * `Restaurant/ search-reservation/success-wait to pay`,
 * `Restaurant/ search-reservation/success-paid`.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReservationInfoCard } from '../components/blocks';
import { AlertIcon, SearchIcon } from '../components/icons';
import { Screen } from '../components/layout';
import { Button, Card, CardTitle, Field, Input, Notice } from '../components/ui';
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
    <Screen backLabel="訂位查詢" backTo="/" width="narrow">
      <Card>
        <div className="flex flex-col gap-1">
          <CardTitle>查詢我的訂位</CardTitle>
          <p className="text-sm leading-[21px] text-ink-muted">輸入訂位編號或手機號碼，查詢您的訂位</p>
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

        <p className="text-xs leading-[18px] text-ink-muted">
          查無資料時，請確認輸入是否正確，或洽店家客服 {SUPPORT_PHONE}。
        </p>

        <Button block onClick={search}>
          <SearchIcon size={18} />
          立即查詢
        </Button>
      </Card>

      {found ? (
        <>
          <ReservationInfoCard status="已確認" paid={found === 'paid'} onReschedule="/reschedule" />

          {found === 'unpaid' ? (
            <Notice tone="warn" icon={<AlertIcon size={16} />}>
              付款期限：{PAYMENT_DEADLINE} 前完成轉帳，逾期訂位將自動釋出。
            </Notice>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="outline" onClick={() => navigate(found === 'paid' ? '/cancel-paid' : '/cancel')}>
              取消訂位
            </Button>
            <Button onClick={() => navigate(found === 'paid' ? '/' : '/payment')}>
              {found === 'paid' ? '完成' : '前往支付訂金'}
            </Button>
          </div>
        </>
      ) : null}
    </Screen>
  );
}
