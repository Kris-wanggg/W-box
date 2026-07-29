/**
 * Figma: `Restaurant/booking success/ credit card`, `… / bank`,
 * `… / on line bank`.
 *
 * One screen; the three frames are the three radio選項 expanded.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DepositRulesCard } from '../components/blocks';
import { BankIcon, CopyIcon, CreditCardIcon, InfoIcon } from '../components/icons';
import { Screen } from '../components/layout';
import { Button, Card, CardTitle, Field, Input, Money, Notice, SummaryRow, cx } from '../components/ui';
import { BANK, RESTAURANT } from '../data/reservation';
import { useBooking, type PaymentMethod } from '../store';

const METHODS: Array<{ id: PaymentMethod; label: string; icon: typeof BankIcon }> = [
  { id: 'card', label: '線上支付信用卡', icon: CreditCardIcon },
  { id: 'bank', label: '匯款', icon: BankIcon },
  { id: 'online', label: '線上轉帳', icon: BankIcon },
];

export default function Payment({ initialMethod = 'card' }: { initialMethod?: PaymentMethod }) {
  const navigate = useNavigate();
  const { deposit, slotLabel, partyLabel, set } = useBooking();
  const [method, setMethod] = useState<PaymentMethod>(initialMethod);
  const [last5, setLast5] = useState('');

  const submit = () => {
    set('payment', method);
    set('paymentStatus', 'paid');
    navigate('/pay-success');
  };

  return (
    <Screen backLabel="訂位詳情" backTo="/booking-success" width="narrow">
      <Card>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-base font-medium text-ink">應付訂金</span>
          <Money value={deposit} className="text-[28px] font-bold leading-9 text-brand" />
        </div>
        <p className="text-[13px] text-ink-muted">
          {RESTAURANT} ‧ {slotLabel} ‧ {partyLabel}
        </p>
      </Card>

      <Card>
        <CardTitle>選擇支付方式（依店家設定顯示）</CardTitle>

        <div className="flex flex-col gap-3">
          {METHODS.map(({ id, label, icon: Icon }) => {
            const active = method === id;
            return (
              <div
                key={id}
                className={cx(
                  'rounded-sm border transition-colors',
                  // brand-tint is already an rgba() token, so an opacity
                  // modifier on it would not compile — tint off the hex instead.
                  active ? 'border-brand bg-brand/[0.04]' : 'border-line bg-white',
                )}
              >
                <label className="flex cursor-pointer items-center gap-3 p-4">
                  <input
                    type="radio"
                    name="payment-method"
                    className="size-4 accent-brand"
                    checked={active}
                    onChange={() => setMethod(id)}
                  />
                  <Icon size={20} className="text-ink-muted" />
                  <span className="text-sm font-medium text-ink">{label}</span>
                </label>

                {active && id === 'card' ? <CardForm /> : null}
                {active && id === 'bank' ? <BankPanel last5={last5} onLast5={setLast5} /> : null}
                {active && id === 'online' ? <OnlineBankPanel /> : null}
              </div>
            );
          })}
        </div>
      </Card>

      <DepositRulesCard />

      <Button block onClick={submit}>
        {method === 'card' ? `立即付款 $${deposit}` : '完成'}
      </Button>
    </Screen>
  );
}

function CardForm() {
  return (
    <div className="flex flex-col gap-4 border-t border-line-soft p-4">
      <Field label="卡號" required>
        <Input placeholder="1234  5678  9012  3456" inputMode="numeric" autoComplete="cc-number" />
      </Field>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Field label="有效期限（月／年）" required>
          <Input placeholder="08 / 28" inputMode="numeric" autoComplete="cc-exp" />
        </Field>
        <Field label="安全碼 CVV" required>
          <Input placeholder="123" inputMode="numeric" autoComplete="cc-csc" />
        </Field>
      </div>

      <Field label="持卡人姓名" required>
        <Input placeholder="王" autoComplete="cc-name" />
      </Field>

      <p className="flex items-start gap-2 text-xs leading-[18px] text-ink-muted">
        <InfoIcon size={14} className="mt-0.5 shrink-0" />
        付款採 3D 驗證，資料以加密方式傳輸，本店不留存完整卡號。
      </p>
    </div>
  );
}

function BankPanel({ last5, onLast5 }: { last5: string; onLast5: (v: string) => void }) {
  const { deposit } = useBooking();

  return (
    <div className="flex flex-col gap-4 border-t border-line-soft p-4">
      <dl className="flex flex-col gap-3">
        <SummaryRow label="收款銀行" value={BANK.bank} />
        <SummaryRow label="分行" value={BANK.branch} />
        <SummaryRow
          label="帳號"
          value={
            <span className="inline-flex items-center gap-2">
              {BANK.account}
              <button
                type="button"
                aria-label="複製帳號"
                onClick={() => navigator.clipboard?.writeText(BANK.account)}
                className="rounded p-1 text-ink-muted transition-colors hover:bg-brand-tint hover:text-brand"
              >
                <CopyIcon size={14} />
              </button>
            </span>
          }
        />
        <SummaryRow label="戶名" value={BANK.holder} />
        <SummaryRow label="金額" value={<Money value={deposit} />} strong />
      </dl>

      <Field label="匯款帳號後五碼（對帳用）" hint="用於核對您的匯款來源，加速對帳；請填寫您轉出帳戶的末 5 碼。">
        <Input
          value={last5}
          maxLength={5}
          inputMode="numeric"
          onChange={(e) => onLast5(e.target.value.replace(/\D/g, ''))}
          placeholder="請輸入帳號末 5 碼"
        />
      </Field>

      <Notice tone="warn">
        請於下單後 24 小時內完成匯款，並保留交易明細；逾期未完成，訂位將自動取消。
        <br />
        匯款成功後，請於訂單查詢確認訂單狀態，如有任何問題請與我們聯繫。
      </Notice>
    </div>
  );
}

function OnlineBankPanel() {
  return (
    <div className="flex flex-col gap-3 border-t border-line-soft p-4">
      <p className="text-[13px] leading-[19.5px] text-ink-muted">
        將導向您選擇的網路銀行完成轉帳，完成後會自動返回本頁並更新訂單狀態。
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {['玉山銀行', '國泰世華', '中國信託', '台新銀行'].map((bank) => (
          <button
            key={bank}
            type="button"
            className="h-11 rounded-lg border border-line text-[13px] text-ink transition-colors hover:bg-brand-tint hover:text-brand"
          >
            {bank}
          </button>
        ))}
      </div>
      <Notice tone="neutral">
        轉帳完成後系統約需 5 分鐘同步對帳；若狀態未更新，請至訂位查詢頁重新整理。
      </Notice>
    </div>
  );
}
