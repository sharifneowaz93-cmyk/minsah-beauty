/**
 * SafeText component for displaying text with encoding fixes
 * Universal component to handle UTF-8 encoding issues across the app
 */

'use client';

import { fixEncoding } from '@/lib/fixEncoding';

interface SafeTextProps {
  children: string | undefined | null;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  title?: string;
}

export default function SafeText({
  children,
  className = '',
  as: Component = 'span',
  title
}: SafeTextProps) {
  const fixedText = fixEncoding(children);
  const displayTitle = title || fixedText;

  return <Component className={className} title={displayTitle}>{fixedText}</Component>;
}

/**
 * Hook for fixing encoding in React components
 */
export function useFixedText(text: string | undefined | null): string {
  return fixEncoding(text);
}