/**
 * 导入脚本：将 features.json 数据导入到 Supabase
 * 
 * 使用方法：
 * 1. 确保已配置 .env.local 中的 Supabase 环境变量
 * 2. 运行: npx ts-node scripts/import-to-supabase.ts
 * 或者: npx tsx scripts/import-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// 从环境变量或直接填写
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '在这里填写你的 Supabase URL'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '在这里填写你的 Supabase Anon Key'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

interface Field {
  id: string
  key: string
  name: string
  translations: Record<string, string>
}

interface Feature {
  id: string
  name: string
  version: string
  date: string
  fields: Field[]
  createdAt: string
  updatedAt: string
}

interface DataStore {
  features: Feature[]
}

async function importData() {
  console.log('🚀 开始导入数据到 Supabase...\n')

  // 读取 JSON 文件
  const jsonPath = path.join(__dirname, '..', 'data', 'features.json')
  const jsonData = fs.readFileSync(jsonPath, 'utf-8')
  const data: DataStore = JSON.parse(jsonData)

  console.log(`📄 找到 ${data.features.length} 个功能\n`)

  for (const feature of data.features) {
    console.log(`📦 导入功能: ${feature.name} (v${feature.version})`)

    // 检查功能是否已存在
    const { data: existing } = await supabase
      .from('features')
      .select('id')
      .eq('name', feature.name)
      .eq('version', feature.version)
      .single()

    if (existing) {
      console.log(`   ⏭️  功能已存在，跳过\n`)
      continue
    }

    // 插入功能
    const { data: insertedFeature, error: featureError } = await supabase
      .from('features')
      .insert({
        name: feature.name,
        version: feature.version,
        date: feature.date,
        created_at: feature.createdAt,
        updated_at: feature.updatedAt
      })
      .select()
      .single()

    if (featureError) {
      console.error(`   ❌ 插入功能失败:`, featureError.message)
      continue
    }

    console.log(`   ✅ 功能已创建，ID: ${insertedFeature.id}`)

    // 插入字段
    if (feature.fields.length > 0) {
      const fieldsToInsert = feature.fields.map(field => ({
        feature_id: insertedFeature.id,
        key: field.key,
        name: field.name || field.key,
        translations: field.translations
      }))

      const { error: fieldsError } = await supabase
        .from('fields')
        .insert(fieldsToInsert)

      if (fieldsError) {
        console.error(`   ❌ 插入字段失败:`, fieldsError.message)
      } else {
        console.log(`   ✅ 已导入 ${feature.fields.length} 个字段\n`)
      }
    }
  }

  console.log('🎉 导入完成!')
}

// 运行导入
importData().catch(console.error)

