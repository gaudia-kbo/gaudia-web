/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'k.kakaocdn.net',      // 카카오 프로필 이미지
      'img1.kakaocdn.net',
      'lh3.googleusercontent.com', // 구글 프로필 이미지
    ],
  },
}

module.exports = nextConfig
