-- 导入脚本：直接在 Supabase SQL Editor 中运行
-- 将 features.json 的数据导入到数据库

-- 插入功能
INSERT INTO features (id, name, version, date, created_at, updated_at)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '分享功能',
  '1.3.6',
  '2026-01-09',
  '2026-01-09T12:00:00.000Z',
  '2026-01-09T05:32:22.624Z'
) ON CONFLICT (id) DO NOTHING;

-- 插入字段
INSERT INTO fields (feature_id, key, name, translations) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'feedback_need_more_work', 'feedback_need_more_work', 
 '{"en": "Need more work", "zh-CN": "可以更好", "zh-TW": "可以更好"}'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'feedback_subtitle', 'feedback_subtitle', 
 '{"en": "We read every response. Your input tells us what''s working and what to fix next.", "zh-CN": "每一条反馈，我们都会用心聆听。喜欢的话，也可以推荐给朋友。", "zh-TW": "每一條回饋，我們都會用心聆聽。喜歡的話，也可以推薦給朋友。"}'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'feedback_title', 'feedback_title', 
 '{"en": "Has FiloMail been helpful?", "zh-CN": "FiloMail对你有帮助吗？", "zh-TW": "FiloMail對你有幫助嗎？"}'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'feedback_yes_helpful', 'feedback_yes_helpful', 
 '{"en": "Yes, it''s helpful", "zh-CN": "不错，值得分享", "zh-TW": "不錯，值得分享"}'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'image_save_failed', 'image_save_failed', 
 '{"en": "Failed to save image", "zh-CN": "保存图片失败", "zh-TW": "儲存圖片失敗"}'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'image_saved', 'image_saved', 
 '{"en": "Image saved to gallery", "zh-CN": "图片已保存到相册", "zh-TW": "圖片已儲存到相簿"}'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'new_todo', 'new_todo', 
 '{"en": "New To-do", "zh-CN": "新待办", "zh-TW": "新待辦"}'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'past_due', 'past_due', 
 '{"en": "Past Due", "zh-CN": "逾期待办", "zh-TW": "逾期待辦"}'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'save_image', 'save_image', 
 '{"en": "Save Image", "zh-CN": "保存图片", "zh-TW": "儲存圖片"}'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'share', 'share', 
 '{"en": "Share", "zh-CN": "分享", "zh-TW": "分享"}'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'share_card_load_failed', 'share_card_load_failed', 
 '{"en": "Failed to retrieve shared information", "zh-CN": "获取分享信息失败", "zh-TW": "取得分享資訊失敗"}'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'share_failed', 'share_failed', 
 '{"en": "Failed to share", "zh-CN": "分享失败", "zh-TW": "分享失敗"}'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'share_filomail', 'share_filomail', 
 '{"en": "Share FiloMail", "zh-CN": "分享 FiloMail", "zh-TW": "分享 FiloMail"}'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'share_filomail_text', 'share_filomail_text', 
 '{"en": "I''ve been using Filo Mail. It turns emails into summaries & to-dos. 90 days of Plus for both of us if you join:%s", "zh-CN": "我正在使用 Filo Mail。它将邮件转换为摘要和待办事项。如果你加入，我们都可以获得 90 天 Plus 试用：%s", "zh-TW": "我正在使用 Filo Mail。它會將郵件轉為摘要和待辦事項。如果你加入，我們都可以獲得 90 天 Plus 試用：%s"}'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'share_image', 'share_image', 
 '{"en": "Share Image", "zh-CN": "分享图片", "zh-TW": "分享圖片"}'),

('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'storage_permission_denied', 'storage_permission_denied', 
 '{"en": "Storage permission denied", "zh-CN": "存储权限被拒绝", "zh-TW": "儲存權限已被拒絕"}')

ON CONFLICT DO NOTHING;

-- 验证导入结果
SELECT 
  f.name as feature_name,
  f.version,
  COUNT(fi.id) as field_count
FROM features f
LEFT JOIN fields fi ON f.id = fi.feature_id
GROUP BY f.id, f.name, f.version;

