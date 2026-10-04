import 'blockbench-types';
import * as THREE_ from 'three';

declare global {
    
    // Fix THREE
    declare namespace THREE {
        export type * from 'three';
    }
    const THREE: typeof THREE_;

    interface Math {
        roundTo(num: number, places: number): number;
    }
}
