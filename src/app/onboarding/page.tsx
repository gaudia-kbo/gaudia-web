'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function OnboardingPage() {
  const router = useRouter()
  const [birthYear, setBirthYear] = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const year = parseInt(birthYear)
    const month = parseInt(birthMonth)
    const day = parseInt(birthDay)
    if (!year || !month || !day) {
      setError('생년월일을 모두 입력해주세요.')
      return
    }
    const today = new Date()
    const birth = new Date(year, month - 1, day)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    if (age < 19) {
      router.push('/blocked')
      return
    }
    setLoading(true)
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birthYear: year }),
    })
    if (res.ok) {
      router.push('/')
    } else {
      setError('오류가 발생했습니다.')
      setLoading(false)
    }
  }
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#faf9f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a', marginBottom: '8px' }}>GAUDIA</h1>
          <p style={{ fontSize: '14px', color: '#666' }}>서비스 이용을 위해 생년월일을 입력해주세요</p>
          <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>본 서비스는 만 19세 이상만 이용 가능합니다</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e8e4dc', padding: '24px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>생년월일</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="number" placeholder="년도" value={birthYear} onChange={e => setBirthYear(e.target.value)} style={{ flex: 2, padding: '10px', borderRadius: '8px', border: '1px solid #e8e4dc', fontSize: '14px' }} />
                <input type="number" placeholder="월" value={birthMonth} onChange={e => setBirthMonth(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e8e4dc', fontSize: '14px' }} />
                <input type="number" placeholder="일" value={birthDay} onChange={e => setBirthDay(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e8e4dc', fontSize: '14px' }} />
              </div>
            </div>
            {error && <p style={{ fontSize: '12px', color: '#ef4444', marginBottom: '16px' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#c9a84c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700' }}>
              {loading ? '확인 중...' : '확인'}
            </button>
          </form>
          <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '16px' }}>생년월일은 연령 확인 후 즉시 파기됩니다.</p>
        </div>
      </div>
    </div>
  )
}