
import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Crop, Move } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onConfirm: (croppedBase64: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onConfirm, onCancel }) => {
  const [crop, setCrop] = useState({ x: 10, y: 10, width: 80, height: 40 }); // Percentage based
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleConfirm = () => {
    if (!imgRef.current) return;

    const canvas = document.createElement('canvas');
    const img = imgRef.current;
    
    // Calculate actual pixel dimensions
    const scaleX = img.naturalWidth / 100;
    const scaleY = img.naturalHeight / 100;
    
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(
        img,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
      onConfirm(canvas.toDataURL('image/jpeg', 0.85).split(',')[1]);
    }
  };

  // Simple drag logic (for demo, centered and resizable)
  const updateCrop = (e: React.ChangeEvent<HTMLInputElement>, field: 'x' | 'y' | 'width' | 'height') => {
    setCrop(prev => ({ ...prev, [field]: parseInt(e.target.value) }));
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-[2.5rem] shadow-2xl border-4 border-pink-100 max-w-2xl w-full mx-auto animate-in zoom-in duration-300">
      <div className="flex items-center justify-between w-full mb-4">
        <h2 className="text-xl font-cute text-pink-600 flex items-center gap-2">
          <Crop className="w-5 h-5" /> 框選你想問的題目
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-red-400 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="relative border-4 border-dashed border-gray-200 rounded-2xl overflow-hidden mb-6 bg-gray-50" ref={containerRef}>
        <img 
          ref={imgRef}
          src={imageSrc} 
          alt="Original" 
          className="max-h-[50vh] object-contain"
        />
        {/* Simple Overlay Crop Visualizer */}
        <div 
          className="absolute border-4 border-pink-500 bg-pink-500/10 pointer-events-none"
          style={{
            left: `${crop.x}%`,
            top: `${crop.y}%`,
            width: `${crop.width}%`,
            height: `${crop.height}%`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div className="absolute -top-3 -left-3 bg-pink-500 text-white p-1 rounded-full shadow-lg">
            <Move className="w-3 h-3" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full mb-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">上下位置</label>
          <input type="range" value={crop.y} onChange={(e) => updateCrop(e, 'y')} className="w-full accent-pink-500" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">左右位置</label>
          <input type="range" value={crop.x} onChange={(e) => updateCrop(e, 'x')} className="w-full accent-pink-500" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">寬度</label>
          <input type="range" value={crop.width} onChange={(e) => updateCrop(e, 'width')} className="w-full accent-pink-500" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">高度</label>
          <input type="range" value={crop.height} onChange={(e) => updateCrop(e, 'height')} className="w-full accent-pink-500" />
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button 
          onClick={onCancel}
          className="flex-1 py-3 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all"
        >
          重新拍照
        </button>
        <button 
          onClick={handleConfirm}
          className="flex-1 py-3 rounded-2xl font-bold text-white bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-200 flex items-center justify-center gap-2 transition-all"
        >
          <Check className="w-5 h-5" /> 確定範圍
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
