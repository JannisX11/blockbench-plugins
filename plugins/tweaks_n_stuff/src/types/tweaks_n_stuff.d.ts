/// <reference types="blockbench-types"/>

declare global {
  interface ModelProject {
    close(force: boolean, unpin?: boolean): Promise<void>;
  }
}

export {};
