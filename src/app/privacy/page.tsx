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
    title: '제1조 (개인정보의 수집 항목 및 수집 방법)',
    content: '회사는 다음과 같은 개인정보를 수집합니다.',
    items: [
      '이메일, 닉네임, 프로필 사진 - 회원 식별 및 서비스 제공 목적 - 탈퇴 시까지 보유',
      '생년월일 - 연령 확인(만 19세 이상) 목적 - 확인 후 즉시 파기',
      '서비스 이용 기록(예측 참여 내역, 포인트 내역) - 서비스 제공 목적 - 탈퇴 후 30일 보유',
      '부정이용기록 - 부정 이용 방지 목적 - 탈퇴 후 1년 보유',
      '수집 방법: 카카오 로그인, 구글 로그인을 통해 수집합니다.',
    ],
  },
  {
    title: '제2조 (개인정보의 수집 및 이용 목적)',
    content: '회사는 다음의 목적으로 개인정보를 처리합니다.',
    items: [
      '회원 가입 및 관리',
      '서비스 제공 (예측 참여, 포인트 적립/차감, 랭킹 산정)',
      '연령 확인 (만 19세 이상 이용 제한)',
      '서비스 개선 및 통계 분석',
      '법령의 규정에 의거하거나 법원의 명령이 있을 경우',
    ],
  },
  {
    title: '제3조 (개인정보의 제3자 제공)',
    content: '회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.',
    items: [
      '이용자가 사전에 동의한 경우',
      '법령의 규정에 의거하거나 법원의 명령이 있는 경우',
    ],
  },
  {
    title: '제4조 (개인정보 처리의 위탁)',
    content: '회사는 서비스 운영을 위해 다음과 같이 개인정보 처리를 위탁합니다.',
    items: [
      'Supabase Inc. (미국) - 데이터베이스 운영 및 인증 - 탈퇴 시까지',
      'Vercel Inc. (미국) - 서버 운영 및 배포 - 탈퇴 시까지',
      'Google LLC (미국) - 소셜 로그인 - 탈퇴 시까지',
      'Kakao Corp. (한국) - 소셜 로그인 - 탈퇴 시까지',
    ],
  },
  {
    title: '제5조 (이용자의 권리 및 행사 방법)',
    content: '',
    items: [
      '이용자는 언제든지 자신의 개인정보에 대한 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다.',
      '요청은 gaudia.kbo@gmail.com으로 접수하며, 접수 후 10일 이내에 처리하고 결과를 통지합니다. 정당한 사유가 있는 경우 10일의 범위에서 연장할 수 있습니다.',
    ],
  },
  {
    title: '제6조 (개인정보의 국외 이전)',
    content: '회사는 서비스 운영을 위해 아래와 같이 개인정보를 국외로 이전합니다.',
    items: [
      'Supabase Inc. / 미국 / 이메일, 닉네임, 이용 기록 / DB 운영 / 탈퇴 시까지',
      'Vercel Inc. / 미국 / 서버 로그 / 서비스 운영 / 탈퇴 시까지',
      '이용자는 국외 이전에 동의하지 않을 수 있으며, 동의하지 않는 경우 서비스 이용이 제한될 수 있습니다.',
    ],
  },
  {
    title: '제7조 (개인정보의 파기)',
    content: '',
    items: [
      '회사는 개인정보 보유 기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 파기합니다.',
      '전자적 파일: 복구 불가능한 방법으로 영구 삭제',
      '종이 문서: 분쇄 또는 소각',
    ],
  },
  {
    title: '제8조 (개인정보 자동 수집 장치의 설치 및 운영)',
    content: '서비스는 세션 관리 목적으로 쿠키를 사용합니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 서비스 이용에 제한이 생길 수 있습니다.',
    items: [],
  },
  {
    title: '제9조 (개인정보 보호책임자)',
    content: '개인정보 관련 문의, 불만, 피해 구제 등은 아래 연락처로 접수하시기 바랍니다.',
    items: [
      '성명: 이원재',
      '직책: 대표',
      '이메일: gaudia.kbo@gmail.com',
    ],
  },
  {
    title: '제10조 (권익침해 구제 방법)',
    content: '개인정보 침해에 대한 신고나 상담이 필요한 경우 아래 기관에 문의하실 수 있습니다.',
    items: [
      '개인정보 침해신고센터: privacy.kisa.or.kr (국번 없이 118)',
      '대검찰청 사이버범죄수사단: www.spo.go.kr (02-3480-3573)',
      '경찰청 사이버안전국: cyberbureau.police.go.kr (국번 없이 182)',
    ],
  },
]

export default async function PrivacyPage() {
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
          <h1 className="text-xl font-black text-gaudia-text">개인정보처리방침</h1>
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