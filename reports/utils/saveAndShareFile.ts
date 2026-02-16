
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/** Force binary input to a real ArrayBuffer */
const toRealArrayBuffer = (data: ArrayBuffer | Uint8Array): ArrayBuffer => {
  if (data instanceof ArrayBuffer) return data;
  const out = new Uint8Array(data.byteLength);
  out.set(data);
  return out.buffer;
};

/** Encodes binary data to base64 safely for Capacitor bridge. */
const toBase64 = (data: ArrayBuffer | Uint8Array): string => {
  const ab = toRealArrayBuffer(data);
  const bytes = new Uint8Array(ab);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return window.btoa(binary);
};

export const saveAndShareFile = async (
  data: ArrayBuffer | Uint8Array,
  fileName: string,
  mimeType: string
) => {
  const buffer = toRealArrayBuffer(data);

  if (Capacitor.isNativePlatform()) {
    try {
      const base64Data = toBase64(buffer);
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
      } catch {
        alert(`Report saved to Documents: ${fileName}`);
      }
    } catch (err) {
      console.error('Filesystem Error:', err);
      alert('Unable to save report to device storage.');
    }
    return;
  }

  // Web fallback
  const blob = new Blob([buffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
