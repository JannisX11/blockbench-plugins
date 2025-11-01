import 'blockbench-types';
import * as THREE_ from 'three';

declare global {
    
    type BBAnimation = _Animation;

    // Fix THREE
    declare namespace THREE {
        export type * from 'three';
    }
    const THREE: typeof THREE_;

}
