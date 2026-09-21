class SimplePromise {
  constructor(executor) {
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        setTimeout(() => {
          this.onFulfilledCallbacks.forEach(fn => fn());
        });
      }
    };

    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        setTimeout(() => {
          this.onRejectedCallbacks.forEach(fn => fn());
        });
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    // 参数可选处理
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    return new SimplePromise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        });
      } else if (this.status === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        });
      } else {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolve(x);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolve(x);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(callback) {
    return this.then(
      value => SimplePromise.resolve(callback()).then(() => value),
      reason => SimplePromise.resolve(callback()).then(() => { throw reason })
    );
  }

  /**
   * 方法	成功条件	失败条件	是否等待全部	结果格式	主要用途
   * all	全部成功	任一失败	是	原始值数组	并发请求，全部成功才继续
   * race	第一个完成	第一个失败	否	单个值	超时处理、竞速请求
   * allSettled	无（永远成功）	无	是	状态对象数组	批量操作，全部结果都要
   * any	任一成功	全部失败	否	单个值	多源数据，只要一个成功
   * resolve	创建成功Promise	-	-	包装的值	快速创建、值标准化
   * reject	-	创建失败Promise	-	拒绝原因	统一错误处理
   * */ 
  // all 方法：所有 promise 都成功才成功，否则失败
  static all(promises) {
    return new SimplePromise((resolve, reject) => {
      const results = [];
      let count = 0;
      const len = promises.length;

      if (len === 0) {
        return resolve(results);
      }

      promises.forEach((promise, index) => {
        SimplePromise.resolve(promise).then(
          value => {
            results[index] = value;
            count++;
            if (count === len) {
              resolve(results);
            }
          },
          reject
        );
      });
    });
  }
  // race 方法：第一个完成的 promise 状态决定了最终的状态
  static race(promises) {
    return new SimplePromise((resolve, reject) => {
      promises.forEach(promise => {
        SimplePromise.resolve(promise).then(
          resolve,
          reject
        );
      });
    });
  }
  // allSettled 方法：所有 promise 都有结果（成功或失败），才返回
  static allSettled(promises) {
    return new SimplePromise((resolve, reject) => {
      const results = [];
      let count = 0;
      const len = promises.length;

      if (len === 0) {
        return resolve(results);
      }

      promises.forEach((promise, index) => {
        SimplePromise.resolve(promise).then(
          value => {
            results[index] = { status: 'fulfilled', value };
            count++;
            if (count === len) {
              resolve(results);
            }
          },
          reason => {
            results[index] = { status: 'rejected', reason };
            count++;
            if (count === len) {
              resolve(results);
            }
          }
        );
      });
    });
  }
  // any 方法：只要有一个 promise 成功，就返回成功的结果，否则返回失败的结果
  static any(promises) {
    return new SimplePromise((resolve, reject) => {
      const errors = [];
      let count = 0;
      const len = promises.length;

      if (len === 0) {
        return reject(new AggregateError(errors, 'All promises were rejected'));
      }

      promises.forEach((promise, index) => {
        SimplePromise.resolve(promise).then(
          resolve,
          reason => {
            errors[index] = reason;
            count++;
            if (count === len) {
              reject(new AggregateError(errors, 'All promises were rejected'));
            }
          }
        );
      });
    });
  }
  // resolve 方法：返回一个成功的 promise
  static resolve(value) {
    if (value instanceof SimplePromise) return value;
    return new SimplePromise(resolve => resolve(value));
  }
  // reject 方法：返回一个失败的 promise
  static reject(reason) {
    return new SimplePromise((_, reject) => reject(reason));
  }
}