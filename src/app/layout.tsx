import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Layout } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import '@/styles/globals.css'
import 'nextra-theme-docs/style.css'

export const metadata: Metadata = {
  title: {
    default: 'PGStudy - PostgreSQL 학습 가이드',
    template: '%s | PGStudy',
  },
  description:
    'PostgreSQL을 체계적으로 학습할 수 있는 인터랙티브 가이드. 기초부터 고급 주제까지, 브라우저에서 직접 SQL을 실행하며 배워보세요.',
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}): Promise<ReactNode> {
  return (
    <html lang="ko" dir="ltr" suppressHydrationWarning>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body>
        <Layout
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/skeeeper75/pgstudy"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          footer="PGStudy - PostgreSQL 학습 가이드"
          editLink="이 페이지 수정하기"
          feedback={{ content: '피드백 보내기' }}
          toc={{ title: '목차' }}
          navigation
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
