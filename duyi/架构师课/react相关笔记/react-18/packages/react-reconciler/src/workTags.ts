export type WorkTag =
  | typeof FunctionComponent
  | typeof HostRoot
  | typeof HostComponent
  | typeof HostText
  | typeof Fragment;
export const FunctionComponent = 0;
// div id=aap
export const HostRoot = 3;

export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;

