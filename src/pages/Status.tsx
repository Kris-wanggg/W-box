/**
 * Every status frame in the flow, all built from `Status Header` +
 * `Reservation Info Card` + `Notice` + `Action Buttons`.
 *
 * Figma: `Restaurant/booking success`, `…/booking/full`,
 * `…/booking/add 候補名單`, `…/booking/候補釋出通知`,
 * `…/reschedule/success-wait to pay/success`, `…/reschedule/success-paid`,
 * `…/success-paid/cancel-order`, `…/success-wait to pay/cancel-order`,
 * `…/cancel-order/…/success`, `…/ pay-success`.
 */
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { DepositRulesCard, ReservationInfoCard, StatusHeader } from '../components/blocks';
import { AlertIcon, ClockIcon } from '../components/icons';
import { Screen } from '../components/layout';
import { Button, Card, CardTitle, Divider, Money, Notice, SummaryRow } from '../components/ui';
import { BOOKING_ID, PAYMENT_DEADLINE, RESTAURANT } from '../data/reservation';
import { useBooking } from '../store';

function Actions({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">{children}</div>;
}

/* ── 訂位成立 ─────────────────────────────────────────────────────────────── */

export function BookingSuccess() {
  const navigate = useNavigate();
  return (
    <Screen backLabel="訂位查詢" backTo="/" width="narrow">
      <StatusHeader glyph="✓" title="訂位成立！" description="請於期限內完成訂金支付，以保留您的訂位" />
      <ReservationInfoCard paid={false} onReschedule="/reschedule" />
      <Notice tone="warn" icon={<AlertIcon size={16} />}>
        付款期限：{PAYMENT_DEADLINE} 前完成轉帳，逾期訂位將自動釋出。
      </Notice>
      <Actions>
        <Button variant="outline" onClick={() => navigate('/cancel')}>
          取消訂位
        </Button>
        <Button onClick={() => navigate('/payment')}>前往支付訂金</Button>
      </Actions>
    </Screen>
  );
}

/* ── 額滿：自動配對中 ─────────────────────────────────────────────────────── */

export function BookingFull() {
  const navigate = useNavigate();
  return (
    <Screen backLabel="填寫聯絡資訊" backTo="/contact" width="narrow">
      <StatusHeader glyph="⟳" tone="info" title="桌位自動配對中..." description="您選擇的時段目前已滿位" />
      <Card>
        <CardTitle>請稍後，將由專人為您服務</CardTitle>
        <p className="text-sm leading-[21px] text-ink-muted">
          店家將於營業時間內專人回電確認訂位，或為您安排最近的可用時段。
        </p>
      </Card>
      <Notice tone="warn" icon={<AlertIcon size={16} />}>
        您也可以加入候補名單，釋出座位時將以簡訊通知。
      </Notice>
      <Actions>
        <Button variant="outline" onClick={() => navigate('/')}>
          更改時段
        </Button>
        <Button onClick={() => navigate('/waitlist')}>加入候補名單</Button>
      </Actions>
    </Screen>
  );
}

/* ── 候補名單 ─────────────────────────────────────────────────────────────── */

export function WaitlistJoined() {
  const navigate = useNavigate();
  const { slotLabel, partyLabel } = useBooking();
  return (
    <Screen backLabel="訂位查詢" backTo="/" width="narrow">
      <StatusHeader glyph="✓" title="已加入候補名單" description="釋出座位時，我們會第一時間通知您" />
      <Card>
        <CardTitle>候補資訊</CardTitle>
        <p className="text-sm leading-[21px] text-ink-muted">
          您已加入 {slotLabel} {partyLabel}的候補名單，目前候補順位為
          <span className="font-medium text-brand">第 3 位</span>
          ，有空位釋出時將以您留的手機號碼通知您。
        </p>
      </Card>
      <Notice tone="warn" icon={<ClockIcon size={16} />}>
        候補為免費登記；釋出座位後需於通知起 30 分鐘內完成確認。
      </Notice>
      <Actions>
        <Button variant="outline" onClick={() => navigate('/')}>
          更改時段
        </Button>
        <Button onClick={() => navigate('/waitlist-released')}>完成</Button>
      </Actions>
    </Screen>
  );
}

export function WaitlistReleased() {
  const navigate = useNavigate();
  return (
    <Screen backLabel="訂位查詢" backTo="/" width="narrow">
      <StatusHeader
        glyph="✓"
        title="好消息！座位已釋出"
        description="您候補的時段有空位了，已為您暫時保留，請於期限內完成訂位。"
      />
      <ReservationInfoCard status="已確認" paid={false} onReschedule="/reschedule" />
      <Notice tone="warn" icon={<AlertIcon size={16} />}>
        付款期限：{PAYMENT_DEADLINE} 前完成轉帳，逾期訂位將自動釋出。
      </Notice>
      <Actions>
        <Button variant="outline" onClick={() => navigate('/cancel')}>
          取消訂位
        </Button>
        <Button onClick={() => navigate('/payment')}>前往支付訂金</Button>
      </Actions>
    </Screen>
  );
}

/* ── 修改訂位成功 ─────────────────────────────────────────────────────────── */

export function RescheduleDone({ paid = false }: { paid?: boolean }) {
  const navigate = useNavigate();
  return (
    <Screen backLabel="訂位查詢" backTo="/" width="narrow">
      <StatusHeader glyph="✓" title="修改訂位成功！" />
      <ReservationInfoCard status="已確認" paid={paid} onReschedule="/reschedule" />
      <Actions>
        <Button variant="outline" onClick={() => navigate(paid ? '/cancel-paid' : '/cancel')}>
          取消訂位
        </Button>
        <Button onClick={() => navigate(paid ? '/' : '/payment')}>{paid ? '完成' : '前往支付訂金'}</Button>
      </Actions>
    </Screen>
  );
}

/* ── 取消訂位 ─────────────────────────────────────────────────────────────── */

export function CancelConfirm({ paid = false }: { paid?: boolean }) {
  const navigate = useNavigate();
  return (
    <Screen backLabel="訂位詳情" backTo="/booking-success" width="narrow">
      <StatusHeader
        glyph="！"
        tone="danger"
        title="確定要取消這筆訂位嗎？"
        description="取消後訂位將立即釋出且無法復原，請確認"
      />
      <ReservationInfoCard status="已確認" paid={paid} onReschedule="/reschedule" />

      {paid ? (
        <DepositRulesCard />
      ) : (
        <Notice tone="warn" icon={<AlertIcon size={16} />}>
          付款期限：{PAYMENT_DEADLINE} 前完成轉帳，逾期訂位將自動釋出。
        </Notice>
      )}

      <Actions>
        <Button variant="outline" onClick={() => navigate(-1)}>
          返回
        </Button>
        <Button variant="danger" onClick={() => navigate(paid ? '/cancel-paid-done' : '/cancel-done')}>
          確認取消訂位
        </Button>
      </Actions>
    </Screen>
  );
}

export function CancelDone({ paid = false }: { paid?: boolean }) {
  const navigate = useNavigate();
  return (
    <Screen backLabel="訂位查詢" backTo="/" width="narrow">
      <StatusHeader glyph="✓" title="訂位已取消" />
      <ReservationInfoCard status="已取消" paid={paid} />
      {paid ? (
        <Notice tone="neutral">您的訂位已成功取消，訂金將依退款規則處理。</Notice>
      ) : null}
      <Actions>
        <Button onClick={() => navigate('/')}>完成</Button>
      </Actions>
    </Screen>
  );
}

/* ── 訂金支付成功 ─────────────────────────────────────────────────────────── */

export function PaySuccess() {
  const navigate = useNavigate();
  const { slotLabel, partyLabel, deposit, payment, contact } = useBooking();
  const methodLabel = { card: '線上支付信用卡', bank: '匯款', online: '線上轉帳' }[payment];

  return (
    <Screen backLabel="訂位查詢" backTo="/" width="narrow">
      <StatusHeader glyph="✓" title="訂金支付成功" description="已透過 Email 或 SMS 發送訂位成功通知" />

      <Card>
        <div className="flex flex-col gap-1">
          <span className="text-base font-medium text-ink">{RESTAURANT}</span>
          <span className="text-[13px] text-ink-muted">訂位編號 {BOOKING_ID}</span>
        </div>

        <p className="rounded-sm bg-black/[0.03] p-3 text-[13px] leading-[19.5px] text-ink-muted">
          【訂位成功通知】{contact.name} 您好，您的訂位已確認：{slotLabel} ‧ {partyLabel} 訂金 ${deposit}
        </p>

        <Divider />

        <span className="text-sm font-medium text-ink">訂金狀態</span>
        <div className="flex flex-col gap-3">
          <SummaryRow label="支付方式" value={methodLabel} />
          <SummaryRow label="支付時間" value="7/23（四）10:48" />
          <SummaryRow label="金額" value={<Money value={deposit} />} />
          <SummaryRow label="狀態" value={<span className="font-medium text-ok">成功</span>} />
        </div>
      </Card>

      <p className="text-center text-[13px] text-ink-muted">後續可至 Email 或預訂首頁查詢、修改或取消訂位。</p>

      <Actions>
        <Button onClick={() => navigate('/')}>完成</Button>
      </Actions>
    </Screen>
  );
}
