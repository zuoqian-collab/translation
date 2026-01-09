import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { DataStore, Feature, CreateFeatureInput, UpdateFeatureInput, Field } from './types'

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'features.json')

// 确保数据目录存在
async function ensureDataDir(): Promise<void> {
  const dataDir = path.dirname(DATA_FILE_PATH)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// 读取数据
async function readData(): Promise<DataStore> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8')
    return JSON.parse(data)
  } catch {
    // 如果文件不存在，返回空数据
    return { features: [] }
  }
}

// 写入数据
async function writeData(data: DataStore): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

// 获取所有功能
export async function getAllFeatures(): Promise<Feature[]> {
  const data = await readData()
  // 按更新时间倒序排列
  return data.features.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

// 获取单个功能
export async function getFeatureById(id: string): Promise<Feature | null> {
  const data = await readData()
  return data.features.find(f => f.id === id) || null
}

// 创建功能
export async function createFeature(input: CreateFeatureInput): Promise<Feature> {
  const data = await readData()
  const now = new Date().toISOString()
  
  // 为每个字段生成ID
  const fieldsWithIds: Field[] = input.fields.map(field => ({
    ...field,
    id: uuidv4()
  }))
  
  const newFeature: Feature = {
    id: uuidv4(),
    name: input.name,
    version: input.version,
    date: input.date,
    fields: fieldsWithIds,
    createdAt: now,
    updatedAt: now,
  }
  
  data.features.push(newFeature)
  await writeData(data)
  
  return newFeature
}

// 更新功能
export async function updateFeature(id: string, input: UpdateFeatureInput): Promise<Feature | null> {
  const data = await readData()
  const index = data.features.findIndex(f => f.id === id)
  
  if (index === -1) {
    return null
  }
  
  const existingFeature = data.features[index]
  
  // 处理字段更新
  let updatedFields = existingFeature.fields
  if (input.fields) {
    updatedFields = input.fields.map(field => ({
      ...field,
      id: field.id || uuidv4()
    }))
  }
  
  const updatedFeature: Feature = {
    ...existingFeature,
    name: input.name ?? existingFeature.name,
    version: input.version ?? existingFeature.version,
    date: input.date ?? existingFeature.date,
    fields: updatedFields,
    updatedAt: new Date().toISOString(),
  }
  
  data.features[index] = updatedFeature
  await writeData(data)
  
  return updatedFeature
}

// 删除功能
export async function deleteFeature(id: string): Promise<boolean> {
  const data = await readData()
  const index = data.features.findIndex(f => f.id === id)
  
  if (index === -1) {
    return false
  }
  
  data.features.splice(index, 1)
  await writeData(data)
  
  return true
}

// 搜索功能
export async function searchFeatures(query: string): Promise<Feature[]> {
  const features = await getAllFeatures()
  const lowerQuery = query.toLowerCase()
  
  return features.filter(f => 
    f.name.toLowerCase().includes(lowerQuery) ||
    f.version.toLowerCase().includes(lowerQuery) ||
    f.fields.some(field => 
      field.name.toLowerCase().includes(lowerQuery) ||
      field.key.toLowerCase().includes(lowerQuery) ||
      Object.values(field.translations).some(t => 
        t?.toLowerCase().includes(lowerQuery)
      )
    )
  )
}
