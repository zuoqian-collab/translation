'use client'

import { useState, useEffect } from 'react'
import { Feature } from '@/lib/types'
import FeatureForm from '@/components/FeatureForm'

interface PageProps {
  params: { id: string }
}

export default function EditFeaturePage({ params }: PageProps) {
  const { id } = params
  const [feature, setFeature] = useState<Feature | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeature() {
      try {
        const response = await fetch(`/api/features/${id}`)
        if (response.ok) {
          const data = await response.json()
          setFeature(data.feature)
        }
      } catch (error) {
        console.error('Error fetching feature:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeature()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="h-6 bg-background rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-background rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!feature) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface border border-border flex items-center justify-center">
          <svg className="w-10 h-10 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">功能不存在</h3>
        <p className="text-text-secondary mb-6">该功能可能已被删除</p>
        <a href="/" className="text-accent hover:underline">返回首页</a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <a
        href={`/feature/${feature.id}`}
        className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回详情
      </a>

      {/* 页面标题 */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          编辑功能
        </h1>
        <p className="text-text-secondary">
          修改 <span className="text-text-primary font-medium">{feature.name}</span> 的信息和翻译内容
        </p>
      </div>

      {/* 表单 */}
      <FeatureForm feature={feature} mode="edit" />
    </div>
  )
}
