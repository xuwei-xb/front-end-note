import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE } from 'shared/ReactSymbols';

import type { Key, ElementType, Ref, Props, ReactElement } from 'shared/ReactTypes';

const CreateReactElement = function (
  type: ElementType,

  key: Key,
  ref: Ref,
  props: Props
): ReactElement {
  const element: ReactElement = {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key,
    ref,
    props,
    __mark: 'React18源码学习',
  };

  return element;
};
function hasValidKey(config: any) {
  return config.key !== undefined;
}

function hasValidRef(config: any) {
  return config.ref !== undefined;
}
export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
  // console.log('REACT_ELEMENT_TYPE: ', REACT_ELEMENT_TYPE);
  let key: Key = null;
  const props: any = {};
  let ref: Ref = null!;

  for (const prop in config) {
    const val = config[prop];
    if (prop === 'key') {
      if (hasValidKey(config)) {
        key = '' + val;
      }
      continue;
    }
    if (prop === 'ref' && val !== undefined) {
      if (hasValidRef(config)) {
        ref = val;
      }
      continue;
    }
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }

  const maybeChildrenLength = maybeChildren.length;
  if (maybeChildrenLength) {
    // 将多余参数作为children
    if (maybeChildrenLength === 1) {
      props.children = maybeChildren[0];
    } else {
      props.children = maybeChildren;
    }
  }
  return CreateReactElement(type, key, ref, props);
};

export function isValidElement(object: any) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}

export const jsxDEV = (type: ElementType, config: any) => {
  let key: Key = null;
  const props: any = {};
  let ref: Ref = null!;

  for (const prop in config) {
    const val = config[prop];
    if (prop === 'key') {
      if (hasValidKey(config)) {
        key = '' + val;
      }
      continue;
    }
    if (prop === 'ref' && val !== undefined) {
      if (hasValidRef(config)) {
        ref = val;
      }
      continue;
    }

    if ({}.hasOwnProperty.call(config, prop)) {
      // <span title=""></span>
      props[prop] = val;
    }
  }
  return CreateReactElement(type, key, ref, props);
};

export const Fragment = REACT_FRAGMENT_TYPE;

