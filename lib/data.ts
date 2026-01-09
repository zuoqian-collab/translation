import { supabase } from './supabase'
import { Feature, Field, CreateFeatureInput, UpdateFeatureInput } from './types'

// 数据库行类型
interface FeatureRow {
  id: string
  name: string
  version: string
  date: string
  created_at: string
  updated_at: string
}

interface FieldRow {
  id: string
  feature_id: string
  key: string
  name: string
  translations: Record<string, string>
  created_at: string
}

// 将数据库行转换为 Feature 对象
function rowsToFeature(featureRow: FeatureRow, fieldRows: FieldRow[]): Feature {
  return {
    id: featureRow.id,
    name: featureRow.name,
    version: featureRow.version,
    date: featureRow.date,
    fields: fieldRows.map(f => ({
      id: f.id,
      key: f.key,
      name: f.name,
      translations: f.translations
    })),
    createdAt: featureRow.created_at,
    updatedAt: featureRow.updated_at
  }
}

// 获取所有功能
export async function getAllFeatures(): Promise<Feature[]> {
  const { data: features, error: featuresError } = await supabase
    .from('features')
    .select('*')
    .order('updated_at', { ascending: false })

  if (featuresError) {
    console.error('Error fetching features:', featuresError)
    return []
  }

  if (!features || features.length === 0) {
    return []
  }

  const { data: fields, error: fieldsError } = await supabase
    .from('fields')
    .select('*')
    .in('feature_id', features.map(f => f.id))

  if (fieldsError) {
    console.error('Error fetching fields:', fieldsError)
    return []
  }

  return features.map(feature => 
    rowsToFeature(feature, (fields || []).filter(f => f.feature_id === feature.id))
  )
}

// 获取单个功能
export async function getFeatureById(id: string): Promise<Feature | null> {
  const { data: feature, error: featureError } = await supabase
    .from('features')
    .select('*')
    .eq('id', id)
    .single()

  if (featureError || !feature) {
    return null
  }

  const { data: fields, error: fieldsError } = await supabase
    .from('fields')
    .select('*')
    .eq('feature_id', id)

  if (fieldsError) {
    console.error('Error fetching fields:', fieldsError)
    return null
  }

  return rowsToFeature(feature, fields || [])
}

// 创建功能
export async function createFeature(input: CreateFeatureInput): Promise<Feature> {
  // 插入功能
  const { data: feature, error: featureError } = await supabase
    .from('features')
    .insert({
      name: input.name,
      version: input.version,
      date: input.date
    })
    .select()
    .single()

  if (featureError || !feature) {
    throw new Error('Failed to create feature')
  }

  // 插入字段
  if (input.fields.length > 0) {
    const fieldsToInsert = input.fields.map(field => ({
      feature_id: feature.id,
      key: field.key,
      name: field.name || field.key,
      translations: field.translations
    }))

    const { error: fieldsError } = await supabase
      .from('fields')
      .insert(fieldsToInsert)

    if (fieldsError) {
      throw new Error('Failed to create fields')
    }
  }

  const result = await getFeatureById(feature.id)
  if (!result) {
    throw new Error('Failed to fetch created feature')
  }
  return result
}

// 更新功能
export async function updateFeature(id: string, input: UpdateFeatureInput): Promise<Feature | null> {
  // 更新功能基本信息
  const updateData: Record<string, unknown> = {}
  if (input.name !== undefined) updateData.name = input.name
  if (input.version !== undefined) updateData.version = input.version
  if (input.date !== undefined) updateData.date = input.date

  if (Object.keys(updateData).length > 0) {
    const { error: featureError } = await supabase
      .from('features')
      .update(updateData)
      .eq('id', id)

    if (featureError) {
      console.error('Error updating feature:', featureError)
      return null
    }
  }

  // 更新字段
  if (input.fields !== undefined) {
    // 删除旧字段
    await supabase.from('fields').delete().eq('feature_id', id)

    // 插入新字段
    if (input.fields.length > 0) {
      const fieldsToInsert = input.fields.map(field => ({
        feature_id: id,
        key: field.key,
        name: field.name || field.key,
        translations: field.translations
      }))

      const { error: fieldsError } = await supabase
        .from('fields')
        .insert(fieldsToInsert)

      if (fieldsError) {
        console.error('Error inserting fields:', fieldsError)
        return null
      }
    }
  }

  return getFeatureById(id)
}

// 删除功能
export async function deleteFeature(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('features')
    .delete()
    .eq('id', id)

  return !error
}

// 搜索功能
export async function searchFeatures(query: string): Promise<Feature[]> {
  const allFeatures = await getAllFeatures()
  const lowerQuery = query.toLowerCase()

  return allFeatures.filter(f =>
    f.name.toLowerCase().includes(lowerQuery) ||
    f.version.toLowerCase().includes(lowerQuery) ||
    f.fields.some(field =>
      field.key.toLowerCase().includes(lowerQuery) ||
      Object.values(field.translations).some(t =>
        t?.toLowerCase().includes(lowerQuery)
      )
    )
  )
}
