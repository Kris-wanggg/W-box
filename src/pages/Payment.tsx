/**
 * Figma: `Restaurant/booking success/ credit card`, `… / bank`,
 * `… / on line bank`.
 *
 * One screen; the three frames are the three radio選項 expanded.
 */
import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { DepositRulesCard } from '../components/blocks';
import { CopyIcon, InfoIcon } from '../components/icons';
import { Screen } from '../components/layout';
import { Button, Card, Divider, Field, Input, Money, SummaryRow, cx } from '../components/ui';
import { BANK, RESTAURANT } from '../data/reservation';
import { useBooking, type PaymentMethod } from '../store';

const METHODS: Array<{ id: PaymentMethod; label: string }> = [
  { id: 'card', label: '線上支付信用卡' },
  { id: 'bank', label: '匯款' },
  { id: 'online', label: '線上轉帳' },
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
      {/* `應付訂金` is a centred stack in the design, not a label/value row. */}
      <Card className="text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[13px] text-ink-secondary">應付訂金</span>
          <Money value={deposit} className="text-[32px] font-bold leading-10 text-ink" />
          <p className="text-xs text-ink-secondary">
            {RESTAURANT} ‧ {slotLabel} ‧ {partyLabel}
          </p>
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        <span className="text-[13px] text-ink-secondary">選擇支付方式（依店家設定顯示）</span>

        {METHODS.map(({ id, label }) => {
          const active = method === id;
          return (
            <div key={id} className="flex flex-col gap-3">
              <label
                className={cx(
                  'flex cursor-pointer items-center gap-3 rounded-control border bg-white px-4 py-3 transition-colors',
                  active ? 'border-brand' : 'border-line hover:border-brand/60',
                )}
              >
                <input
                  type="radio"
                  name="payment-method"
                  className="size-4 accent-brand"
                  checked={active}
                  onChange={() => setMethod(id)}
                />
                <span className={cx('text-sm', active ? 'font-medium text-ink' : 'text-ink')}>{label}</span>
              </label>

              {/* The expanded details are their own card beneath the row. */}
              {active && id === 'card' ? <CardForm /> : null}
              {active && id === 'bank' ? <TransferPanel verb="匯款" last5={last5} onLast5={setLast5} /> : null}
              {active && id === 'online' ? <TransferPanel verb="轉帳" last5={last5} onLast5={setLast5} /> : null}
            </div>
          );
        })}
      </div>

      <DepositRulesCard />

      <Button size="cta" block onClick={submit}>
        {method === 'card' ? `立即付款 $${deposit}` : '完成'}
      </Button>
    </Screen>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-tile border border-line bg-white p-4">{children}</div>
  );
}

function CardForm() {
  return (
    <Panel>
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

      <p className="flex items-start gap-2 text-xs leading-[18px] text-ink-secondary">
        <InfoIcon size={14} className="mt-0.5 shrink-0" />
        付款採 3D 驗證，資料以加密方式傳輸，本店不留存完整卡號。
      </p>
    </Panel>
  );
}

/**
 * 匯款 (668:5456) and 線上轉帳 (668:5574) publish the *same* panel — the
 * restaurant's account details, a末-5-碼 reconciliation field and two note
 * lines. Only the verb changes: 匯款 in one frame, 轉帳 in the other. Neither
 * frame offers a bank picker.
 */
function TransferPanel({
  verb,
  last5,
  onLast5,
}: {
  verb: '匯款' | '轉帳';
  last5: string;
  onLast5: (v: string) => void;
}) {
  const { deposit } = useBooking();

  return (
    <Panel>
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
                className="rounded p-1 text-ink-secondary transition-colors hover:bg-brand/[0.08] hover:text-brand"
              >
                <CopyIcon size={14} />
              </button>
            </span>
          }
        />
        <SummaryRow label="戶名" value={BANK.holder} />
        <SummaryRow label="金額" value={<Money value={deposit} />} strong />
      </dl>

      <Divider />

      <Field
        label={`${verb}帳號後五碼（對帳用）`}
        hint={`用於核對您的${verb}來源，加速對帳；請填寫您轉出帳戶的末 5 碼。`}
      >
        <Input
          value={last5}
          maxLength={5}
          inputMode="numeric"
          onChange={(e) => onLast5(e.target.value.replace(/\D/g, ''))}
          placeholder="請輸入帳號末 5 碼"
        />
      </Field>

      {/* Two plain lines in the frame, not a bordered advisory. */}
      <div className="flex flex-col gap-1 text-body-sm text-ink-secondary">
        <p>請於下單後 24 小時內完成{verb}，並保留交易明細；逾期未完成，訂位將自動取消。</p>
        <p>{verb}成功後，請於訂單查詢確認訂單狀態，如有任何問題請與我們聯繫。</p>
      </div>
    </Panel>
  );
}
