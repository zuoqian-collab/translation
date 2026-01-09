// 支持的语言代码
export type LanguageCode = 
  | 'en'
  | 'zh-CN'
  | 'zh-TW'

// 翻译内容映射
export type Translations = {
  [key in LanguageCode]?: string
}

// 字段定义 - 一个功能包含多个字段
export interface Field {
  id: string
  key: string        // 字段标识符，如 "login_button"
  name: string       // 字段名称，如 "登录按钮"
  translations: Translations
}

// 功能定义
export interface Feature {
  id: string
  name: string       // 功能名称，如 "登录页"
  version: string
  date: string
  fields: Field[]    // 该功能下的所有字段
  createdAt: string
  updatedAt: string
}

// 数据存储结构
export interface DataStore {
  features: Feature[]
}

// 创建字段的输入
export interface CreateFieldInput {
  key: string
  name: string
  translations: Translations
}

// 创建功能的输入
export interface CreateFeatureInput {
  name: string
  version: string
  date: string
  fields: CreateFieldInput[]
}

// 更新功能的输入
export interface UpdateFeatureInput {
  name?: string
  version?: string
  date?: string
  fields?: Field[]
}
