import FeatureForm from '@/components/FeatureForm'

export default function NewFeaturePage() {
  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <a
        href="/"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回列表
      </a>

      {/* 页面标题 */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          新建功能
        </h1>
        <p className="text-text-secondary">
          添加新的功能并填写各语言的翻译内容
        </p>
      </div>

      {/* 表单 */}
      <FeatureForm mode="create" />
    </div>
  )
}

