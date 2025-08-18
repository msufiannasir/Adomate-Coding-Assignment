'use client';

import { TextLayer } from '@/types';

interface LayerPanelProps {
  layers: TextLayer[];
  selectedLayerId: string | null;
  selectedLayerIds: string[];
  onSelectLayer: (id: string | null) => void;
  onMultiSelect: (id: string, isMultiSelect: boolean) => void;
  onDeleteLayer: (id: string) => void;
  onReorderLayers: (fromIndex: number, toIndex: number) => void;
  onToggleLock: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export default function LayerPanel({
  layers,
  selectedLayerId,
  selectedLayerIds,
  onSelectLayer,
  onMultiSelect,
  onDeleteLayer,
  onReorderLayers,
  onToggleLock,
  onDuplicate,
}: LayerPanelProps) {
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      onReorderLayers(dragIndex, dropIndex);
    }
  };

  if (layers.length === 0) {
    return (
      <div className="p-4 text-center text-[#94a3b8] bg-gradient-to-b from-[#1e293b] to-[#334155]">
        <p className="text-sm font-medium">No text layers yet</p>
        <p className="text-xs mt-1 opacity-80">Click "Add Text Layer" to get started</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 border-b border-[#475569] bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]">
        <h3 className="font-medium text-white">Layers ({layers.length})</h3>
        <p className="text-xs text-white opacity-80 mt-1">Drag to reorder</p>
      </div>
      
      <div className="space-y-1 p-2">
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-md
              ${selectedLayerIds.includes(layer.id)
                ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-opacity-20 border-2 border-[#3b82f6] shadow-lg' 
                : 'bg-gradient-to-r from-[#475569] to-[#64748b] hover:from-[#64748b] hover:to-[#94a3b8] border border-transparent hover:shadow-lg'
              }
            `}
            onClick={(e) => {
              const isMultiSelect = e.ctrlKey || e.metaKey;
              onMultiSelect(layer.id, isMultiSelect);
            }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] flex-shrink-0 shadow-sm"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {layer.text || 'Empty text'}
                  </p>
                  <p className="text-xs text-[#94a3b8]">
                    {layer.fontFamily} • {layer.fontSize}px
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {layer.isLocked && (
                <div className="w-4 h-4 text-red-500" title="Layer is locked">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(layer.id);
                }}
                className="p-1 text-[#94a3b8] hover:text-[#3b82f6] transition-colors"
                title="Duplicate layer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLock(layer.id);
                }}
                className={`p-1 transition-colors ${layer.isLocked ? 'text-red-500' : 'text-[#94a3b8] hover:text-white'}`}
                title={layer.isLocked ? 'Unlock layer' : 'Lock layer'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {layer.isLocked ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  )}
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteLayer(layer.id);
                }}
                className="p-1 text-[#94a3b8] hover:text-red-500 transition-colors"
                title="Delete layer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
