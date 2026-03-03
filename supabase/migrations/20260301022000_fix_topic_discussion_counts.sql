CREATE OR REPLACE FUNCTION public.recalculate_topic_discussions_count(p_topic_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.hot_topics
  SET discussions_count = (
    SELECT COUNT(*)
    FROM public.topic_discussions
    WHERE topic_id = p_topic_id
      AND is_hidden = false
  )
  WHERE id = p_topic_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_topic_discussions_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.recalculate_topic_discussions_count(NEW.topic_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.recalculate_topic_discussions_count(OLD.topic_id);
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.topic_id IS DISTINCT FROM OLD.topic_id THEN
      PERFORM public.recalculate_topic_discussions_count(OLD.topic_id);
    END IF;

    IF NEW.topic_id IS DISTINCT FROM OLD.topic_id
       OR NEW.is_hidden IS DISTINCT FROM OLD.is_hidden THEN
      PERFORM public.recalculate_topic_discussions_count(NEW.topic_id);
    END IF;

    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS on_topic_discussion_change ON public.topic_discussions;

CREATE TRIGGER on_topic_discussion_change
AFTER INSERT OR DELETE OR UPDATE OF topic_id, is_hidden
ON public.topic_discussions
FOR EACH ROW
EXECUTE FUNCTION public.update_topic_discussions_count();

UPDATE public.hot_topics AS topic
SET discussions_count = (
  SELECT COUNT(*)
  FROM public.topic_discussions AS discussion
  WHERE discussion.topic_id = topic.id
    AND discussion.is_hidden = false
);
