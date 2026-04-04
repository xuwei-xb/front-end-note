export type Ref = { current: any } | ((instance: any) => void);
export type ElementType = any;
export type Key = any;
export type Props = {
  [key: string]: any;
  children?: any;
};

export type ReactElementType = ReactElement;
export interface ReactElement {
  $$typeof: symbol | number;
  type: ElementType;
  key: Key;
  props: Props;
  ref: Ref;
  __mark: 'React18源码学习';
}
export type Action<State> = State | ((prevState: State) => State);

