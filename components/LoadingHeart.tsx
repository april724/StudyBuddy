
import React from 'react';

const LoadingHeart: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative w-16 h-16 animate-bounce">
        <span className="text-6xl">📝</span>
        <span className="absolute -top-2 -right-2 animate-ping text-2xl">✨</span>
      </div>
      <p className="mt-4 text-pink-500 font-cute text-xl">AI 老師正在努力分析中...</p>
      <p className="text-gray-400 text-sm">請稍等一下下喔！</p>
    </div>
  );
};

export default LoadingHeart;
