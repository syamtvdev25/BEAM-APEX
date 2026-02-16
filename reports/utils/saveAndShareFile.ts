
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/**
 * Encodes binary data to base64 safely for Capacitor bridge.
 */
const toBase64 = (data: ArrayBuffer | Uint8Array): string => {
  let binary = '';
  const bytes = new Uint8Array(data);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

/**
 * Handles the final step of export: Saving or sharing the file.
 */
export const saveAndShareFile = async (data: ArrayBuffer | Uint8Array, fileName: string, mimeType: string) => {
  if (Capacitor.isNativePlatform()) {
    try {
      const base64Data = toBase64(data);
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
      });

      try {
        await Share.share({
          title: `Report: ${fileName}`,
          url: savedFile.uri,
          dialogTitle: 'Share or Save Report',
        });
      } catch (shareErr) {
        // Fallback if sharing is cancelled or fails
        alert(`Report saved to Documents: ${fileName}`);
      }
    } catch (err) {
      console.error('Filesystem Error:', err);
      alert('Unable to save report to device storage.');
    }
  } else {
    // Web Fallback
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
