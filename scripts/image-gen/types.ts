export type ImageOutputFormat = 'png' | 'jpeg' | 'webp';

export interface BookImagePageSpec {
  /** File written under `public/books/<bookKey>/` (must match YAML `image` paths). */
  filename: string;
  /** Scene-specific prompt; combined with `stylePrefix` from the manifest. */
  prompt: string;
}

export interface BookImageManifest {
  bookKey: string;
  /** Passed to `images.generate({ model })`. */
  model: string;
  /** Prepended to every page prompt for a consistent look across the book. */
  stylePrefix: string;
  pages: BookImagePageSpec[];
  defaults?: {
    size?: 'auto' | '1024x1024' | '1536x1024' | '1024x1536';
    quality?: 'low' | 'medium' | 'high' | 'auto';
    output_format?: ImageOutputFormat;
    output_compression?: number;
    moderation?: 'low' | 'auto';
  };
}
