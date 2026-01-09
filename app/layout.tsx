import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Translation Manager',
  description: '多语言翻译管理工具',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="animated-bg min-h-screen">
        <nav className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-12">
              <a href="/" className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-accent to-accent-green flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                  Translation Manager
                </span>
              </a>
              <a
                href="/feature/new"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent-green/10 text-accent-green border border-accent-green/30 hover:bg-accent-green/20 transition-all text-xs font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                新建功能
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-4">
          {children}
        </main>
      </body>
    </html>
  )
}
