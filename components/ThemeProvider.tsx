// File: components/ThemeProvider.tsx
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// We omit the explicit import of ThemeProviderProps from next-themes/dist/types 
// to avoid type resolution issues, using a standard React wrapper approach instead.
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}