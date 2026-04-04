export declare const extend: {
    <T extends {}, U>(target: T, source: U): T & U;
    <T extends {}, U, V>(target: T, source1: U, source2: V): T & U & V;
    <T extends {}, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
    (target: object, ...sources: any[]): any;
};

export declare const hasChanged: (value: any, oldValue: any) => boolean;

export declare const hasOwn: (val: object, key: string | symbol) => key is keyof typeof val;

export declare const isArray: (arg: any) => arg is any[];

export declare const isFunction: (val: unknown) => val is Function;

export declare const isIntegerKey: (key: unknown) => boolean;

export declare const isObject: (val: unknown) => val is Record<any, any>;

export declare const isOn: (key: string) => boolean;

export declare const isPromise: <T = any>(val: unknown) => val is Promise<T>;

export declare const isString: (val: unknown) => val is string;

export declare const isSymbol: (val: unknown) => val is symbol;

export declare const NOOP: () => void;

export declare const enum ShapeFlags {
    ELEMENT = 1,// 1
    FUNCTIONAL_COMPONENT = 2,// 2
    STATEFUL_COMPONENT = 4,// 4
    TEXT_CHILDREN = 8,// 8
    ARRAY_CHILDREN = 16,// 16
    SLOTS_CHILDREN = 32,// 32
    TELEPORT = 64,// 64
    SUSPENSE = 128,// 128
    COMPONENT_SHOULD_KEEP_ALIVE = 256,// 256
    COMPONENT_KEPT_ALIVE = 512,// 512
    COMPONENT = 6
}

export { }
