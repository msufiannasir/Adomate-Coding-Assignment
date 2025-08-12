'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { TextLayer, CanvasSize } from '@/types';

// Dynamically import Konva components to avoid SSR issues
const Stage = dynamic(() => import('react-konva').then((mod) => mod.Stage), { ssr: false });
const Layer = dynamic(() => import('react-konva').then((mod) => mod.Layer), { ssr: false });
const Image = dynamic(() => import('react-konva').then((mod) => mod.Image), { ssr: false });
const Text = dynamic(() => import('react-konva').then((mod) => mod.Text), { ssr: false });
const Transformer = dynamic(() => import('react-konva').then((mod) => mod.Transformer), { ssr: false });

interface CanvasProps {
  backgroundImage: string | null;
  textLayers: TextLayer[];
  selectedLayerId: string | null;
  selectedLayerIds: string[];
  onSelectLayer: (id: string | null) => void;
  onMultiSelect: (id: string, isMultiSelect: boolean) => void;
  onUpdateLayer: (id: string, updates: Partial<TextLayer>) => void;
  onUpdateMultipleLayers: (updates: Partial<TextLayer>) => void;
  canvasSize: CanvasSize;
}

export default function Canvas({
  backgroundImage,
  textLayers,
  selectedLayerId,
  selectedLayerIds,
  onSelectLayer,
  onMultiSelect,
  onUpdateLayer,
  onUpdateMultipleLayers,
  canvasSize,
}: CanvasProps) {
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const [backgroundImg, setBackgroundImg] = useState<HTMLImageElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load background image
  useEffect(() => {
    if (backgroundImage && isClient) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous'; // Handle CORS issues
      img.onload = () => {
        setBackgroundImg(img);
      };
      img.onerror = (error) => {
        console.error('Failed to load image:', error);
        setBackgroundImg(null);
      };
      img.src = backgroundImage;
    } else {
      setBackgroundImg(null);
    }
  }, [backgroundImage, isClient]);

  // Update transformer when selection changes
  useEffect(() => {
    if (selectedLayerId && transformerRef.current && isClient) {
      const stage = stageRef.current;
      const selectedNode = stage.findOne(`#${selectedLayerId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else if (transformerRef.current && isClient) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedLayerId, isClient]);

  const handleTextClick = (layerId: string, e: any) => {
    const isMultiSelect = e.evt.ctrlKey || e.evt.metaKey;
    onMultiSelect(layerId, isMultiSelect);
  };

  const handleTextDragEnd = (layerId: string, e: any) => {
    const node = e.target;
    const newX = node.x();
    const newY = node.y();
    
    // Snap to center if near center
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    const snapThreshold = 20;
    
    let finalX = newX;
    let finalY = newY;
    
    if (Math.abs(newX - centerX) < snapThreshold) {
      finalX = centerX;
    }
    if (Math.abs(newY - centerY) < snapThreshold) {
      finalY = centerY;
    }
    
    onUpdateLayer(layerId, { x: finalX, y: finalY });
  };

  const handleTextTransformEnd = (layerId: string, e: any) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Reset scale and update width/height instead
    node.scaleX(1);
    node.scaleY(1);
    
    const newWidth = Math.max(5, node.width() * scaleX);
    const newHeight = Math.max(5, node.height() * scaleY);
    const newRotation = node.rotation();
    
    onUpdateLayer(layerId, {
      width: newWidth,
      height: newHeight,
      rotation: newRotation,
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedLayerId) return;
    
    const selectedLayer = textLayers.find(l => l.id === selectedLayerId);
    if (!selectedLayer) return;
    
    const moveAmount = e.shiftKey ? 10 : 1;
    let newX = selectedLayer.x;
    let newY = selectedLayer.y;
    
    switch (e.key) {
      case 'ArrowLeft':
        newX -= moveAmount;
        break;
      case 'ArrowRight':
        newX += moveAmount;
        break;
      case 'ArrowUp':
        newY -= moveAmount;
        break;
      case 'ArrowDown':
        newY += moveAmount;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    onUpdateLayer(selectedLayerId, { x: newX, y: newY });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedLayerId, textLayers]);

  const handleStageClick = (e: any) => {
    // Clicked on stage but not on a text node
    if (e.target === e.target.getStage()) {
      onSelectLayer(null);
    }
  };

  // Calculate responsive canvas size
  const maxWidth = 800; // Maximum width for the canvas
  const maxHeight = 600; // Maximum height for the canvas
  
  let displayWidth = canvasSize.width;
  let displayHeight = canvasSize.height;
  let scale = 1;
  
  // Scale down if image is too large
  if (displayWidth > maxWidth || displayHeight > maxHeight) {
    const scaleX = maxWidth / displayWidth;
    const scaleY = maxHeight / displayHeight;
    scale = Math.min(scaleX, scaleY);
    displayWidth = canvasSize.width * scale;
    displayHeight = canvasSize.height * scale;
  }

  // Don't render Konva components on server side
  if (!isClient) {
    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg max-w-full">
        <div className="flex justify-center">
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Loading canvas...</p>
          </div>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log('Canvas render:', { 
    isClient, 
    backgroundImage: !!backgroundImage, 
    backgroundImg: !!backgroundImg,
    textLayersCount: textLayers.length 
  });

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg max-w-full">
      <div className="flex justify-center">
        <Stage
          ref={stageRef}
          width={displayWidth}
          height={displayHeight}
          scaleX={scale}
          scaleY={scale}
          onClick={handleStageClick}
          onTap={handleStageClick}
        >
          <Layer>
            {/* Background Image */}
            {backgroundImg && (
              <Image
                image={backgroundImg}
                width={canvasSize.width}
                height={canvasSize.height}
              />
            )}
            
            {/* Text Layers */}
            {textLayers.map((layer) => (
              <Text
                key={layer.id}
                id={layer.id}
                text={layer.text}
                x={layer.x}
                y={layer.y}
                width={layer.width}
                height={layer.height}
                fontSize={layer.fontSize}
                fontFamily={layer.fontFamily}
                fontStyle={layer.fontWeight === 'bold' ? 'bold' : 'normal'}
                fill={layer.color}
                opacity={layer.opacity}
                align={layer.textAlign}
                rotation={layer.rotation}
                lineHeight={layer.lineHeight || 1.2}
                letterSpacing={layer.letterSpacing || 0}
                draggable={!layer.isLocked}
                onClick={(e) => handleTextClick(layer.id, e)}
                onTap={(e) => handleTextClick(layer.id, e)}
                onDragEnd={(e) => handleTextDragEnd(layer.id, e)}
                onTransformEnd={(e) => handleTextTransformEnd(layer.id, e)}
                stroke={selectedLayerIds.includes(layer.id) ? '#3B82F6' : 'transparent'}
                strokeWidth={selectedLayerIds.includes(layer.id) ? 2 : 0}
                shadowColor={layer.textShadow?.color || 'transparent'}
                shadowBlur={layer.textShadow?.blur || 0}
                shadowOffsetX={layer.textShadow?.offsetX || 0}
                shadowOffsetY={layer.textShadow?.offsetY || 0}
              />
            ))}
            
            {/* Transformer for selected text */}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Limit resize
                return newBox.width < 5 ? oldBox : newBox;
              }}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
