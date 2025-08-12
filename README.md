# Image Text Composer

A desktop-only, single-page image editing tool that enables users to upload PNG images and overlay them with fully customizable text. Built with Next.js, TypeScript, and Konva.js.

## Features

### Core Requirements ✅
- **PNG Image Upload**: Upload PNG images with automatic canvas sizing
- **Multiple Text Layers**: Add, edit, and manage multiple text layers
- **Text Styling**: Font family, size, weight, color, opacity, alignment
- **Multi-line Text**: Support for line breaks within text boxes
- **Transform Controls**: Drag, resize, and rotate text layers
- **Layer Management**: Reorder layers with drag-and-drop
- **Snap-to-Center**: Automatic snapping when near canvas center
- **Arrow Key Nudging**: Precise positioning with arrow keys (Shift for larger steps)
- **Undo/Redo**: 20-step history with visual indicator
- **Autosave**: Automatic localStorage persistence
- **Reset Functionality**: Clear all data and return to blank state
- **PNG Export**: Export final design with original dimensions

### Technical Implementation
- **Framework**: Next.js 15 with TypeScript
- **Canvas Library**: Konva.js for interactive canvas operations
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React hooks with localStorage persistence
- **Font Support**: Google Fonts API integration with system fonts fallback

## Architecture

### Component Structure
```
app/
├── page.tsx              # Main application component
├── layout.tsx            # Root layout with desktop-only restriction
└── globals.css           # Global styles

components/
├── Canvas.tsx            # Interactive canvas with Konva.js
├── ImageUploader.tsx     # PNG upload with drag-and-drop
├── TextEditor.tsx        # Text property editing panel
├── LayerPanel.tsx        # Layer management and reordering
├── Toolbar.tsx           # Main actions (add, undo, redo, reset)
└── ExportButton.tsx      # PNG export functionality

types/
└── index.ts              # TypeScript type definitions
```

### State Management
- **Background Image**: PNG image data URL
- **Text Layers**: Array of text layer objects with full styling properties
- **Selection**: Currently selected layer ID
- **History**: 20-step undo/redo stack
- **Canvas Size**: Dynamic sizing based on uploaded image

### Key Technologies
- **Konva.js**: Provides interactive canvas with drag, resize, and rotate capabilities
- **HTML5 Canvas**: Used for PNG export with proper text rendering
- **localStorage**: Persistent state management
- **FileReader API**: PNG file processing

## Setup and Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd image-text-composer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Usage Guide

### Getting Started
1. **Upload an Image**: Click the upload area or drag-and-drop a PNG file
2. **Add Text**: Click "Add Text Layer" to create your first text element
3. **Edit Text**: Select a layer and use the properties panel to customize
4. **Position**: Drag text layers or use arrow keys for precise positioning
5. **Export**: Click "Export as PNG" to download your final design

### Text Editing
- **Content**: Use the text area to edit content (supports line breaks)
- **Font**: Choose from 15+ web fonts
- **Size**: Use the slider or type values (8-200px)
- **Color**: Use color picker or enter hex values
- **Opacity**: Adjust transparency (0-100%)
- **Alignment**: Left, center, or right alignment
- **Position**: Manual X/Y coordinates or drag on canvas
- **Rotation**: 0-360 degree rotation

### Canvas Interactions
- **Selection**: Click on text layers to select
- **Dragging**: Drag selected layers to reposition
- **Resizing**: Use corner handles to resize
- **Rotation**: Use rotation handle to rotate
- **Snapping**: Automatic snap-to-center when near canvas center
- **Nudging**: Arrow keys for 1px moves, Shift+arrows for 10px moves

### Layer Management
- **Reordering**: Drag layers in the layer panel to change stacking order
- **Deletion**: Click the trash icon to remove layers
- **Selection**: Click layer names to select and edit

### History and Undo/Redo
- **Undo**: Ctrl+Z or click Undo button
- **Redo**: Ctrl+Y or click Redo button
- **History**: Visual indicator shows current position in history stack
- **Autosave**: Changes are automatically saved to browser storage

## Technology Choices and Trade-offs

### Konva.js vs Fabric.js
**Chosen**: Konva.js
- **Pros**: Better React integration, simpler API, good performance
- **Cons**: Less mature ecosystem than Fabric.js
- **Reason**: Better TypeScript support and React integration

### Canvas vs SVG
**Chosen**: Canvas (Konva.js)
- **Pros**: Better performance for complex interactions, easier export
- **Cons**: Less accessible, harder to style with CSS
- **Reason**: Export requirements and performance needs

### State Management
**Chosen**: React hooks + localStorage
- **Pros**: Simple, no external dependencies, built-in persistence
- **Cons**: Limited to browser storage, no cloud sync
- **Reason**: Single-page app requirements, simplicity

## Known Limitations

1. **Desktop Only**: Mobile/touch interactions not supported
2. **PNG Only**: No support for other image formats
3. **Browser Storage**: Limited by localStorage size (~5-10MB)
4. **Font Loading**: Google Fonts API integration with fallback to system fonts
5. **Export Quality**: Limited by browser canvas rendering
6. **Performance**: Large images may cause performance issues

## Future Enhancements

### Potential Bonus Features
- [x] Google Fonts API integration
- [ ] Custom font upload (TTF/OTF/WOFF)
- [ ] Multi-select with group transforms
- [ ] Text shadow effects
- [ ] Layer locking/unlocking
- [ ] Layer duplication
- [ ] Smart spacing hints
- [ ] Warp/curved text along paths

### Technical Improvements
- [ ] Web Workers for image processing
- [ ] Virtual scrolling for large layer lists
- [ ] Canvas optimization for better performance
- [ ] Progressive image loading
- [ ] Better error handling and validation

## Development

### Project Structure
```
image-text-composer/
├── app/                  # Next.js app directory
├── components/           # React components
├── types/               # TypeScript definitions
├── public/              # Static assets
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is created for the Adomate coding assignment. All rights reserved.
