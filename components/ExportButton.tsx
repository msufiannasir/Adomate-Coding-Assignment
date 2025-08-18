'use client';

import { useRef } from 'react';
import { TextLayer, CanvasSize } from '@/types';

interface ExportButtonProps {
  backgroundImage: string | null;
  textLayers: TextLayer[];
  canvasSize: CanvasSize;
}

export default function ExportButton({ backgroundImage, textLayers, canvasSize }: ExportButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const exportAsPNG = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image
    if (backgroundImage) {
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = backgroundImage;
      });
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    // Draw text layers
    textLayers.forEach((layer) => {
      ctx.save();
      
      // Set text properties
      ctx.font = `${layer.fontWeight} ${layer.fontSize}px ${layer.fontFamily}`;
      ctx.fillStyle = layer.color;
      ctx.globalAlpha = layer.opacity;
      ctx.textAlign = layer.textAlign;
      
      // Apply rotation
      if (layer.rotation !== 0) {
        ctx.translate(layer.x + layer.width / 2, layer.y + layer.height / 2);
        ctx.rotate((layer.rotation * Math.PI) / 180);
        ctx.translate(-(layer.x + layer.width / 2), -(layer.y + layer.height / 2));
      }
      
      // Draw text
      const lines = layer.text.split('\n');
      const lineHeight = layer.fontSize * 1.2;
      
      lines.forEach((line, index) => {
        let x = layer.x;
        if (layer.textAlign === 'center') {
          x += layer.width / 2;
        } else if (layer.textAlign === 'right') {
          x += layer.width;
        }
        
        ctx.fillText(line, x, layer.y + (index + 1) * lineHeight);
      });
      
      ctx.restore();
    });

    // Download the image
    const link = document.createElement('a');
    link.download = 'image-text-composer-export.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="p-4 border-t border-[#475569] bg-gradient-to-b from-[#1e293b] to-[#334155]">
      <button
        onClick={exportAsPNG}
        disabled={!backgroundImage}
        className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-4 py-2 rounded-lg hover:from-[#059669] hover:to-[#047857] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        Export as PNG
      </button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
