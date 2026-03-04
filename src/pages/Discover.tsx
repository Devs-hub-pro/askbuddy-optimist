import React, { useEffect, useRef, useState } from 'react';
import { Image, Bell, SmilePlus, Hash, Loader2, X, PenSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import BottomNav from '../components/BottomNav';
import DiscoverFeed from '@/components/discover/DiscoverFeed';
import { usePosts, useCreatePost } from '@/hooks/usePosts';
import { useFollowingPosts } from '@/hooks/useFollowingPosts';
import { useLocalPosts } from '@/hooks/useLocalPosts';
import { useUploadPostMedia } from '@/hooks/usePostMediaUpload';
import { useAuth } from '@/contexts/AuthContext';
import { formatTime } from '@/utils/format';

const plazaTopics = [
  { id: 'topic-1', name: '留学申请', hint: '经验帖最多' },
  { id: 'topic-2', name: '简历优化', hint: '今天很热' },
  { id: 'topic-3', name: '租房避坑', hint: '同城讨论' },
  { id: 'topic-4', name: '副业技能', hint: '持续更新' },
  { id: 'topic-5', name: '考研复习', hint: '正在讨论' },
];

const sampleEmojis = ['😊', '😂', '😍', '🤔', '👍', '🎉', '❤️', '😭', '🔥', '✨', '🙏', '👏', '🌹', '🤗', '😁'];

const Discover: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'following' | 'recommended' | 'local'>('recommended');
  const [showNotification, setShowNotification] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('深圳');
  const { user } = useAuth();
  const { data: posts, isLoading } = usePosts();
  const { data: followingPosts, isLoading: followingLoading } = useFollowingPosts();
  const { data: localPosts, isLoading: localLoading } = useLocalPosts(currentLocation);

  // Post creation state
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const createPost = useCreatePost();
  const uploadMedia = useUploadPostMedia();

  useEffect(() => {
    const syncLocation = () => {
      const stored = localStorage.getItem('currentLocation') || '深圳';
      setCurrentLocation(stored);
    };
    syncLocation();
    window.addEventListener('storage', syncLocation);
    return () => window.removeEventListener('storage', syncLocation);
  }, []);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    let imageUrls: string[] = [];
    if (selectedImages.length > 0) {
      imageUrls = await uploadMedia.mutateAsync(selectedImages);
    }
    await createPost.mutateAsync({ content: newPostContent, topics: newPostTags, images: imageUrls });
    setIsPostDialogOpen(false);
    setNewPostContent('');
    setNewPostTags([]);
    setNewTagInput('');
    setSelectedImages([]);
    setImagePreviews([]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 9) return;
    setSelectedImages(prev => [...prev, ...files]);
    const previews = files.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !newPostTags.includes(newTagInput.trim())) {
      setNewPostTags([...newPostTags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  return (
    <div className="pb-16 min-h-[100dvh] bg-muted">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'following' | 'recommended' | 'local')} className="w-full">
        <div className="sticky top-0 z-20 bg-app-header shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex-1">
              <TabsList className="h-10 w-full justify-start rounded-none bg-transparent p-0">
                {(['following', 'recommended', 'local'] as const).map(tab => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="rounded-none px-3 py-1 text-base font-medium text-white/75 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white"
                  >
                    {tab === 'following' ? '关注' : tab === 'recommended' ? '推荐' : '同城'}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/25"
                onClick={() => setIsPostDialogOpen(true)}
                aria-label="发动态"
              >
                <PenSquare size={17} />
              </button>
              <button
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/25"
                onClick={() => { setShowNotification(false); navigate('/discover/interactions'); }}
              >
                <Bell size={18} />
                {showNotification && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse" />}
              </button>
            </div>
          </div>
        </div>

        <TabsContent key="following" value="following" className="mt-0 p-0">
          {!user ? (
            <div className="px-4 pt-5">
              <div className="surface-card rounded-3xl px-6 py-10 text-center text-muted-foreground">
                <p className="mb-2 text-sm font-medium text-foreground">登录后查看关注动态</p>
                <p className="text-sm">你关注的人发布动态后，会优先出现在这里</p>
              </div>
            </div>
          ) : (
            <DiscoverFeed
              posts={followingPosts || []}
              isLoading={followingLoading}
              formatTime={formatTime}
              emptyText="暂无关注用户的动态，去关注感兴趣的人吧"
              showComposer
              onQuickPost={() => setIsPostDialogOpen(true)}
              topicChips={plazaTopics.slice(0, 4)}
              tabLabel="关注广场"
            />
          )}
        </TabsContent>

        <TabsContent key="recommended" value="recommended" className="mt-0 p-0">
          <DiscoverFeed
            posts={posts || []}
            isLoading={isLoading}
            formatTime={formatTime}
            showComposer
            onQuickPost={() => setIsPostDialogOpen(true)}
            topicChips={plazaTopics}
            tabLabel="推荐广场"
          />
        </TabsContent>

        <TabsContent key="local" value="local" className="mt-0 p-0">
          <DiscoverFeed
            posts={localPosts || []}
            isLoading={localLoading}
            formatTime={formatTime}
            emptyText={`还没有"${currentLocation}"的同城动态`}
            showComposer
            onQuickPost={() => setIsPostDialogOpen(true)}
            topicChips={plazaTopics.slice(1)}
            tabLabel={`${currentLocation}广场`}
            locationLabel={currentLocation}
          />
        </TabsContent>
      </Tabs>

      {/* Post Creation Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-md border-border rounded-xl max-w-md w-full mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">发布动态</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Textarea
              placeholder="分享你的想法..."
              className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <div className="relative">
              <Button variant="outline" size="sm" className="flex gap-1 rounded-full" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <SmilePlus size={18} /> 添加表情
              </Button>
              {showEmojiPicker && (
                <div className="absolute top-full left-0 mt-2 p-2 bg-card rounded-lg shadow-lg border border-border grid grid-cols-5 gap-2 z-10">
                  {sampleEmojis.map((emoji, i) => (
                    <button key={i} className="w-8 h-8 flex items-center justify-center text-xl hover:bg-muted rounded transition-colors" onClick={() => { setNewPostContent(prev => prev + emoji); setShowEmojiPicker(false); }}>
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash size={18} className="text-muted-foreground" />
                <Input placeholder="添加标签" value={newTagInput} onChange={(e) => setNewTagInput(e.target.value)} className="flex-1" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }} />
                <Button variant="outline" size="sm" onClick={handleAddTag}>添加</Button>
              </div>
              {newPostTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newPostTags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary border-none rounded-full text-xs py-1 px-3 flex items-center gap-1">
                      #{tag}
                      <button className="ml-1 hover:text-destructive" onClick={() => setNewPostTags(newPostTags.filter(t => t !== tag))}>×</button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button className="absolute top-1 right-1 w-5 h-5 bg-foreground/50 rounded-full flex items-center justify-center" onClick={() => removeImage(i)}>
                      <X size={12} className="text-background" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex gap-1 rounded-full" onClick={() => imageInputRef.current?.click()}>
                <Image size={18} /> 添加图片 {selectedImages.length > 0 && `(${selectedImages.length})`}
              </Button>
            </div>
            <div className="pt-2 flex justify-end">
              <Button className="bg-primary hover:bg-primary/90 rounded-full" onClick={handleCreatePost} disabled={createPost.isPending || uploadMedia.isPending || !newPostContent.trim()}>
                {(createPost.isPending || uploadMedia.isPending) ? <Loader2 size={16} className="animate-spin mr-1" /> : null}
                {uploadMedia.isPending ? '上传中...' : '发布'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Discover;
