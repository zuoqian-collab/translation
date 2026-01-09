'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Feature } from '@/lib/types'
import FeatureCard from '@/components/FeatureCard'
import SearchBar from '@/components/SearchBar'

export default function HomePage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVersion, setSelectedVersion] = useState<string>('all')

  const fetchFeatures = useCallback(async (query?: string) => {
    try {
      const url = query ? `/api/features?q=${encodeURIComponent(query)}` : '/api/features'
      const response = await fetch(url)
      const data = await response.json()
      setFeatures(data.features || [])
    } catch (error) {
      console.error('Error fetching features:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeatures()
  }, [fetchFeatures])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setLoading(true)
    fetchFeatures(query)
  }, [fetchFeatures])

  // 获取所有版本号并去重
  const versions = useMemo(() => {
    const versionSet = new Set(features.map(f => f.version))
    return Array.from(versionSet).sort((a, b) => {
      const partsA = a.split('.').map(Number)
      const partsB = b.split('.').map(Number)
      for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const numA = partsA[i] || 0
        const numB = partsB[i] || 0
        if (numB !== numA) return numB - numA
      }
      return 0
    })
  }, [features])

  // 按版本号筛选
  const filteredFeatures = useMemo(() => {
    if (selectedVersion === 'all') return features
    return features.filter(f => f.version === selectedVersion)
  }, [features, selectedVersion])

  // 按版本号分组
  const groupedByVersion = useMemo(() => {
    const groups: Record<string, Feature[]> = {}
    filteredFeatures.forEach(feature => {
      if (!groups[feature.version]) {
        groups[feature.version] = []
      }
      groups[feature.version].push(feature)
    })
    return groups
  }, [filteredFeatures])

  // 排序后的版本号列表
  const sortedVersions = useMemo(() => {
    return Object.keys(groupedByVersion).sort((a, b) => {
      const partsA = a.split('.').map(Number)
      const partsB = b.split('.').map(Number)
      for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const numA = partsA[i] || 0
        const numB = partsB[i] || 0
        if (numB !== numA) return numB - numA
      }
      return 0
    })
  }, [groupedByVersion])

  return (
    <div className="space-y-4">
      {/* 页面头部 */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">翻译管理</h1>
        <p className="text-text-secondary text-sm mt-0.5">管理所有功能的多语言文案</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex gap-3">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} />
        </div>
        <select
          value={selectedVersion}
          onChange={(e) => setSelectedVersion(e.target.value)}
          className="px-3 py-2 bg-surface border border-border rounded-lg text-text-primary text-sm focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all cursor-pointer"
        >
          <option value="all">全部版本</option>
          {versions.map(version => (
            <option key={version} value={version}>v{version}</option>
          ))}
        </select>
      </div>

      {/* 功能列表 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-surface border border-border rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-background rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-background rounded w-1/2 mb-3"></div>
              <div className="space-y-1">
                <div className="h-6 bg-background rounded"></div>
                <div className="h-6 bg-background rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredFeatures.length === 0 ? (
        <div className="text-center py-12">
          {searchQuery || selectedVersion !== 'all' ? (
            <>
              <p className="text-text-secondary text-sm mb-3">未找到匹配的功能</p>
              <button onClick={() => { handleSearch(''); setSelectedVersion('all') }} className="text-accent text-sm hover:underline">
                清除筛选
              </button>
            </>
          ) : (
            <>
              <p className="text-text-secondary text-sm mb-3">暂无功能</p>
              <a href="/feature/new" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                新建功能
              </a>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {sortedVersions.map((version) => (
            <div key={version}>
              {/* 版本标题 */}
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold bg-accent/10 text-accent border border-accent/20">
                  v{version}
                </span>
                <span className="text-xs text-text-secondary">{groupedByVersion[version].length} 个功能</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>
              
              {/* 该版本下的功能卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {groupedByVersion[version].map((feature) => (
                  <FeatureCard key={feature.id} feature={feature} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
