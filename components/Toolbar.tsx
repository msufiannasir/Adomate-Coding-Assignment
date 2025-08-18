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
    <div className="p-4 border-b border-[#475569] space-y-3 bg-gradient-to-b from-[#1e293b] to-[#334155]">
      <div className="space-y-2">
        <button
          onClick={onAddText}
          className="w-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white px-4 py-2 rounded-lg hover:from-[#2563eb] hover:to-[#7c3aed] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Add Text Layer
        </button>
        
        <button
          onClick={onReset}
          className="w-full bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white px-4 py-2 rounded-lg hover:from-[#dc2626] hover:to-[#b91c1c] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex space-x-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="flex-1 bg-gradient-to-r from-[#475569] to-[#64748b] text-white px-3 py-2 rounded-lg hover:from-[#64748b] hover:to-[#94a3b8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md"
          >
            Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="flex-1 bg-gradient-to-r from-[#475569] to-[#64748b] text-white px-3 py-2 rounded-lg hover:from-[#64748b] hover:to-[#94a3b8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md"
          >
            Redo
          </button>
        </div>
        
        <div className="text-xs text-[#94a3b8] text-center font-medium">
          History: {historyIndex + 1} / {historyLength}
        </div>
      </div>
    </div>
  );
}
