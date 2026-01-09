import { NextRequest, NextResponse } from 'next/server'
import { getAllFeatures, createFeature, searchFeatures } from '@/lib/data'
import { CreateFeatureInput } from '@/lib/types'

// GET /api/features - 获取所有功能或搜索
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    
    let features
    if (query) {
      features = await searchFeatures(query)
    } else {
      features = await getAllFeatures()
    }
    
    return NextResponse.json({ features })
  } catch (error) {
    console.error('Error fetching features:', error)
    return NextResponse.json(
      { error: 'Failed to fetch features' },
      { status: 500 }
    )
  }
}

// POST /api/features - 创建新功能
export async function POST(request: NextRequest) {
  try {
    const body: CreateFeatureInput = await request.json()
    
    // 基本验证
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: '功能名称不能为空' },
        { status: 400 }
      )
    }
    
    if (!body.version?.trim()) {
      return NextResponse.json(
        { error: '版本号不能为空' },
        { status: 400 }
      )
    }
    
    if (!body.date?.trim()) {
      return NextResponse.json(
        { error: '日期不能为空' },
        { status: 400 }
      )
    }

    if (!body.fields || body.fields.length === 0) {
      return NextResponse.json(
        { error: '至少需要添加一个字段' },
        { status: 400 }
      )
    }
    
    const feature = await createFeature(body)
    
    return NextResponse.json({ feature }, { status: 201 })
  } catch (error) {
    console.error('Error creating feature:', error)
    return NextResponse.json(
      { error: 'Failed to create feature' },
      { status: 500 }
    )
  }
}
