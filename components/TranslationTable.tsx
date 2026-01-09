'use client'

import { Field } from '@/lib/types'
import { LANGUAGES } from '@/lib/languages'

interface TranslationTableProps {
  fields: Field[]
}

export default function TranslationTable({ fields }: TranslationTableProps) {
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
          <div className="px-3 py-2 bg-background/50 border-b border-border">
            <code className="text-sm font-mono text-text-primary">{field.key}</code>
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
