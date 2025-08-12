'use client';

interface ToolbarProps {
  onAddText: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historyIndex: number;
  historyLength: number;
}

export default function Toolbar({
  onAddText,
  onUndo,
  onRedo,
  onReset,
  canUndo,
  canRedo,
  historyIndex,
  historyLength,
}: ToolbarProps) {
  return (
    <div className="p-4 border-b border-gray-200 space-y-3">
      <div className="space-y-2">
        <button
          onClick={onAddText}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Text Layer
        </button>
        
        <button
          onClick={onReset}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex space-x-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Redo
          </button>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          History: {historyIndex + 1} / {historyLength}
        </div>
      </div>
    </div>
  );
}
