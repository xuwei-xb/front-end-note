function LIS(nums) {
  if (nums.length === 0) return [];
  // 先取得第一项
  const results = [[nums[0]]];

  for (let i = 1; i < nums.length; i++) {
    const n = nums[i];
    _update(n);
  }

  // 负责比较更改results数组
  function _update(n) {
    for (let i = results.length - 1; i >= 0; i--) {
      const line = results[i];
      const tail = line[line.length - 1];

      if (n > tail) {
        results[i + 1] = [...line, n];
        return;
      }
    }
    // 循环结束之后还不能进行拼接，将第一项改为当前的n
    results[0] = [n];
  }

  console.log(results);

  return results[results.length - 1];
}

const list = [4, 5, 1, 2, 7, 3, 6, 9];
const result = LIS(list);
console.log(result); // [ 1, 2, 3, 6, 9 ]

// const list = [4, 5, 1, 6, 7, 3, 2, 9];
// const result = LIS(list);
// console.log(result); // [ 4, 5, 6, 7, 9 ]
