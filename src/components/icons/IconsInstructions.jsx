
import React from 'react';

const IconsInstructions = () => {
  return (
    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
      <h2 className="font-bold text-lg mb-2">For WeChat Mini Program:</h2>
      <p className="text-sm">Save these icons as PNG files with the following naming structure:</p>
      <ul className="mt-2 text-sm list-disc pl-5">
        <li>Normal state: <code>/assets/icons/[icon-name].png</code></li>
        <li>Active state (for tab bar): <code>/assets/icons/[icon-name]-active.png</code></li>
      </ul>
      <p className="mt-4 text-sm text-gray-600">Example: /assets/icons/home.png, /assets/icons/home-active.png</p>
      
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-medium text-sm mb-1">SVG到PNG转换说明：</h3>
        <p className="text-xs text-gray-700">
          1. 下载SVG图标后，您可以使用在线工具如 <a href="https://cloudconvert.com/svg-to-png" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">CloudConvert</a> 将它们转换为PNG格式。<br/>
          2. 对于底部导航栏的活跃状态图标，您可以在转换时设置不同的颜色（如#4FD1C5）。<br/>
          3. 确保所有图标都保存在微信小程序项目的 /assets/icons/ 目录中。
        </p>
      </div>
    </div>
  );
};

export default IconsInstructions;
