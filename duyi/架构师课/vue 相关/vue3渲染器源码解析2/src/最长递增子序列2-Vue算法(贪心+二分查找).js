// 注意现在返回的是数组下标
function LIS(arr) {
  // 用于记录每个位置的前驱索引，以便最后重建序列
  const p = arr.slice();
  // 存储当前找到的最长递增子序列的索引
  const result = [0];
  // 声明循环变量和辅助变量
  let i, j, u, v, c;
  // 获取输入数组的长度
  const len = arr.length;
  // 遍历输入数组
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    // 忽略值为 0 的元素（Vue源码中的diff算法对0有特定处理）
    if (arrI !== 0) {
      // 获取当前最长序列中最后一个元素的索引
      j = result[result.length - 1];
      // 贪心算法部分：如果当前元素大于当前最长序列的最后一个元素，直接添加
      if (arr[j] < arrI) {
        // 记录当前元素的前驱索引为 j
        p[i] = j;
        // 将当前元素的索引添加到 result 中
        result.push(i);
        continue;
      }
      // 二分查找部分：在 result 中寻找第一个大于等于 arrI 的元素位置
      u = 0;
      v = result.length - 1;
      while (u < v) {
        // 取中间位置
        c = ((u + v) / 2) | 0;
        // 比较中间位置的值与当前值
        if (arr[result[c]] < arrI) {
          // 如果中间值小于当前值，搜索区间缩小到 [c + 1, v]
          u = c + 1;
        } else {
          // 否则，搜索区间缩小到 [u, c]
          v = c;
        }
      }
      // 如果找到的值大于当前值，进行替换
      if (arrI < arr[result[u]]) {
        // 如果 u 不为 0，记录前驱索引
        if (u > 0) {
          p[i] = result[u - 1];
        }
        // 更新 result 中的位置 u 为当前索引 i
        result[u] = i;
      }
    }
  }
  // 重建最长递增子序列
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    // 将索引替换为对应的前驱索引
    result[u] = v;
    v = p[v];
  }
  // 返回最长递增子序列的索引数组
  return result;
}

const list = [4, 5, 1, 2, 7, 3, 6, 9];
const result = LIS(list);
console.log(result); // 返回的是数组下标：[ 2, 3, 5, 6, 7 ]

// const list = [4, 5, 1, 6, 7, 3, 2, 9];
// const result = LIS(list);
// console.log(result); // 返回的是数组下标：[ 0, 1, 3, 4, 7 ]
