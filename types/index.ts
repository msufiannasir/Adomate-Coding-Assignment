export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  opacity: number;
  textAlign: 'left' | 'center' | 'right';
  rotation: number;
  // New properties for bonus features
  lineHeight?: number;
  letterSpacing?: number;
  textShadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  isLocked?: boolean;
  isSelected?: boolean;
}

export interface HistoryState {
  textLayers: TextLayer[];
  selectedLayerId: string | null;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export interface GoogleFont {
  family: string;
  variants: string[];
  category: string;
}
