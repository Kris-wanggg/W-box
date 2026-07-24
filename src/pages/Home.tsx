import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Badge, Card, GhostButton, PrimaryButton } from '../components/ui';
import { ClockIcon, PhoneIcon } from '../components/icons';

/** Restaurant/home — Figma node 492:3. Booking entrance / landing screen. */
export default function Home() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex flex-1 items-center justify-center py-6">
        <Card className="max-w-[544px] min-w-[320px] px-8 py-6">
          <div className="flex flex-col items-center gap-5">
            <h1 className="text-center text-[32px] font-bold tracking-wide text-white">
              第28區中餐廳
            </h1>

            <Badge>訂位模式：提供客製化點餐</Badge>

            <div className="flex flex-col gap-1">
              <p className="text-base font-medium leading-relaxed text-cream">
                宴會桌宴專門店 ‧ 謝師宴／尾牙春酒／慶生一桌搞定 ‧
                專屬包廂與整桌套餐。整桌預算彈性選擇，專人協助菜色與飲品規劃。
              </p>
              <p className="text-xs leading-relaxed text-muted">
                本行銷文案由後台「餐廳形象與行銷」依各店客製，並同步顯示於 Google
                搜尋摘要（SEO）
              </p>
            </div>

            <div className="w-full rounded-card border border-gold-faint bg-panel-soft p-6">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex items-center gap-2.5 text-gold-light">
                  <ClockIcon size={18} />
                  <span className="whitespace-nowrap text-base font-medium">
                    營業資訊：
                  </span>
                </span>
                <p className="text-base font-medium text-cream">
                  11:30–21:30 每週二至週日 (公休日：週一)
                </p>
              </div>
              <div className="mt-2.5 flex items-center gap-2.5">
                <span className="flex items-center gap-2.5 text-gold-light">
                  <PhoneIcon size={18} />
                  <span className="whitespace-nowrap text-base font-medium">
                    聯繫電話：
                  </span>
                </span>
                <p className="text-base font-medium text-cream">02-1234-5678</p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-4">
              <PrimaryButton onClick={() => navigate('/reservation')}>
                立即預訂
              </PrimaryButton>
              <GhostButton onClick={() => navigate('/search')}>
                訂位查詢
              </GhostButton>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
