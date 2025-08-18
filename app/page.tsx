'use client';

import { useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import Canvas from '@/components/Canvas';
import TextEditor from '@/components/TextEditor';
import LayerPanel from '@/components/LayerPanel';
import Toolbar from '@/components/Toolbar';
import ExportButton from '@/components/ExportButton';
import { TextLayer, HistoryState } from '@/types';

export default function ImageTextComposer() {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);

  const handleSelectLayer = (id: string | null) => {
    setSelectedLayerId(id);
    if (id) {
      setSelectedLayerIds([id]);
    } else {
      setSelectedLayerIds([]);
    }
  };

  const handleMultiSelect = (id: string, isMultiSelect: boolean) => {
    if (isMultiSelect) {
      setSelectedLayerIds(prev => 
        prev.includes(id) 
          ? prev.filter(layerId => layerId !== id)
          : [...prev, id]
      );
    } else {
      setSelectedLayerId(id);
      setSelectedLayerIds([id]);
    }
  };
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('imageTextComposer');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setBackgroundImage(parsed.backgroundImage);
        setTextLayers(parsed.textLayers || []);
        setCanvasSize(parsed.canvasSize || { width: 800, height: 600 });
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      backgroundImage,
      textLayers,
      canvasSize,
    };
    localStorage.setItem('imageTextComposer', JSON.stringify(stateToSave));
  }, [backgroundImage, textLayers, canvasSize]);

  // Add to history
  const addToHistory = (newState: Partial<HistoryState>) => {
    const newHistoryState = {
      textLayers: [...textLayers],
      selectedLayerId,
      ...newState,
    };

    // Remove any history after current index
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newHistoryState);

    // Keep only last 20 states
    if (newHistory.length > 20) {
      newHistory.shift();
    }

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      setTextLayers(state.textLayers);
      setSelectedLayerId(state.selectedLayerId);
      setHistoryIndex(newIndex);
    }
  };

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      setTextLayers(state.textLayers);
      setSelectedLayerId(state.selectedLayerId);
      setHistoryIndex(newIndex);
    }
  };

  // Reset
  const reset = () => {
    setBackgroundImage(null);
    setTextLayers([]);
    setSelectedLayerId(null);
    setHistory([]);
    setHistoryIndex(-1);
    setCanvasSize({ width: 800, height: 600 });
    localStorage.removeItem('imageTextComposer');
  };

  // Add text layer
  const addTextLayer = () => {
    const newLayer: TextLayer = {
      id: `text-${Date.now()}`,
      text: 'Double click to edit',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      fontSize: 24,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      color: '#000000',
      opacity: 1,
      textAlign: 'left',
      rotation: 0,
      lineHeight: 1.2,
      letterSpacing: 0,
      textShadow: {
        color: '#000000',
        blur: 0,
        offsetX: 0,
        offsetY: 0,
      },
      isLocked: false,
      isSelected: false,
    };

    const newLayers = [...textLayers, newLayer];
    setTextLayers(newLayers);
    setSelectedLayerId(newLayer.id);
    addToHistory({ textLayers: newLayers, selectedLayerId: newLayer.id });
  };

  // Update text layer
  const updateTextLayer = (id: string, updates: Partial<TextLayer>) => {
    const newLayers = textLayers.map(layer =>
      layer.id === id ? { ...layer, ...updates } : layer
    );
    setTextLayers(newLayers);
    addToHistory({ textLayers: newLayers });
  };

  // Delete text layer
  const deleteTextLayer = (id: string) => {
    const newLayers = textLayers.filter(layer => layer.id !== id);
    setTextLayers(newLayers);
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
    addToHistory({ textLayers: newLayers, selectedLayerId: selectedLayerId === id ? null : selectedLayerId });
  };

  // Reorder layers
  const reorderLayers = (fromIndex: number, toIndex: number) => {
    const newLayers = [...textLayers];
    const [movedLayer] = newLayers.splice(fromIndex, 1);
    newLayers.splice(toIndex, 0, movedLayer);
    setTextLayers(newLayers);
    addToHistory({ textLayers: newLayers });
  };

  // Duplicate layer
  const duplicateLayer = (id: string) => {
    const layerToDuplicate = textLayers.find(l => l.id === id);
    if (!layerToDuplicate) return;

    const newLayer: TextLayer = {
      ...layerToDuplicate,
      id: `text-${Date.now()}`,
      x: layerToDuplicate.x + 20,
      y: layerToDuplicate.y + 20,
    };

    const newLayers = [...textLayers, newLayer];
    setTextLayers(newLayers);
    setSelectedLayerId(newLayer.id);
    setSelectedLayerIds([newLayer.id]);
    addToHistory({ textLayers: newLayers, selectedLayerId: newLayer.id });
  };

  // Toggle layer lock
  const toggleLayerLock = (id: string) => {
    const newLayers = textLayers.map(layer =>
      layer.id === id ? { ...layer, isLocked: !layer.isLocked } : layer
    );
    setTextLayers(newLayers);
    addToHistory({ textLayers: newLayers });
  };

  // Update multiple layers
  const updateMultipleLayers = (updates: Partial<TextLayer>) => {
    const newLayers = textLayers.map(layer =>
      selectedLayerIds.includes(layer.id) ? { ...layer, ...updates } : layer
    );
    setTextLayers(newLayers);
    addToHistory({ textLayers: newLayers });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]">
      <div className="flex h-screen">
        {/* Left Panel - Tools and Layers */}
        <div className="w-80 bg-[#1e293b] border-r border-[#475569] flex flex-col shadow-xl">
          <div className="p-4 border-b border-[#475569] bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]">
            <h1 className="text-xl font-bold text-white">Image Text Maker</h1>
          </div>
          
          <Toolbar
            onAddText={addTextLayer}
            onUndo={undo}
            onRedo={redo}
            onReset={reset}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            historyIndex={historyIndex}
            historyLength={history.length}
          />

          <LayerPanel
            layers={textLayers}
            selectedLayerId={selectedLayerId}
            selectedLayerIds={selectedLayerIds}
            onSelectLayer={setSelectedLayerId}
            onMultiSelect={handleMultiSelect}
            onDeleteLayer={deleteTextLayer}
            onReorderLayers={reorderLayers}
            onToggleLock={toggleLayerLock}
            onDuplicate={duplicateLayer}
          />

          {selectedLayerId && (
            <TextEditor
              layer={textLayers.find(l => l.id === selectedLayerId)!}
              onUpdate={updateTextLayer}
              onDuplicate={duplicateLayer}
              onToggleLock={toggleLayerLock}
              isMultiSelect={selectedLayerIds.length > 1}
              onUpdateMultiple={updateMultipleLayers}
            />
          )}
          
          <ExportButton
            backgroundImage={backgroundImage}
            textLayers={textLayers}
            canvasSize={canvasSize}
          />
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-[#475569] bg-gradient-to-r from-[#1e293b] to-[#334155]">
            <ImageUploader
              onImageUpload={setBackgroundImage}
              onCanvasSizeChange={setCanvasSize}
            />
          </div>
          
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#334155] via-[#475569] to-[#64748b] p-4 overflow-hidden">
            <div className="max-w-full max-h-full">
                          <Canvas
              backgroundImage={backgroundImage}
              textLayers={textLayers}
              selectedLayerId={selectedLayerId}
              selectedLayerIds={selectedLayerIds}
              onSelectLayer={handleSelectLayer}
              onMultiSelect={handleMultiSelect}
              onUpdateLayer={updateTextLayer}
              onUpdateMultipleLayers={updateMultipleLayers}
              canvasSize={canvasSize}
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
