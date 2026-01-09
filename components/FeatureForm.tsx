'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Feature, Field, Translations } from '@/lib/types'
import { LANGUAGES } from '@/lib/languages'
import { v4 as uuidv4 } from 'uuid'

interface FeatureFormProps {
  feature?: Feature
  mode: 'create' | 'edit'
}

interface FieldFormData {
  id: string
  key: string
  name: string
  translations: Translations
  isExpanded: boolean
}

export default function FeatureForm({ feature, mode }: FeatureFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [name, setName] = useState(feature?.name || '')
  const [version, setVersion] = useState(feature?.version || '')
  const [date, setDate] = useState(feature?.date || new Date().toISOString().split('T')[0])
  const [fields, setFields] = useState<FieldFormData[]>(
    feature?.fields.map(f => ({ ...f, isExpanded: false })) || []
  )

  const addField = () => {
    setFields([...fields, {
      id: uuidv4(),
      key: '',
      name: '',
      translations: {},
      isExpanded: true
    }])
  }

  const removeField = (fieldId: string) => {
    setFields(fields.filter(f => f.id !== fieldId))
  }

  const toggleFieldExpand = (fieldId: string) => {
    setFields(fields.map(f => 
      f.id === fieldId ? { ...f, isExpanded: !f.isExpanded } : f
    ))
  }

  const updateField = (fieldId: string, updates: Partial<FieldFormData>) => {
    setFields(fields.map(f => 
      f.id === fieldId ? { ...f, ...updates } : f
    ))
  }

  const updateFieldTranslation = (fieldId: string, langCode: string, value: string) => {
    setFields(fields.map(f => 
      f.id === fieldId 
        ? { ...f, translations: { ...f.translations, [langCode]: value } }
        : f
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!name.trim()) {
      setError('功能名称不能为空')
      setIsSubmitting(false)
      return
    }

    if (fields.length === 0) {
      setError('至少需要添加一个字段')
      setIsSubmitting(false)
      return
    }

    for (const field of fields) {
      if (!field.key.trim()) {
        setError('所有字段的标识符都不能为空')
        setIsSubmitting(false)
        return
      }
    }

    try {
      const url = mode === 'create' ? '/api/features' : `/api/features/${feature?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      // 使用 key 作为 name（如果 name 为空）
      const submitFields: Field[] = fields.map(({ isExpanded, ...rest }) => ({
        ...rest,
        name: rest.name || rest.key
      }))
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, version, date, fields: submitFields })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '操作失败')
      }

      const data = await response.json()
      router.push(`/feature/${data.feature.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 错误提示 */}
      {error && (
        <div className="bg-accent-red/10 border border-accent-red/30 rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-accent-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-accent-red">{error}</span>
        </div>
      )}

      {/* 基本信息 */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          基本信息
        </h2>
        
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-text-secondary mb-1">
              功能名称 <span className="text-accent-red">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="登录页"
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary placeholder-text-secondary/50 text-sm focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-xs text-text-secondary mb-1">
              版本号 <span className="text-accent-red">*</span>
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary placeholder-text-secondary/50 font-mono text-sm focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-xs text-text-secondary mb-1">
              日期 <span className="text-accent-red">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-sm focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* 字段列表 */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            字段列表
            <span className="font-normal text-text-secondary">({fields.length})</span>
          </h2>
          <button
            type="button"
            onClick={addField}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent-green/10 text-accent-green border border-accent-green/30 hover:bg-accent-green/20 transition-all text-xs font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加字段
          </button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-lg">
            <p className="text-text-secondary text-sm mb-2">还没有字段</p>
            <button type="button" onClick={addField} className="text-accent text-sm hover:underline">
              添加第一个字段
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-border rounded-lg overflow-hidden">
                {/* 字段头部 */}
                <div 
                  className="px-3 py-2 bg-background/50 flex items-center justify-between cursor-pointer hover:bg-background/70 transition-colors"
                  onClick={() => toggleFieldExpand(field.id)}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-text-secondary font-mono text-xs">#{index + 1}</span>
                    <code className="font-mono text-text-primary bg-background px-1.5 py-0.5 rounded text-xs">
                      {field.key || 'field_key'}
                    </code>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeField(field.id) }}
                      className="p-1 text-text-secondary hover:text-accent-red hover:bg-accent-red/10 rounded transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <svg className={`w-4 h-4 text-text-secondary transition-transform ${field.isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* 字段内容 */}
                {field.isExpanded && (
                  <div className="px-3 py-3 space-y-3 border-t border-border">
                    <div>
                      <label className="block text-xs text-text-secondary mb-1">字段标识符 *</label>
                      <input
                        type="text"
                        value={field.key}
                        onChange={(e) => updateField(field.id, { key: e.target.value })}
                        placeholder="login_button"
                        className="w-full px-2.5 py-1.5 bg-background border border-border rounded text-text-primary placeholder-text-secondary/50 font-mono text-sm focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-text-secondary mb-1.5">翻译内容</label>
                      <div className="space-y-1.5">
                        {LANGUAGES.map((lang) => (
                          <div key={lang.code} className="flex items-center gap-2">
                            <span className="text-sm w-5">{lang.flag}</span>
                            <span className="text-xs text-text-secondary font-mono w-12">{lang.code}</span>
                            <input
                              type="text"
                              value={field.translations[lang.code] || ''}
                              onChange={(e) => updateFieldTranslation(field.id, lang.code, e.target.value)}
                              placeholder={lang.nativeName}
                              className="flex-1 px-2 py-1 bg-background border border-border rounded text-text-primary placeholder-text-secondary/50 text-sm focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* 底部快速添加 */}
            <div className="mt-3 pt-3 border-t border-border/50">
              <button
                type="button"
                onClick={addField}
                className="w-full py-2 border-2 border-dashed border-border hover:border-accent/50 rounded-lg text-text-secondary hover:text-accent transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                添加更多字段
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary text-sm transition-all"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-all flex items-center gap-1.5"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              保存中...
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {mode === 'create' ? '创建' : '保存'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
