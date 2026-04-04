export declare function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>;

export declare function computed<T>(options: WriteableComputedOptions<T>): WriteableComputedRef<T>;

declare type ComputedGetter<T> = (ctx?: any) => T;

declare interface ComputedRef<T> extends WriteableComputedRef<T> {
    readonly value: T;
}

declare type ComputedSetter<T> = (v: T) => void;

declare type Dep = Set<ReactiveEffect>;

export declare function effect<T = any>(fn: () => T, options?: ReactiveEffectOptions): ReactiveEffect<T>;

export declare function isRef<T>(r: Ref<T> | unknown): r is Ref<T>;

export declare function reactive<T extends object>(target: T): T;

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

declare interface Ref<T = any> {
    value: T;
}

export declare function ref(value?: any): any;

declare interface WriteableComputedOptions<T> {
    get: ComputedGetter<T>;
    set: ComputedSetter<T>;
}

declare interface WriteableComputedRef<T> extends Ref<T> {
    readonly effect: ReactiveEffect<T>;
}

export { }
