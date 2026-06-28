import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import { createClient } from '@/lib/supabase/server'
import type { User } from '@/types/database'

type Section = {
  title: string
  content: string
  items: string[]
}

const sections: Section[] = [
  {
    title: '제1조 (목적)',
    content: '본 약관은 가우디아(이하 회사)가 제공하는 GAUDIA 서비스(이하 서비스)의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.',
    items: [],
  },
  {
    title: '제2조 (용어의 정의)',
    content: '',
    items: [
      '서비스란 회사가 제공하는 KBO 프로야구 팬 대상 집단지성 예측 플랫폼을 의미합니다.',
      '이용자란 본 약관에 동의하고 서비스를 이용하는 자를 말합니다.',
      '포인트란 서비스 내에서만 사용 가능한 비환금성 가상 점수로, 현금, 상품권, 가상자산 등 어떠한 재산적 가치로도 전환이 불가하며, 이용자 간 양도, 거래, 판매가 전면 금지됩니다.',
    ],
  },
  {
    title: '제3조 (약관의 효력 및 변경)',
    content: '',
    items: [
      '본 약관은 서비스 화면에 게시하거나 이용자에게 공지함으로써 효력이 발생합니다.',
      '회사는 필요한 경우 약관을 변경할 수 있으며, 변경 시 적용일 7일 전에 공지합니다.',
      '이용자에게 불리한 변경의 경우 30일 전에 고지하며, 거부 의사를 표시하지 않은 경우 동의한 것으로 간주합니다.',
      '이용자가 개정 약관에 동의하지 않을 경우 서비스 이용 계약을 해지할 수 있습니다.',
    ],
  },
  {
    title: '제4조 (이용계약의 체결)',
    content: '',
    items: [
      '이용계약은 이용자가 본 약관에 동의하고 회원가입을 완료함으로써 성립합니다.',
      '만 19세 미만인 자, 허위 정보를 제공한 자, 기타 회사가 정한 이용 조건을 충족하지 못한 자는 이용계약 체결이 거부될 수 있습니다.',
    ],
  },
  {
    title: '제5조 (회원가입 및 자격)',
    content: '',
    items: [
      '회원가입은 카카오 또는 구글 소셜 로그인을 통해 진행됩니다.',
      '서비스는 만 19세 이상만 이용 가능합니다. 가입 시 생년월일 입력 및 본인 확인 동의 절차를 통해 연령을 확인합니다.',
      '가입 완료 후 미성년자임이 확인될 경우 즉시 계정이 삭제되고 보유 포인트는 소멸 처리됩니다.',
      '가입 시 1,000포인트가 즉시 지급됩니다.',
    ],
  },
  {
    title: '제6조 (포인트 운영 정책)',
    content: '',
    items: [
      '포인트는 서비스 내 예측 참여 등의 활동을 통해 적립 및 사용됩니다.',
      '포인트는 현금, 상품권, 가상자산 등 어떠한 재산적 가치로도 전환할 수 없습니다.',
      '이용자 간 포인트의 양도, 거래, 판매는 전면 금지됩니다.',
      '예측 참여 시 포인트 조정분이 발생할 수 있으며, 해당 조정분은 회사의 재산적 이익으로 귀속되지 않습니다.',
      '포인트는 이월 가능하며, 유효기간은 별도로 정하지 않습니다.',
    ],
  },
  {
    title: '제7조 (서비스의 제공 및 중단)',
    content: '',
    items: [
      '회사는 연중무휴 서비스를 제공하며, 시스템 점검 시 사전 공지합니다.',
      '서비스를 종료하는 경우 종료일 30일 전에 이용자에게 고지합니다.',
      '서비스 종료 시 보유 포인트는 소멸되며, 금전적 보상의 대상이 되지 않습니다.',
    ],
  },
  {
    title: '제8조 (이용자의 의무)',
    content: '이용자는 관계 법령 및 본 약관을 준수하여야 하며, 다음 행위를 하여서는 안 됩니다.',
    items: [
      '포인트의 부정 취득 또는 타인에게 양도, 판매하는 행위',
      '타인의 계정을 무단으로 사용하는 행위',
      '서비스의 정상적인 운영을 방해하는 행위',
      '허위 정보를 등록하는 행위',
    ],
  },
  {
    title: '제9조 (개인정보 보호)',
    content: '회사는 관련 법령에 따라 이용자의 개인정보를 보호하며, 개인정보처리방침에 따라 처리합니다.',
    items: [],
  },
  {
    title: '제10조 (서비스의 국외 처리)',
    content: '서비스 운영을 위해 이용자의 개인정보가 미국 소재 서버(Supabase Inc., Vercel Inc.)에 저장, 처리될 수 있으며, 자세한 내용은 개인정보처리방침 제6조를 참조하시기 바랍니다.',
    items: [],
  },
  {
    title: '제11조 (책임의 한계)',
    content: '',
    items: [
      '회사는 이용자가 서비스를 통해 얻은 정보의 신뢰성, 정확성에 대해 보증하지 않습니다. 다만, 회사의 고의 또는 중대한 과실로 인한 오류에 대해서는 그러하지 아니합니다.',
      '회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중단 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.',
    ],
  },
  {
    title: '제12조 (분쟁해결)',
    content: '',
    items: [
      '본 약관과 관련된 분쟁은 한국소비자원 등 소비자 분쟁 해결 기관을 통한 해결 절차를 우선적으로 이용할 수 있습니다.',
      '소비자 분쟁 해결 절차로 해결되지 않는 경우, 회사 본사 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.',
      '본 약관에 관한 준거법은 대한민국 법률로 합니다.',
    ],
  },
]

export default async function TermsPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  let user: User | null = null
  if (authUser) {
    const { data } = await supabase.from('users').select('*').eq('id', authUser.id).single()
    user = data
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar user={user} />
      <main className="max-w-2xl mx-auto px-4 pb-24 pt-6">
        <div className="mb-6">
          <h1 className="text-xl font-black text-gaudia-text">서비스 이용약관</h1>
          <p className="text-xs text-gaudia-text3 mt-1">시행일: 2026년 7월 31일</p>
        </div>
        <div className="bg-white rounded-2xl border border-cream-3 shadow-sm p-4 mb-6">
          <p className="text-xs font-bold text-gaudia-text mb-3">목차</p>
          <div className="space-y-1">
            {sections.map((s, i) => (
              <a key={i} href={`#section-${i}`} className="block text-xs text-gaudia-text3 hover:text-gaudia-text py-0.5">
                {s.title}
              </a>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {sections.map((s, i) => (
            <div key={i} id={`section-${i}`} className="bg-white rounded-2xl border border-cream-3 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gaudia-text mb-3">{s.title}</h2>
              {s.content !== '' && (
                <p className="text-xs text-gaudia-text2 leading-relaxed mb-2">{s.content}</p>
              )}
              {s.items.length > 0 && (
                <ol className="space-y-2">
                  {s.items.map((item, j) => (
                    <li key={j} className="text-xs text-gaudia-text2 leading-relaxed flex gap-2">
                      <span className="text-gaudia-text3 shrink-0">{j + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 text-center space-y-1">
          <p className="text-xs text-gaudia-text3">시행일: 2026년 7월 31일</p>
          <p className="text-xs text-gaudia-text3">사업자등록번호: 387-09-03509</p>
          <p className="text-xs text-gaudia-text3">대표: 이원재 | gaudia.kbo@gmail.com</p>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}