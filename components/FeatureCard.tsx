import Link from 'next/link'
import { Feature } from '@/lib/types'

interface FeatureCardProps {
  feature: Feature
  showVersion?: boolean
}

export default function FeatureCard({ feature, showVersion = false }: FeatureCardProps) {
  return (
    <Link href={`/feature/${feature.id}`}>
      <div className="bg-surface border border-border rounded-lg p-4 card-hover cursor-pointer group h-full flex flex-col">
        {/* 头部：名称和日期 */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
              {feature.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-text-secondary">
              {showVersion && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono bg-accent/10 text-accent border border-accent/20">
                  v{feature.version}
                </span>
              )}
              <span>{feature.date}</span>
            </div>
          </div>
          <svg className="w-4 h-4 text-text-secondary group-hover:text-accent transition-colors ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* 字段预览 */}
        <div className="flex-1">
          {feature.fields.length > 0 && (
            <div className="space-y-1">
              {feature.fields.slice(0, 4).map(field => (
                <div key={field.id} className="px-2 py-1 bg-background/50 rounded border border-border/50 text-xs">
                  <code className="font-mono text-text-secondary">{field.key}</code>
                </div>
              ))}
              {feature.fields.length > 4 && (
                <div className="text-xs text-text-secondary/70 pl-2">
                  +{feature.fields.length - 4} 更多
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
