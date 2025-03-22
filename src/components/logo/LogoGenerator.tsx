
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Copy } from 'lucide-react';
import Logo from './Logo';
import { useToast } from '@/components/ui/use-toast';

const LogoGenerator: React.FC = () => {
  const [variant, setVariant] = useState<'default' | 'light' | 'dark'>('default');
  const [showText, setShowText] = useState(true);
  const { toast } = useToast();
  
  // Function to download logo as SVG
  const downloadLogo = () => {
    const logoElement = document.getElementById('logo-container');
    if (!logoElement) return;
    
    const svgData = new XMLSerializer().serializeToString(logoElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `找人问问-logo-${variant}${showText ? '-with-text' : ''}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({
      title: "Logo 下载成功",
      description: "SVG格式的logo已成功下载"
    });
  };
  
  const copyToClipboard = async () => {
    const logoElement = document.getElementById('logo-container');
    if (!logoElement) return;
    
    try {
      const svgData = new XMLSerializer().serializeToString(logoElement);
      await navigator.clipboard.writeText(svgData);
      
      toast({
        title: "已复制到剪贴板",
        description: "SVG代码已复制到剪贴板，可粘贴到设计软件"
      });
    } catch (err) {
      toast({
        title: "复制失败",
        description: "无法复制SVG代码，请手动下载",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">品牌Logo生成器</h2>
      
      <div className="mb-6">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="preview">预览</TabsTrigger>
            <TabsTrigger value="options">选项</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="pt-4">
            <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg">
              <div id="brand-logo">
                <Logo size="xl" variant={variant} showText={showText} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="options" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">风格</h3>
              <div className="flex gap-2">
                <Button 
                  variant={variant === 'default' ? 'default' : 'outline'} 
                  onClick={() => setVariant('default')}
                >
                  默认
                </Button>
                <Button 
                  variant={variant === 'light' ? 'default' : 'outline'} 
                  onClick={() => setVariant('light')}
                >
                  浅色
                </Button>
                <Button 
                  variant={variant === 'dark' ? 'default' : 'outline'} 
                  onClick={() => setVariant('dark')}
                >
                  深色
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">文字</h3>
              <Button 
                variant={showText ? 'default' : 'outline'} 
                onClick={() => setShowText(!showText)}
              >
                {showText ? '显示文字' : '仅显示图标'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={downloadLogo} className="flex items-center gap-2">
          <Download size={16} />
          下载SVG
        </Button>
        <Button variant="outline" onClick={copyToClipboard} className="flex items-center gap-2">
          <Copy size={16} />
          复制SVG代码
        </Button>
      </div>
    </div>
  );
};

export default LogoGenerator;
