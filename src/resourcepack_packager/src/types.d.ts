export type ModelType = 'block' | 'item';

export interface ResourcepackOptions {
  resourcepackVersion: string;
  resourcepackName: string;
  resourcepackDescription: string;
  enableResourcepackCredits: boolean;
  resourcepackCredits: string;
  modelType: ModelType;
  namespace: string;
  modelId: string;
  enableAnimation: boolean;
  frameTime: number;
  frameStart: number;
  interpolate: boolean;
}

export interface Manifest {
  pack: {
    description: string;
    pack_format: number;
  };
}

export interface Animation {
  animation: {
    frametime: number;
    frames: Array<number>;
    interpolate: boolean;
  };
}
