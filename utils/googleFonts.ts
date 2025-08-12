export interface GoogleFont {
  family: string;
  variants: string[];
  category: string;
}

export async function fetchGoogleFonts(): Promise<GoogleFont[]> {
  // Return a curated list of popular Google Fonts
  return [
    { family: 'Roboto', variants: ['300', '400', '500', '700'], category: 'sans-serif' },
    { family: 'Open Sans', variants: ['300', '400', '600', '700'], category: 'sans-serif' },
    { family: 'Lato', variants: ['300', '400', '700'], category: 'sans-serif' },
    { family: 'Montserrat', variants: ['300', '400', '500', '600', '700'], category: 'sans-serif' },
    { family: 'Source Sans Pro', variants: ['300', '400', '600', '700'], category: 'sans-serif' },
    { family: 'Poppins', variants: ['300', '400', '500', '600', '700'], category: 'sans-serif' },
    { family: 'Inter', variants: ['300', '400', '500', '600', '700'], category: 'sans-serif' },
    { family: 'Playfair Display', variants: ['400', '700'], category: 'serif' },
    { family: 'Merriweather', variants: ['300', '400', '700'], category: 'serif' },
    { family: 'Lora', variants: ['400', '700'], category: 'serif' },
    { family: 'Oswald', variants: ['300', '400', '500', '600', '700'], category: 'sans-serif' },
    { family: 'Raleway', variants: ['300', '400', '500', '600', '700'], category: 'sans-serif' },
    { family: 'PT Sans', variants: ['400', '700'], category: 'sans-serif' },
    { family: 'Nunito', variants: ['300', '400', '600', '700'], category: 'sans-serif' },
    { family: 'Ubuntu', variants: ['300', '400', '500', '700'], category: 'sans-serif' },
    { family: 'Work Sans', variants: ['300', '400', '500', '600', '700'], category: 'sans-serif' },
    { family: 'Quicksand', variants: ['300', '400', '500', '600', '700'], category: 'sans-serif' },
    { family: 'Josefin Sans', variants: ['300', '400', '600', '700'], category: 'sans-serif' },
    { family: 'Bebas Neue', variants: ['400'], category: 'sans-serif' },
    { family: 'Pacifico', variants: ['400'], category: 'handwriting' },
    { family: 'Dancing Script', variants: ['400', '700'], category: 'handwriting' },
    { family: 'Great Vibes', variants: ['400'], category: 'handwriting' },
    { family: 'Abril Fatface', variants: ['400'], category: 'display' },
    { family: 'Righteous', variants: ['400'], category: 'display' },
    { family: 'Bangers', variants: ['400'], category: 'display' },
    { family: 'Fredoka One', variants: ['400'], category: 'display' },
  ];
}

export function loadGoogleFont(fontFamily: string): void {
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}
