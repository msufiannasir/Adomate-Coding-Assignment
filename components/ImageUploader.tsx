'use client';

import { useRef } from 'react';
import { CanvasSize } from '@/types';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  onCanvasSizeChange: (size: CanvasSize) => void;
}

export default function ImageUploader({ onImageUpload, onCanvasSizeChange }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is PNG
    if (file.type !== 'image/png') {
      alert('Please upload a PNG image only.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      console.log('Image uploaded:', { fileSize: file.size, imageUrl: imageUrl.substring(0, 50) + '...' });
      
      // Create image to get dimensions
      const img = new Image();
      img.onload = () => {
        console.log('Image loaded with dimensions:', { width: img.width, height: img.height });
        onImageUpload(imageUrl);
        onCanvasSizeChange({ width: img.width, height: img.height });
      };
      img.onerror = (error) => {
        console.error('Failed to load image:', error);
        alert('Failed to load the image. Please try again.');
      };
      img.src = imageUrl;
    };
    reader.onerror = (error) => {
      console.error('Failed to read file:', error);
      alert('Failed to read the file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    if (file.type !== 'image/png') {
      alert('Please upload a PNG image only.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      console.log('Image uploaded (drop):', { fileSize: file.size, imageUrl: imageUrl.substring(0, 50) + '...' });
      
      const img = new Image();
      img.onload = () => {
        console.log('Image loaded with dimensions (drop):', { width: img.width, height: img.height });
        onImageUpload(imageUrl);
        onCanvasSizeChange({ width: img.width, height: img.height });
      };
      img.onerror = (error) => {
        console.error('Failed to load image (drop):', error);
        alert('Failed to load the image. Please try again.');
      };
      img.src = imageUrl;
    };
    reader.onerror = (error) => {
      console.error('Failed to read file (drop):', error);
      alert('Failed to read the file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-[#3b82f6] rounded-xl p-8 text-center hover:border-[#8b5cf6] transition-all duration-300 cursor-pointer bg-gradient-to-br from-[#1e293b] to-[#334155] shadow-lg hover:shadow-xl transform hover:scale-105"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="space-y-3">
          <div className="text-[#3b82f6]">
            <svg className="mx-auto h-16 w-16" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-sm text-white">
            <span className="font-medium text-[#3b82f6] hover:text-[#8b5cf6] transition-colors">
              Click to upload
            </span>{' '}
            or drag and drop
          </div>
          <p className="text-xs text-[#94a3b8]">PNG files only</p>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
