import { LanguageCode, Field } from './types'

export interface Language {
  code: LanguageCode
  name: string
  nativeName: string
  flag: string
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', flag: '🇹🇼' },
]

export const LANGUAGE_MAP: Record<LanguageCode, Language> = LANGUAGES.reduce(
  (acc, lang) => {
    acc[lang.code] = lang
    return acc
  },
  {} as Record<LanguageCode, Language>
)

// 计算单个字段的翻译完成度
export function getFieldTranslationProgress(translations: Record<string, string | undefined>): number {
  const total = LANGUAGES.length
  const filled = LANGUAGES.filter(lang => translations[lang.code]?.trim()).length
  return Math.round((filled / total) * 100)
}

// 计算功能的整体翻译完成度（所有字段的平均值）
export function getFeatureTranslationProgress(fields: Field[]): number {
  if (fields.length === 0) return 0
  
  const totalPossible = fields.length * LANGUAGES.length
  const totalFilled = fields.reduce((sum, field) => {
    return sum + LANGUAGES.filter(lang => field.translations[lang.code]?.trim()).length
  }, 0)
  
  return Math.round((totalFilled / totalPossible) * 100)
}

// 获取功能的翻译统计
export function getFeatureTranslationStats(fields: Field[]): { filled: number; total: number } {
  const total = fields.length * LANGUAGES.length
  const filled = fields.reduce((sum, field) => {
    return sum + LANGUAGES.filter(lang => field.translations[lang.code]?.trim()).length
  }, 0)
  return { filled, total }
}
