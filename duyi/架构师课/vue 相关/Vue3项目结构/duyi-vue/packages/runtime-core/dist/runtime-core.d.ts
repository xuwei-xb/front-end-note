export declare function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>

export declare function computed<T>(options: WriteableComputedOptions<T>):WriteableComputedRef<T>

export declare function computed<T>(getterOrOptions: ComputedGetter<T> | WriteableComputedOptions<T>) { 
    let getter;
    let setter;

    if (isFunction(getterOrOptions)) {
        getter = getterOrOptions;
        setter = NOOP
    }
    else { 
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }

    return new ComputedRefImpl(
    getter,
    setter,
    isFunction(getterOrOptions) || !getterOrOptions.set
    )
}

declare type ComputedGetter<T> = (ctx?: any) => T;

declare interface ComputedRef<T> extends WriteableComputedRef<T> { 
    readonly value: T;
}

declare type ComputedSetter<T> = (v: T) => void;

export declare function createRenderer<HostNode = any, HostElement = any>(options: RendererOptions<HostNode, HostElement>): {
    render: (vnode: any, container: any) => void;
};

declare type Dep = Set<ReactiveEffect>;

export declare function effect<T = any>(
fn: () => T,
options: ReactiveEffectOptions = {}
): ReactiveEffect<T> {
    // 如果fn是一个副作用函数，则直接取其raw属性
    if (isEffect(fn)) {
        fn = fn.raw;
    }
    // 创建一个副作用函数
    const effect = createReactiveEffect(fn, options);

    // 只有非lazy的情况，才会立即执行副作用函数
    if (!options.lazy) {
        effect();
    }

    // 将副作用函数作为返回值返回
    return effect;
}

export declare function h(type: any, props: any, children: any): {
    __v_isVnode: boolean;
    type: any;
    props: any;
    children: any;
    component: null;
    el: null;
    key: any;
    shapeFlags: number;
};

export declare function isRef<T>(r: Ref<T> | unknown): r is Ref<T>

export declare function isRef(r: any): r is Ref { 
    return Boolean(r && r.__v_isRef === true);
}

export declare function lis(arr: any): number[];

export declare function normalizeClass(value: unknown): string;

export declare const options: RendererOptions;

export declare function reactive<T extends object>(target: T): T;

export declare function reactive(target: object) {

    if (target && (target as Target)[ReactiveFlags.IS_READONLY]) { 
        return target;
    }

    return createReactiveObject(target, false, mutableHandlers);
}

declare interface ReactiveEffect<T = any> {
    (): T;
    deps: Array<Dep>;
    options: ReactiveEffectOptions;
    _isEffect: true;
    raw: () => T;
}

declare interface ReactiveEffectOptions {
    lazy?: boolean;
    scheduler?: (job: ReactiveEffect) => void;
}

declare const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly",
    RAW = "__v_raw",
    SKIP = "__v_skip",
}

declare interface Ref<T = any> { 
    value: T;
}

export declare function ref(value?: any): any { 
    return createRef(value);
}

declare interface RendererOptions<HostNode = any, HostElement = any> {
    patchProps(el: HostElement, key: string, prevValue: any, nextValue: any): void;
    insert(el: HostNode, parent: HostElement, anchor?: HostNode | null): void;
    createElement(type: string): any;
    createText(text: string): HostNode;
    createComment(text: string): HostNode;
    setText(node: HostNode, text: string): void;
    setElementText(node: HostElement, text: string): void;
}

export declare function shouldSetAsProps(el: any, key: string, value: any): boolean;

declare interface Target {
    [ReactiveFlags.SKIP]?: boolean;
    [ReactiveFlags.IS_REACTIVE]?: boolean;
    [ReactiveFlags.IS_READONLY]?: boolean;
    [ReactiveFlags.RAW]?: any;
}

export declare function watch(source: any, cb: any, options: WatchOptions): void;

declare interface WatchOptions<Immediate = boolean> extends WatchOptionsBase {
    immediate?: Immediate;
    deep?: boolean | number;
    once?: boolean;
}

declare interface WatchOptionsBase {
    flush?: 'pre' | 'post' | 'sync';
}

declare interface WriteableComputedOptions<T> { 
    get: ComputedGetter<T>;
    set: ComputedSetter<T>;
}

declare interface WriteableComputedRef<T> extends Ref<T> { 
    readonly effect: ReactiveEffect<T>
}

export { }
