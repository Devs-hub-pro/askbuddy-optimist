-- 添加 UPDATE 策略，允许接收者标记消息已读
CREATE POLICY "接收者可以标记消息已读"
ON public.messages
FOR UPDATE
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);

-- 添加 DELETE 策略，允许用户删除自己相关的消息
CREATE POLICY "用户可以删除自己的消息"
ON public.messages
FOR DELETE
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);