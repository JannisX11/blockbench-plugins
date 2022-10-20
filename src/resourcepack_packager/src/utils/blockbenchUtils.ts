import parseDataUrl, { DataUrl } from 'parse-data-url';
import { Animation, Manifest } from '../types';

export function obtainBase64PackIcon(): Promise<string> {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    Screencam.cleanCanvas({ width: 100, height: 100 }, (dataUrl: string) => {
      const parsedDataUrl = parseDataUrl(dataUrl);

      if (!parsedDataUrl)
        reject(new Error('unable to parse screenshot data url'));

      resolve((parsedDataUrl as DataUrl).data);
    });
  });
}

export function buildManifest(
  description: string,
  pack_format: number
): Manifest {
  return {
    pack: {
      description,
      pack_format
    }
  };
}

export function compileJavaBlockCodec(
  enableCredits: boolean = false,
  credits: string = ''
) {
  // @ts-ignore
  const data = Codecs.java_block.compile({ raw: true });
  (data as { credit: string }).credit = enableCredits ? credits : '';
  return data;
}

export function createTextureAnimation(
  frametime: number,
  frames: Array<number>,
  interpolate: boolean
): Animation {
  return {
    animation: {
      frametime,
      frames,
      interpolate
    }
  };
}
