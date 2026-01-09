-- 在 Supabase SQL Editor 中运行此脚本创建表结构

-- 功能表
CREATE TABLE features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 字段表
CREATE TABLE fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  translations JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_fields_feature_id ON fields(feature_id);
CREATE INDEX idx_features_version ON features(version);

-- 更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER features_updated_at
  BEFORE UPDATE ON features
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 启用 RLS (Row Level Security) - 可选，如需公开访问可跳过
-- ALTER TABLE features ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE fields ENABLE ROW LEVEL SECURITY;

-- 公开读写策略（开发/内部使用）
-- CREATE POLICY "Allow all" ON features FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON fields FOR ALL USING (true);

