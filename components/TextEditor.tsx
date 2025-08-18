'use client';

import { useState, useEffect } from 'react';
import { TextLayer } from '@/types';
import { fetchGoogleFonts, loadGoogleFont, GoogleFont } from '@/utils/googleFonts';

interface TextEditorProps {
  layer: TextLayer;
  onUpdate: (id: string, updates: Partial<TextLayer>) => void;
  onDuplicate?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  isMultiSelect?: boolean;
  onUpdateMultiple?: (updates: Partial<TextLayer>) => void;
}

const SYSTEM_FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Impact',
  'Comic Sans MS',
  'Courier New',
  'Lucida Console',
  'Palatino',
  'Garamond',
  'Bookman',
  'Avant Garde',
];

const FONT_WEIGHTS = [
  'normal',
  'bold',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
];

const TEXT_ALIGNS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

export default function TextEditor({ 
  layer, 
  onUpdate, 
  onDuplicate, 
  onToggleLock, 
  isMultiSelect = false,
  onUpdateMultiple 
}: TextEditorProps) {
  const [text, setText] = useState(layer.text);
  const [googleFonts, setGoogleFonts] = useState<GoogleFont[]>([]);

  useEffect(() => {
    setText(layer.text);
  }, [layer.text]);

  useEffect(() => {
    const loadFonts = async () => {
      const fonts = await fetchGoogleFonts();
      setGoogleFonts(fonts);
    };
    loadFonts();
  }, []);

  useEffect(() => {
    if (layer.fontFamily && !SYSTEM_FONTS.includes(layer.fontFamily)) {
      loadGoogleFont(layer.fontFamily);
    }
  }, [layer.fontFamily]);

  const handleTextChange = (newText: string) => {
    setText(newText);
    onUpdate(layer.id, { text: newText });
  };

  const handleBlur = () => {
    onUpdate(layer.id, { text });
  };

  return (
    <div className="p-4 border-t border-[#475569] space-y-4 bg-gradient-to-b from-[#1e293b] to-[#334155]">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-white">
          {isMultiSelect ? 'Multiple Layers Selected' : 'Text Properties'}
        </h3>
        <div className="flex space-x-2">
          {onDuplicate && (
            <button
              onClick={() => onDuplicate(layer.id)}
              className="p-2 text-[#94a3b8] hover:text-[#3b82f6] transition-colors"
              title="Duplicate layer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          )}
          {onToggleLock && (
            <button
              onClick={() => onToggleLock(layer.id)}
              className={`p-2 transition-colors ${layer.isLocked ? 'text-red-500' : 'text-[#94a3b8] hover:text-white'}`}
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
          )}
        </div>
      </div>
      
      {/* Text Content */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Text Content
        </label>
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          onBlur={handleBlur}
          className="w-full px-3 py-2 border border-[#475569] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-[#1e293b] text-white shadow-sm"
          rows={3}
          placeholder="Enter your text here..."
        />
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Font Family
        </label>
        <select
          value={layer.fontFamily}
          onChange={(e) => onUpdate(layer.id, { fontFamily: e.target.value })}
          className="w-full px-3 py-2 border border-[#475569] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-[#1e293b] text-white shadow-sm"
        >
          <optgroup label="System Fonts">
            {SYSTEM_FONTS.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </optgroup>
          <optgroup label="Google Fonts">
            {googleFonts.map((font) => (
              <option key={font.family} value={font.family} style={{ fontFamily: font.family }}>
                {font.family}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Font Size: {layer.fontSize}px
        </label>
        <input
          type="range"
          min="8"
          max="200"
          value={layer.fontSize}
          onChange={(e) => onUpdate(layer.id, { fontSize: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Font Weight */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Font Weight
        </label>
        <select
          value={layer.fontWeight}
          onChange={(e) => onUpdate(layer.id, { fontWeight: e.target.value })}
          className="w-full px-3 py-2 border border-[#475569] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-[#1e293b] text-white shadow-sm"
        >
          {FONT_WEIGHTS.map((weight) => (
            <option key={weight} value={weight}>
              {weight}
            </option>
          ))}
        </select>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Text Color
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={layer.color}
            onChange={(e) => onUpdate(layer.id, { color: e.target.value })}
            className="w-12 h-10 border border-[#475569] rounded-lg cursor-pointer shadow-sm"
          />
          <input
            type="text"
            value={layer.color}
            onChange={(e) => onUpdate(layer.id, { color: e.target.value })}
            className="flex-1 px-3 py-2 border border-[#475569] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-[#1e293b] text-white shadow-sm"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Opacity */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Opacity: {Math.round(layer.opacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={layer.opacity}
          onChange={(e) => onUpdate(layer.id, { opacity: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Text Alignment */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Text Alignment
        </label>
        <div className="flex space-x-2">
          {TEXT_ALIGNS.map((align) => (
            <button
              key={align.value}
              onClick={() => onUpdate(layer.id, { textAlign: align.value as any })}
              className={`
                flex-1 px-3 py-2 border rounded-md text-sm font-medium transition-colors
                ${layer.textAlign === align.value
                  ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white border-[#3b82f6]'
                  : 'bg-[#1e293b] text-white border-[#475569] hover:bg-[#334155]'
                }
              `}
            >
              {align.label}
            </button>
          ))}
        </div>
      </div>

      {/* Position and Size */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            X Position
          </label>
          <input
            type="number"
            value={Math.round(layer.x)}
            onChange={(e) => onUpdate(layer.id, { x: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-[#475569] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-[#1e293b] text-white shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Y Position
          </label>
          <input
            type="number"
            value={Math.round(layer.y)}
            onChange={(e) => onUpdate(layer.id, { y: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-[#475569] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-[#1e293b] text-white shadow-sm"
          />
        </div>
      </div>

      {/* Rotation */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Rotation: {Math.round(layer.rotation)}°
        </label>
        <input
          type="range"
          min="0"
          max="360"
          value={layer.rotation}
          onChange={(e) => onUpdate(layer.id, { rotation: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Line Height */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Line Height: {layer.lineHeight || 1.2}
        </label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={layer.lineHeight || 1.2}
          onChange={(e) => onUpdate(layer.id, { lineHeight: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Letter Spacing */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Letter Spacing: {layer.letterSpacing || 0}px
        </label>
        <input
          type="range"
          min="-5"
          max="20"
          step="0.5"
          value={layer.letterSpacing || 0}
          onChange={(e) => onUpdate(layer.id, { letterSpacing: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Text Shadow */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Text Shadow
        </label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={layer.textShadow?.color || '#000000'}
              onChange={(e) => onUpdate(layer.id, { 
                textShadow: { 
                  color: e.target.value,
                  blur: layer.textShadow?.blur || 0,
                  offsetX: layer.textShadow?.offsetX || 0,
                  offsetY: layer.textShadow?.offsetY || 0
                } 
              })}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <span className="text-xs text-[#94a3b8]">Color</span>
          </div>
          <div>
            <label className="block text-xs text-[#94a3b8] mb-1">Blur: {layer.textShadow?.blur || 0}px</label>
            <input
              type="range"
              min="0"
              max="20"
              value={layer.textShadow?.blur || 0}
              onChange={(e) => onUpdate(layer.id, { 
                textShadow: { 
                  color: layer.textShadow?.color || '#000000',
                  blur: parseInt(e.target.value),
                  offsetX: layer.textShadow?.offsetX || 0,
                  offsetY: layer.textShadow?.offsetY || 0
                } 
              })}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-[#94a3b8] mb-1">Offset X: {layer.textShadow?.offsetX || 0}px</label>
              <input
                type="range"
                min="-20"
                max="20"
                value={layer.textShadow?.offsetX || 0}
                              onChange={(e) => onUpdate(layer.id, { 
                textShadow: { 
                  color: layer.textShadow?.color || '#000000',
                  blur: layer.textShadow?.blur || 0,
                  offsetX: parseInt(e.target.value),
                  offsetY: layer.textShadow?.offsetY || 0
                } 
              })}
                className="w-full"
              />
            </div>
            <div>
                              <label className="block text-xs text-[#94a3b8] mb-1">Offset Y: {layer.textShadow?.offsetY || 0}px</label>
              <input
                type="range"
                min="-20"
                max="20"
                value={layer.textShadow?.offsetY || 0}
                              onChange={(e) => onUpdate(layer.id, { 
                textShadow: { 
                  color: layer.textShadow?.color || '#000000',
                  blur: layer.textShadow?.blur || 0,
                  offsetX: layer.textShadow?.offsetX || 0,
                  offsetY: parseInt(e.target.value)
                } 
              })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
