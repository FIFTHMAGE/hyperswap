export interface OGImageOptions {
  title: string;
  subtitle?: string;
  stats?: { label: string; value: string }[];
  gradient?: [string, string];
}

export function generateOGImageURL(options: OGImageOptions): string {
  const params = new URLSearchParams();
  
  params.append('title', options.title);
  
  if (options.subtitle) {
    params.append('subtitle', options.subtitle);
  }
  
  if (options.stats) {
    params.append('stats', JSON.stringify(options.stats));
  }
  
  if (options.gradient) {
    params.append('gradient', options.gradient.join(','));
  }

  return `/api/og?${params.toString()}`;
}

export function getOGMetaTags(imageUrl: string, title: string, description: string) {
  return {
    'og:title': title,
    'og:description': description,
    'og:image': imageUrl,
    'og:type': 'website',
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': imageUrl,
  };
}

