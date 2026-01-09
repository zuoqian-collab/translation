import { NextRequest, NextResponse } from 'next/server'
import { getFeatureById, updateFeature, deleteFeature } from '@/lib/data'
import { UpdateFeatureInput } from '@/lib/types'

interface RouteParams {
  params: { id: string }
}

// GET /api/features/[id] - 获取单个功能
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const feature = await getFeatureById(id)
    
    if (!feature) {
      return NextResponse.json(
        { error: '功能不存在' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ feature })
  } catch (error) {
    console.error('Error fetching feature:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feature' },
      { status: 500 }
    )
  }
}

// PUT /api/features/[id] - 更新功能
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const body: UpdateFeatureInput = await request.json()
    
    const feature = await updateFeature(id, body)
    
    if (!feature) {
      return NextResponse.json(
        { error: '功能不存在' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ feature })
  } catch (error) {
    console.error('Error updating feature:', error)
    return NextResponse.json(
      { error: 'Failed to update feature' },
      { status: 500 }
    )
  }
}

// DELETE /api/features/[id] - 删除功能
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const success = await deleteFeature(id)
    
    if (!success) {
      return NextResponse.json(
        { error: '功能不存在' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting feature:', error)
    return NextResponse.json(
      { error: 'Failed to delete feature' },
      { status: 500 }
    )
  }
}
