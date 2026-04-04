// 自定义守卫，`形参 is 类型`的语法结构
const isObject = (val) => {
    return val !== null && typeof val === 'object';
};
const isString = (val) => {
    return typeof val === 'string';
};
const isFunction = (val) => {
    return typeof val === 'function';
};
// 空函数
const NOOP = () => { };
const isArray = Array.isArray;
const isPromise = (val) => {
    return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
// 通过Object.is来判断两个值是否相等,框架可以避免一些特殊情况
// 比如NaN和NaN是相等的，而Object.is(NaN, NaN)是true
// +0和-0是不相等的，而Object.is(+0, -0)是false
const hasChanged = (value, oldValue) => {
    return !Object.is(value, oldValue);
};
const isSymbol = (val) => {
    return typeof val === 'symbol';
};
const extend = Object.assign;
// 判断一个key是否是一个合法的整数类型的字符串
const isIntegerKey = (key) => {
    return isString(key) && // 检查key是否是字符串
        key !== 'NaN' && // 确保key不是NaN字符串
        key[0] !== '-' && // 确保key不是负数
        '' + parseInt(key, 10) === key; // 确保key是一个可以被转换为整数的合法字符串
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, // 判断的对象
key // 判断的key
) => hasOwnProperty.call(val, key);
// 以on开头的正则
const onRE = /^on[^a-z]/;
// 判断字符串是否以on开头
const isOn = (key) => onRE.test(key);

export { NOOP, extend, hasChanged, hasOwn, isArray, isFunction, isIntegerKey, isObject, isOn, isPromise, isString, isSymbol };
