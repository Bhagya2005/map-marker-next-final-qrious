export async function takeMapSnapshot(mapElement: HTMLElement): Promise<string> {
  try {
    const canvas = await import('html2canvas').then(mod => mod.default);
    const canvasElement = await canvas(mapElement, {
      useCORS: true,
      logging: false,
      backgroundColor: '#18181b',
    });
    return canvasElement.toDataURL('image/png');
  } catch (error) {
    console.error('Snapshot failed:', error);
    throw new Error('Failed to capture map snapshot');
  }
}

export function downloadSnapshot(dataUrl: string, filename: string = 'map-snapshot.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
