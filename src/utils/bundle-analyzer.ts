export interface BundleStats {
  totalSize: number;
  components: { name: string; size: number }[];
  suggestions: string[];
}

export function analyzeBundleSize(stats: any): BundleStats {
  const totalSize = stats.assets?.reduce(
    (sum: number, asset: any) => sum + asset.size,
    0
  ) || 0;

  const components = stats.assets?.map((asset: any) => ({
    name: asset.name,
    size: asset.size,
  })) || [];

  const suggestions: string[] = [];

  // Analyze and provide suggestions
  components.forEach((component: any) => {
    if (component.size > 100000) {
      suggestions.push(`Consider code-splitting ${component.name} (${(component.size / 1024).toFixed(2)}KB)`);
    }
  });

  if (totalSize > 500000) {
    suggestions.push('Bundle size exceeds 500KB. Consider lazy loading and code splitting.');
  }

  return {
    totalSize,
    components: components.sort((a: any, b: any) => b.size - a.size),
    suggestions,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

