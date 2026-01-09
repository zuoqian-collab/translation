'use client'

import { useState, useEffect, useRef } from 'react'
import { Field } from '@/lib/types'
import { LANGUAGES } from '@/lib/languages'

interface TranslationTableProps {
  fields: Field[]
}

export default function TranslationTable({ fields }: TranslationTableProps) {
  const [openExportMenu, setOpenExportMenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenExportMenu(null)
      }
    }
    if (openExportMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openExportMenu])

  const exportFieldAsAndroid = (field: Field) => {
    const lines = LANGUAGES.map(lang => {
      const value = field.translations[lang.code] || ''
      const escapedValue = value.replace(/'/g, "\\'").replace(/&/g, '&amp;')
      return `<string name="${field.key}">${escapedValue}</string>`
    })
    const content = lines.join('\n')
    downloadFile(`${field.key}_android.xml`, content)
    setOpenExportMenu(null)
  }

  const exportFieldAsIOS = (field: Field) => {
    const lines = LANGUAGES.map(lang => {
      const value = field.translations[lang.code] || ''
      const escapedValue = value.replace(/"/g, '\\"')
      return `"${field.key}" = "${escapedValue}"; // ${lang.code}`
    })
    const content = lines.join('\n')
    downloadFile(`${field.key}_ios.strings`, content)
    setOpenExportMenu(null)
  }

  const exportFieldAsJSON = (field: Field) => {
    const data = {
      key: field.key,
      translations: field.translations
    }
    const content = JSON.stringify(data, null, 2)
    downloadFile(`${field.key}.json`, content)
    setOpenExportMenu(null)
  }

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (fields.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6 text-center">
        <p className="text-text-secondary text-sm">暂无字段</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {fields.map((field) => (
        <div 
          key={field.id} 
          className="bg-surface border border-border rounded-lg overflow-hidden"
        >
          {/* 字段头部 */}
          <div className="px-3 py-2 bg-background/50 border-b border-border flex items-center justify-between">
            <code className="text-sm font-mono text-text-primary">{field.key}</code>
            
            {/* 导出按钮 */}
            <div className="relative" ref={openExportMenu === field.id ? menuRef : undefined}>
              <button
                onClick={() => setOpenExportMenu(openExportMenu === field.id ? null : field.id)}
                className="p-1 text-text-secondary hover:text-accent hover:bg-accent/10 rounded transition-colors"
                title="导出此字段"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              
              {openExportMenu === field.id && (
                <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-lg z-10 min-w-[140px]">
                  <button
                    onClick={() => exportFieldAsAndroid(field)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent/10 transition-colors flex items-center gap-2"
                  >
                    <span className="text-green-500">🤖</span> Android XML
                  </button>
                  <button
                    onClick={() => exportFieldAsIOS(field)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent/10 transition-colors flex items-center gap-2"
                  >
                    <span>🍎</span> iOS Strings
                  </button>
                  <button
                    onClick={() => exportFieldAsJSON(field)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent/10 transition-colors flex items-center gap-2"
                  >
                    <span className="text-yellow-500">📄</span> JSON
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* 翻译列表 - 竖向布局 */}
          <div className="divide-y divide-border">
            {LANGUAGES.map((lang) => {
              const translation = field.translations[lang.code]
              const hasTranslation = translation?.trim()
              
              return (
                <div key={lang.code} className="px-3 py-1.5 flex items-center gap-3">
                  <span className="text-base w-5">{lang.flag}</span>
                  <span className="text-xs text-text-secondary font-mono w-12">{lang.code}</span>
                  {hasTranslation ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <span className="text-text-primary text-sm">{translation}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(translation!)}
                        className="p-1 text-text-secondary hover:text-accent hover:bg-accent/10 rounded transition-colors"
                        title="复制"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <span className="text-text-secondary/40 italic text-xs">未翻译</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
