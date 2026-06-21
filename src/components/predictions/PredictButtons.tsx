'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PredictButtons({
  topicId,
  userId,
}: {
  topicId: string
  userId?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<'yes' | 'no' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handlePredict(choice: 'yes' | 'no') {
    if (!userId) {
      router.push('/login')
      return
    }

    setLoading(choice)
    setError(null)

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, choice }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '예측 처리 중 오류가 발생했습니다.')
        setLoading(null)
        return
      }

      // 성공 시 새로고침해서 최신 포인트/예측 상태 반영
      router.refresh()
    } catch (err) {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(null)
    }
  }

  if (!userId) {
    return (
      <a
        href="/login"
        className="block w-full py-3 text-xs font-bold
                   text-gold-DEFAULT bg-gold-bg
                   text-center border-t border-cream-2
                   hover:bg-gold-light transition-colors"
      >
        로그인 후 예측에 참여하세요
      </a>
    )
  }

  return (
    <div>
      <div className="flex border-t border-cream-2">
        <button
          onClick={() => handlePredict('yes')}
          disabled={loading !== null}
          className="flex-1 py-3 text-xs font-bold text-gaudia-green
                     bg-green-50 hover:bg-green-100
                     text-center transition-colors border-r border-cream-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'yes' ? '처리 중...' : '✔ O 예측'}
        </button>
        <button
          onClick={() => handlePredict('no')}
          disabled={loading !== null}
          className="flex-1 py-3 text-xs font-bold text-gaudia-red
                     bg-red-50 hover:bg-red-100
                     text-center transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'no' ? '처리 중...' : '✘ X 예측'}
        </button>
      </div>
      {error && (
        <p className="text-xs text-gaudia-red text-center py-2 px-3">
          {error}
        </p>
      )}
    </div>
  )
}