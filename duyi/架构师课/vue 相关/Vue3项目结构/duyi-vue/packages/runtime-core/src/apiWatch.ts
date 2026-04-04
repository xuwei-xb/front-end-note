import { isObject,isArray,isFunction } from "@vue/shared";
import { isRef,effect } from "@vue/reactivity";

export interface WatchOptionsBase {
  flush?: 'pre' | 'post' | 'sync'
}

export interface WatchOptions<Immediate = boolean> extends WatchOptionsBase {
  immediate?: Immediate
  deep?: boolean | number
  once?: boolean
}

function traverse(value: unknown, seen?: Set<unknown>,) {
  seen = seen || new Set();
  // 如果要被读取的数据是原始值，或者已经被读取过了，那么直接返回
  if (!isObject(value) || seen.has(value)) { 
    return;
  }

  // 将数据添加到seen中，代表遍历的读取过了，避免循环引用引起的死循环问题
  seen.add(value);

  if (isRef(value)) {
    traverse(value.value, seen);
  }
  else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  }
  else { 
    for (const key in value) {
      traverse(value[key], seen);
    }
  }

  return value
}

export function watch(source:any, cb:any, options:WatchOptions) { 

  let getter;
  let oldValue:any, newValue:any;

  if (isFunction(source)) {
    getter = source;
  }
  else { 
    getter = () => traverse(source)
  }

  // cleanup用来存储用户注册的过期回调
  let cleanup:(() => void) | undefined;

  function onInvalidate(fn: () => void) { 
    cleanup = fn;
  }

  // 把之前写在scheduler函数中执行的代码，提取出来封装为job函数
  const job = () => { 
    // 得到新值
    newValue = effectFn();

    if (cleanup) { 
      cleanup()
    }

    cb(newValue, oldValue, onInvalidate);
    // 更新旧值
    oldValue = newValue;
  }

  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler: job
  })

  if (options.immediate) {
    job();
  }
  else { 
    oldValue = effectFn();
  }
}