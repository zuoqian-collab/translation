'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Feature } from '@/lib/types'
import TranslationTable from '@/components/TranslationTable'
import { LANGUAGES } from '@/lib/languages'

interface PageProps {
  params: { id: string }
}

export default function FeatureDetailPage({ params }: PageProps) {
  const { id } = params
  const router = useRouter()
  const [feature, setFeature] = useState<Feature | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)

  useEffect(() => {
    async function fetchFeature() {
      try {
        const response = await fetch(`/api/features/${id}`)
        if (response.ok) {
          const data = await response.json()
          setFeature(data.feature)
        }
      } catch (error) {
        console.error('Error fetching feature:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeature()
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/features/${id}`, { method: 'DELETE' })
      if (response.ok) {
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting feature:', error)
    } finally {
      setDeleting(false)
    }
  }

  // 导出为 JSON（按字段key组织）
  const exportAsJSON = () => {
    if (!feature) return
    
    const data: Record<string, Record<string, string>> = {}
    feature.fields.forEach(field => {
      data[field.key] = {}
      LANGUAGES.forEach(lang => {
        if (field.translations[lang.code]) {
          data[field.key][lang.code] = field.translations[lang.code]!
        }
      })
    })
    
    downloadFile(
      JSON.stringify(data, null, 2),
      `${feature.name}_translations.json`,
      'application/json'
    )
    setShowExportMenu(false)
  }

  // 导出为按语言分组的 JSON
  const exportByLanguage = () => {
    if (!feature) return
    
    const data: Record<string, Record<string, string>> = {}
    LANGUAGES.forEach(lang => {
      data[lang.code] = {}
      feature.fields.forEach(field => {
        if (field.translations[lang.code]) {
          data[lang.code][field.key] = field.translations[lang.code]!
        }
      })
    })
    
    downloadFile(
      JSON.stringify(data, null, 2),
      `${feature.name}_by_language.json`,
      'application/json'
    )
    setShowExportMenu(false)
  }

  // 导出为 CSV
  const exportAsCSV = () => {
    if (!feature) return
    
    const headers = ['key', 'name', ...LANGUAGES.map(l => l.code)]
    const rows = feature.fields.map(field => [
      field.key,
      field.name,
      ...LANGUAGES.map(lang => field.translations[lang.code] || '')
    ])
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n')
    
    downloadFile(csv, `${feature.name}_translations.csv`, 'text/csv')
    setShowExportMenu(false)
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-surface rounded w-1/4"></div>
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="h-5 bg-background rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-background rounded w-1/4"></div>
        </div>
      </div>
    )
  }

  if (!feature) {
    return (
      <div className="text-center py-12">
        <h3 className="text-base font-semibold text-text-primary mb-2">功能不存在</h3>
        <p className="text-text-secondary text-sm mb-4">该功能可能已被删除</p>
        <a href="/" className="text-accent text-sm hover:underline">返回首页</a>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 返回按钮 */}
      <a
        href="/"
        className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回列表
      </a>

      {/* 功能信息卡片 */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary">{feature.name}</h1>
            <div className="flex items-center gap-3 mt-1.5 text-sm">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-accent/10 text-accent border border-accent/20">
                v{feature.version}
              </span>
              <span className="text-text-secondary flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {feature.date}
              </span>
              <span className="text-text-secondary">
                {feature.fields.length} 个字段
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* 导出按钮 */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/30 hover:bg-accent-yellow/20 transition-all text-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                导出
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                  <div className="absolute right-0 mt-1 w-48 bg-surface border border-border rounded-lg shadow-lg z-20 py-1">
                    <button
                      onClick={exportAsJSON}
                      className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-background/50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      JSON（按字段）
                    </button>
                    <button
                      onClick={exportByLanguage}
                      className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-background/50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      JSON（按语言）
                    </button>
                    <button
                      onClick={exportAsCSV}
                      className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-background/50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      CSV 表格
                    </button>
                  </div>
                </>
              )}
            </div>
            
            <a
              href={`/feature/${feature.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 transition-all text-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              编辑
            </a>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-red/10 text-accent-red border border-accent-red/30 hover:bg-accent-red/20 transition-all text-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              删除
            </button>
          </div>
        </div>
      </div>

      {/* 翻译表格 */}
      <TranslationTable fields={feature.fields} />

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface border border-border rounded-lg p-5 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-accent-red/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">确认删除</h3>
                <p className="text-text-secondary text-xs">此操作无法撤销</p>
              </div>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              确定要删除 <strong className="text-text-primary">&quot;{feature.name}&quot;</strong> 吗？
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary text-sm transition-all"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 rounded-lg bg-accent-red text-white text-sm hover:bg-accent-red/90 disabled:opacity-50 transition-all"
              >
                {deleting ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
