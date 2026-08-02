import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import { initialBooking } from '../booking';
import { setMenu } from '../data/menu';

/**
 * Per-screen checks against the Figma frames in section "28 section v3".
 */

describe('Restaurant/reservation-v3 (923:5151)', () => {
  it('顯示用餐人數、選擇日期、選擇時段三個區塊', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: '用餐人數' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '選擇時段' })).toBeInTheDocument();
    expect(screen.getByText('2026 年 8月')).toBeInTheDocument();
  });

  it('時段選項與 Figma 一致 (08:00 - 11:00)', () => {
    render(<App />);
    for (const slot of ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00']) {
      expect(screen.getByRole('button', { name: `選擇 ${slot}` })).toBeInTheDocument();
    }
  });

  it('成人 stepper 可增減，且不會低於 0', async () => {
    const user = userEvent.setup();
    render(<App />);

    const value = screen.getByLabelText('成人 數量');
    expect(value).toHaveTextContent('2');

    await user.click(screen.getByRole('button', { name: '增加 成人' }));
    expect(value).toHaveTextContent('3');

    await user.click(screen.getByRole('button', { name: '減少 成人' }));
    await user.click(screen.getByRole('button', { name: '減少 成人' }));
    await user.click(screen.getByRole('button', { name: '減少 成人' }));
    expect(value).toHaveTextContent('0');

    expect(screen.getByRole('button', { name: '減少 成人' })).toBeDisabled();
  });

  it('小孩數量預設為 0 且減少鈕為 disabled', () => {
    render(<App />);
    expect(screen.getByLabelText('小孩 (0-7歲) 數量')).toHaveTextContent('0');
    expect(screen.getByRole('button', { name: '減少 小孩 (0-7歲)' })).toBeDisabled();
  });

  it('未選日期與時段時，下一步按鈕為 disabled', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: '下一步：選擇餐點' }),
    ).toBeDisabled();
  });

  it('選好日期與時段後，下一步按鈕可用', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('gridcell', { name: '8 月 9 日' }));
    await user.click(screen.getByRole('button', { name: '選擇 11:00' }));

    expect(screen.getByRole('button', { name: '下一步：選擇餐點' })).toBeEnabled();
  });

  it('公休日 (Day Button Closed) 不可點選', () => {
    render(<App />);
    expect(screen.getByRole('gridcell', { name: '8 月 3 日' })).toBeDisabled();
  });
});

describe('Restaurant/choose-set/empty (923:1931)', () => {
  const renderAtChooseSet = () =>
    render(<App initialState={{ ...initialBooking, screen: 'choose-set' }} />);

  it('顯示 6 項套餐與分類標題', () => {
    renderAtChooseSet();
    expect(screen.getByText('目前分類：套餐 ‧ 共 6 項')).toBeInTheDocument();
    for (const item of setMenu) {
      expect(screen.getByRole('heading', { name: item.name })).toBeInTheDocument();
    }
  });

  it('空狀態顯示 Figma 的說明文字與 $0 小計', () => {
    renderAtChooseSet();
    const summary = screen.getByRole('complementary', { name: '已選餐點' });
    expect(within(summary).getByText('共 0 項')).toBeInTheDocument();
    expect(within(summary).getByLabelText('小計金額')).toHaveTextContent('$0');
    expect(
      within(summary).getByText('可先加入餐點，也可略過直接完成訂位。'),
    ).toBeInTheDocument();
  });

  it('步驟標示為 步驟 2 / 3', () => {
    renderAtChooseSet();
    expect(screen.getByText('步驟 2 / 3')).toBeInTheDocument();
  });

  it('加入套餐後，摘要更新項數與小計', async () => {
    const user = userEvent.setup();
    renderAtChooseSet();

    const card = screen.getByRole('heading', { name: '雙人分享套餐' }).closest('article')!;
    await user.click(within(card).getByRole('button', { name: '加入' }));

    const summary = screen.getByRole('complementary', { name: '已選餐點' });
    expect(within(summary).getByText('共 1 項')).toBeInTheDocument();
    expect(within(summary).getByLabelText('小計金額')).toHaveTextContent('$790');
  });

  it('重複加入同一套餐會累加數量而非新增列', async () => {
    const user = userEvent.setup();
    renderAtChooseSet();

    const card = screen.getByRole('heading', { name: '雙人分享套餐' }).closest('article')!;
    await user.click(within(card).getByRole('button', { name: '加入' }));
    await user.click(within(card).getByRole('button', { name: '加入' }));

    const summary = screen.getByRole('complementary', { name: '已選餐點' });
    expect(within(summary).getByText('共 2 項')).toBeInTheDocument();
    expect(within(summary).getByText('$790 × 2')).toBeInTheDocument();
    expect(within(summary).getAllByRole('listitem')).toHaveLength(1);
  });

  it('可從摘要移除已選餐點', async () => {
    const user = userEvent.setup();
    renderAtChooseSet();

    const card = screen.getByRole('heading', { name: '雙人分享套餐' }).closest('article')!;
    await user.click(within(card).getByRole('button', { name: '加入' }));

    const summary = screen.getByRole('complementary', { name: '已選餐點' });
    await user.click(within(summary).getByRole('button', { name: '刪除 雙人分享套餐' }));

    expect(within(summary).getByText('共 0 項')).toBeInTheDocument();
  });
});

describe('Restaurant/choose-drink/default (923:2482) + Meal Card/drink (936:8686)', () => {
  const renderAtDrink = () =>
    render(<App initialState={{ ...initialBooking, screen: 'choose-drink' }} />);

  it('顯示 6 項飲品與必選說明', () => {
    renderAtDrink();
    expect(screen.getByText('目前分類：飲品 ‧ 共 6 項')).toBeInTheDocument();
    expect(
      screen.getByText(
        '飲品可設定冰塊、甜度與加料；冰塊／甜度為必選單選，加料為可複選。',
      ),
    ).toBeInTheDocument();
  });

  it('冰塊與甜度未選時，加入按鈕為 disabled', () => {
    renderAtDrink();
    expect(screen.getByRole('button', { name: '加入 鮮榨柳橙汁' })).toBeDisabled();
  });

  it('冰塊與甜度都選好後才可加入', async () => {
    const user = userEvent.setup();
    renderAtDrink();

    const card = screen.getByRole('heading', { name: '鮮榨柳橙汁' }).closest('article')!;
    await user.click(within(card).getByRole('button', { name: '少冰' }));
    expect(screen.getByRole('button', { name: '加入 鮮榨柳橙汁' })).toBeDisabled();

    await user.click(within(card).getByRole('button', { name: '半糖' }));
    expect(screen.getByRole('button', { name: '加入 鮮榨柳橙汁' })).toBeEnabled();
  });

  it('加料為可複選，且即時反映在品項小計', async () => {
    const user = userEvent.setup();
    renderAtDrink();

    const card = screen.getByRole('heading', { name: '鮮榨柳橙汁' }).closest('article')!;
    expect(within(card).getByText('此品項小計 $90')).toBeInTheDocument();

    await user.click(within(card).getByRole('button', { name: '珍珠 +$10' }));
    await user.click(within(card).getByRole('button', { name: '布丁 +$20' }));
    expect(within(card).getByText('此品項小計 $120')).toBeInTheDocument();

    // 再點一次取消勾選
    await user.click(within(card).getByRole('button', { name: '珍珠 +$10' }));
    expect(within(card).getByText('此品項小計 $110')).toBeInTheDocument();
  });

  it('加入飲品後，摘要顯示所選的冰塊與甜度', async () => {
    const user = userEvent.setup();
    renderAtDrink();

    const card = screen.getByRole('heading', { name: '鮮榨柳橙汁' }).closest('article')!;
    await user.click(within(card).getByRole('button', { name: '去冰' }));
    await user.click(within(card).getByRole('button', { name: '無糖' }));
    await user.click(screen.getByRole('button', { name: '加入 鮮榨柳橙汁' }));

    const summary = screen.getByRole('complementary', { name: '已選餐點' });
    expect(within(summary).getByText('需求：去冰 ‧ 無糖')).toBeInTheDocument();
  });

  it('備註欄有 50 字上限與即時字數', async () => {
    const user = userEvent.setup();
    renderAtDrink();

    const card = screen.getByRole('heading', { name: '鮮榨柳橙汁' }).closest('article')!;
    const note = within(card).getByLabelText('其他自訂需求（選填）');
    expect(note).toHaveAttribute('maxLength', '50');

    await user.type(note, '少冰謝謝');
    expect(within(card).getByText('4 / 50')).toBeInTheDocument();
  });
});

describe('Restaurant/contact info (923:3218)', () => {
  const renderAtContact = () =>
    render(
      <App
        initialState={{
          ...initialBooking,
          screen: 'contact-info',
          date: '2026-08-09',
          time: '18:00',
        }}
      />,
    );

  it('顯示必填標示與步驟 3 / 3', () => {
    renderAtContact();
    expect(screen.getByText('步驟 3 / 3')).toBeInTheDocument();
    expect(screen.getByText('為必填欄位')).toBeInTheDocument();
  });

  it('手機欄位預設顯示通知用途說明', () => {
    renderAtContact();
    expect(screen.getByText('用於接收 LINE／簡訊 訂位通知')).toBeInTheDocument();
  });

  it('手機格式錯誤時顯示錯誤訊息並標記 aria-invalid', async () => {
    const user = userEvent.setup();
    renderAtContact();

    await user.type(screen.getByLabelText(/手機號碼/), '0912');

    expect(screen.getByLabelText(/手機號碼/)).toHaveAttribute('aria-invalid', 'true');
    expect(
      screen.getByText('請輸入正確的手機號碼格式（09 開頭共 10 碼）'),
    ).toBeInTheDocument();
  });

  it('未填妥必填欄位時，確認訂位為 disabled', async () => {
    const user = userEvent.setup();
    renderAtContact();

    expect(screen.getByRole('button', { name: '確認訂位' })).toBeDisabled();

    await user.type(screen.getByLabelText(/姓名/), '王小姐');
    expect(screen.getByRole('button', { name: '確認訂位' })).toBeDisabled();

    await user.type(screen.getByLabelText(/手機號碼/), '0912345678');
    expect(screen.getByRole('button', { name: '確認訂位' })).toBeEnabled();
  });

  it('側欄摘要顯示日期時段與人數', () => {
    renderAtContact();
    const summary = screen.getByRole('complementary', { name: '訂位摘要' });
    expect(within(summary).getByText('08/09（日） 18:00')).toBeInTheDocument();
    expect(within(summary).getByText('2 位')).toBeInTheDocument();
  });
});

describe('Restaurant/booking success (923:3698)', () => {
  const successState = {
    ...initialBooking,
    screen: 'booking-success' as const,
    date: '2026-08-09',
    time: '18:00',
    contact: { name: '王小姐', phone: '0912345678', note: '' },
    reservationId: '#A20260808-018',
  };

  it('顯示訂位成立標題與付款提醒', () => {
    render(<App initialState={successState} />);
    expect(screen.getByRole('heading', { name: '訂位成立！' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(
      '付款期限：08/07（五）23:59 前完成轉帳，逾期訂位將自動釋出。',
    );
  });

  it('訂位資訊欄位與 Figma 一致', () => {
    render(<App initialState={successState} />);
    const info = screen.getByRole('region', { name: '訂位資訊' });

    for (const [label, value] of [
      ['訂位編號', '#A20260808-018'],
      ['訂位人', '王小姐'],
      ['聯絡電話', '0912345678'],
      ['餐廳名稱', '第28區中餐廳'],
      ['日期時段', '08/09（日） 18:00'],
      ['用餐人數', '2 位'],
      ['訂金金額', '$600'],
    ]) {
      expect(within(info).getByText(label)).toBeInTheDocument();
      expect(within(info).getByText(value)).toBeInTheDocument();
    }
  });

  it('取消訂位會先跳出 Dialog - del prompt 確認', async () => {
    const user = userEvent.setup();
    render(<App initialState={successState} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '取消訂位' }));

    const dialog = screen.getByRole('dialog', { name: '是否取消這筆訂位？' });
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByText('取消後座位將立即釋出，需重新訂位。'),
    ).toBeInTheDocument();
  });

  it('Dialog 可用 Esc 關閉且不取消訂位', async () => {
    const user = userEvent.setup();
    render(<App initialState={successState} />);

    await user.click(screen.getByRole('button', { name: '取消訂位' }));
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '訂位成立！' })).toBeInTheDocument();
  });

  it('確認取消後回到訂位首頁', async () => {
    const user = userEvent.setup();
    render(<App initialState={successState} />);

    await user.click(screen.getByRole('button', { name: '取消訂位' }));
    await user.click(screen.getByRole('button', { name: '確認取消' }));

    expect(screen.getByRole('heading', { name: '用餐人數' })).toBeInTheDocument();
  });
});

describe('Shared Footer', () => {
  it('每個畫面都有頁尾品牌與三個連結', () => {
    for (const screenName of [
      'reservation',
      'choose-set',
      'choose-drink',
      'contact-info',
      'booking-success',
    ] as const) {
      const { unmount } = render(
        <App initialState={{ ...initialBooking, screen: screenName }} />,
      );

      expect(screen.getByText('RESTAURANT BOOKING ENTRANCE')).toBeInTheDocument();
      const footerNav = screen.getByRole('navigation', { name: '頁尾導覽' });
      for (const label of ['隱私政策', '服務條款', '聯繫我們']) {
        expect(within(footerNav).getByRole('link', { name: label })).toBeInTheDocument();
      }

      unmount();
    }
  });
});

describe('無障礙 — 標題階層', () => {
  it('每個畫面只有一個 h1', () => {
    for (const screenName of [
      'reservation',
      'choose-set',
      'choose-drink',
      'contact-info',
      'booking-success',
    ] as const) {
      const { unmount } = render(
        <App initialState={{ ...initialBooking, screen: screenName }} />,
      );
      expect(
        screen.getAllByRole('heading', { level: 1 }),
        `${screenName} 應該只有一個 h1`,
      ).toHaveLength(1);
      unmount();
    }
  });
});

describe('主控流程不會有非預期的 console 錯誤', () => {
  it('渲染訂位頁不觸發 React 警告', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<App />);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
