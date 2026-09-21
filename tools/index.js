/**
 * @description 两数之和: 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
// var twoSum = function(nums, target) {
//   let map =  [];
//   for(let i = 0; i < nums.length; i++) {
//     let j = target - nums[i];
//     if(map.includes(j)) {
//       return [map.indexOf(j), i];
//     }
//     map.push(nums[i]);
//   }
//   let map = new Map();
//   for(let i = 0; i < nums.length; i++) {
//     let j = target - nums[i];
//     if(map.has(j)) {
//       return [map.get(j), i];
//     }
//     map.set(nums[i], i);
//   }
// };

// console.log(twoSum([0, 7, 11, 0], 0));

/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
// var addTwoNumbers = function(l1, l2) {
//     let len = Math.max(l1.length, l2.length)
//     let car = 0
//     let res = []
//     for(let i=0; i< len; i++) {
//       let sum = (l1[i] || 0) + (l2[i] || 0) + car
//       car = Math.floor(sum / 10)
//       sum = sum % 10
//       res.push(sum)
//     }
//     if(res[res.length - 1] === 0) {
//       res.push(1)
//     }
//     return res
// };
// console.log(addTwoNumbers([2,4,3], [5,6,4]))

/**
 * @param {string} s
 * @return {number}
 */
// var lengthOfLongestSubstring = function(s) {
//   let max = 0
//   let start = 0
//   let end = 0
//   let map = new Map()
//   while(end < s.length) {
//     if(map.has(s[end])) {
//       start = Math.max(start, map.get(s[end]) + 1)
//     }
//     map.set(s[end], end)
//     max = Math.max(max, end - start + 1)
//     end++
//   }
//   return max
// };
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
// var findMedianSortedArrays = function(nums1, nums2) {
//   let nums = nums1.concat(nums2).sort((a, b) => a - b);
//   let len = nums.length;
//   if(len % 2 === 0) {
//     return (nums[len / 2 - 1] + nums[len / 2]) / 2;
//   } else {
//     return nums[Math.floor(len / 2)];
//   }
// };

/**
 * @param {string} s
 * @return {string}
 */
// var longestPalindrome = function(s) {
//   let max = 0
//   let start = 0
//   let end = 0
//   for(let i = 0; i < s.length; i++) {
//     let len1 = expandAroundCenter(s, i, i)
//     let len2 = expandAroundCenter(s, i, i + 1)
//     let len = Math.max(len1, len2)
//     if(len > max) {
//       max = len
//       start = i - Math.floor((len - 1) / 2)
//       end = i + Math.floor(len / 2)
//     }
//   }
//   return s.substring(start, end + 1)
// };
// let expandAroundCenter = function(s, left, right) {
//   let l = left
//   let r = right
//   while(l >= 0 && r < s.length && s[l] === s[r]) {
//     l--
//     r++
//   }
//   return r - l - 1
// }

/**
 * @param {number} x
 * @return {number}
 * @description: 给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。
如果反转后整数超过 32 位的有符号整数的范围 [−231,  231 − 1] ，就返回 0
 */
// var reverse = function(x) {
//   let max = 214748364
//   let min = -214748364
//   let res = 0
//   while(x!=0) {
//     let pop = x % 10
//     if(res > max || (res === max && pop > 7)) {
//       return 0
//     }
//     if(res < min || (res === min && pop < -8)) {
//       return 0
//     }
//     res = res * 10 + pop
//     x = Math.trunc(x / 10)
//   }
//   return res
// };
/**
 * @param {number} x
 * @return {boolean}
 */
// var isPalindrome = function(x) {
//   let str = x.toString()
//   let left = 0
//   let right = str.length - 1
//   while(left < right) {
//     if(str[left] !== str[right]) {
//       return false
//     }
//     left++
//     right--
//   }
//   return true
// };
/**
 * @description: 盛水对多的容器：
 * 给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。
 * 找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
 * 返回容器可以储存的最大水量。
 * @param {number[]} height
 * @return {number}
 * */
// var maxArea = function(height) {
//   let left = 0
//   let right = height.length - 1
//   let area = 0
//   while(left < right) {
//     area = Math.max(area, Math.min(height[left], height[right]) * (right - left))
//     if(height[left] < height[right]) {
//       left++
//     } else {
//       right--
//     }
//   }
//   return area
// };
/**
 * 四数之和 JavaScript 解决方案
 * 使用排序 + 双指针法
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
// var fourSum = function (nums, target) {
//   const result = [];
//   const n = nums.length;

//   // 数组长度不足4，直接返回空结果
//   if (n < 4) {
//     return result;
//   }

//   // 先对数组进行排序
//   nums.sort((a, b) => a - b);
//   // 固定第一个数 nums[i]
//   for (let i = 0; i < n - 3; i++) {
//     // 剪枝1：跳过重复的第一个数
//     if (i > 0 && nums[i] === nums[i - 1]) {
//       continue;
//     }
//     // 剪枝2：如果当前最小的和都大于target，后续不可能有解
//     if (nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 3] > target) {
//       break;
//     }
//     // 剪枝3：如果当前最大的和都小于target，当前i不可能有解，尝试下一个i
//     if (nums[i] + nums[n - 3] + nums[n - 2] + nums[n - 1] < target) {
//       continue;
//     }
//     // 固定第二个数 nums[j]
//     for (let j = i + 1; j < n - 2; j++) {
//       // 剪枝4：跳过重复的第二个数
//       if (j > i + 1 && nums[j] === nums[j - 1]) {
//         continue;
//       }
//       // 剪枝5：如果当前最小的和都大于target，后续不可能有解
//       if (nums[i] + nums[j] + nums[j + 1] + nums[j + 2] > target) {
//         break;
//       }
//       // 剪枝6：如果当前最大的和都小于target，当前j不可能有解，尝试下一个j
//       if (nums[i] + nums[j] + nums[n - 2] + nums[n - 1] < target) {
//         continue;
//       }
//       // 双指针查找后两个数
//       let left = j + 1;
//       let right = n - 1;
//       while (left < right) {
//         const currentSum = nums[i] + nums[j] + nums[left] + nums[right];
//         if (currentSum === target) {
//           result.push([nums[i], nums[j], nums[left], nums[right]]);
//           // 跳过重复的 left
//           while (left < right && nums[left] === nums[left + 1]) {
//             left++;
//           }
//           // 跳过重复的 right
//           while (left < right && nums[right] === nums[right - 1]) {
//             right--;
//           }
//           left++;
//           right--;
//         } else if (currentSum < target) {
//           left++;
//         } else { // currentSum > target
//           right--;
//         }
//       }
//     }
//   }

//   return result;
// };

/**
 * @param {string} s
 * @return {boolean}
 */
// var isValid = function (s) {
//   const stack = [];
//   // 建立映射
//   const map = {
//     ")": "(",
//     "}": "{",
//     "]": "[",
//   };
//   for (let char of s) {
//     if (char in map) {
//       // 取出栈顶元素
//       let top = stack.pop() || "#";
//       // 如果栈顶元素与当前字符不匹配，返回 false
//       if (map[char] !== top) {
//         return false;
//       }
//     } else {
//       // 如果当前字符不是左括号，压入栈中
//       stack.push(char);
//     }
//   }
//   // 如果栈为空，说明所有括号都匹配，返回 true
//   return stack.length === 0;
// };
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */

//  function ListNode(val, next) {
//    this.val = val === undefined ? 0 : val;
//    this.next = next === undefined ? null : next;
//  }
//  var mergeTwoLists = function (list1, list2) {
//   // const dummy = new ListNode(0);
//   // let cur = dummy;
//   // while(list1 && list2) {
//   //   if(list1.val <= list2.val) {
//   //     cur.next = list1;
//   //     list1 = list1.next;
//   //   } else {
//   //     cur.next = list2;
//   //     list2 = list2.next;
//   //   }
//   //   cur = cur.next;
//   // }
//   // cur.next = list1 || list2;
//   // return dummy.next;
//   if(!list1) return list2;
//   if(!list2) return list1;
//   if(list1.val <= list2.val) {
//     list1.next = mergeTwoLists(list1.next, list2);
//     return list1;
//   } else {
//     list2.next = mergeTwoLists(list1, list2.next);
//     return list2;
//   }
//  };

// function mergeKListsDivide(lists) {
//     // 边界条件处理
//     if (!lists || lists.length === 0) return null;

//     // 合并两个有序链表的基础操作
//     function mergeTwoLists(l1, l2) {
//         const dummy = new ListNode(0);  // 哨兵节点，简化代码
//         let current = dummy;

//         // 比较并选择较小的节点
//         while (l1 && l2) {
//             if (l1.val < l2.val) {
//                 current.next = l1;
//                 l1 = l1.next;
//             } else {
//                 current.next = l2;
//                 l2 = l2.next;
//             }
//             current = current.next;
//         }

//         // 连接剩余的链表部分
//         current.next = l1 || l2;
//         return dummy.next;
//     }

//     // 分治合并的核心递归函数
//     function merge(lists, left, right) {
//         // 基础情况：只剩一个链表，直接返回
//         if (left >= right) {
//             return lists[left];
//         }

//         // 找到中间点，分割区间
//         const mid = Math.floor((left + right) / 2);

//         // 递归合并左半部分
//         const leftList = merge(lists, left, mid);

//         // 递归合并右半部分
//         const rightList = merge(lists, mid + 1, right);

//         // 合并两个已排序的子链表
//         return mergeTwoLists(leftList, rightList);
//     }

//     // 启动分治合并
//     return merge(lists, 0, lists.length - 1);
// }

/**
 * @param {number} dividend
 * @param {number} divisor
 * @return {number}
 */
// const MAX = 2147483647, MIN = -2147483648;
// var divide = function(dividend, divisor) {
//   // 处理特殊情况
//   if(dividend == MIN && divisor == -1)
//       return MAX;
//   // 取绝对值，处理负数情况
//   let a = Math.abs(dividend), b = Math.abs(divisor), res = 0;
//   // 不断减去除数，直到被除数小于除数
//   for(let i=31;i>=0;i--){
//       if((a>>>i)>=b){
//           // 1<<31 = -2147483648，需特殊处理
//           if(i==31){
//               a -= MAX;
//               a -= 1;
//               res -= MIN;
//           } else{
//               a -= b<<i;
//               res += 1<<i;
//           }
//       }
//   }
//   return (dividend > 0) == (divisor > 0) ? res : -res;
// };

/**
 * @param {string} s
 * @return {number}
 * @description: 最长有效括号: 当前右括号前是右括号，需要跳过前面已经匹配的长度，检查再前面是否是左括号
 */
// var longestValidParentheses = function (s) {
//     let maxLen = 0;
//     let stack = [-1];
//     for (let i = 0; i < s.length; i++) {
//         if(s[i] === '(') {
//             stack.push(i);
//         } else {
//             stack.pop();
//             if(stack.length === 0) {
//                 stack.push(i);
//             } else {
//                 maxLen = Math.max(maxLen, i - stack[stack.length - 1]);
//             }
//         }
//     }
//     return maxLen;
// };
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
// var search = function (nums, target) {
//   let left = 0,
//     right = nums.length - 1;
//     if (nums.length === 0) return -1;
//     if (nums[left] === target) return left;
//     if (nums[right] === target) return right;

//   while (left <= right) {
//     const mid = Math.floor(left + (right - left) / 2);
//     // 找到目标值
//     if (nums[mid] === target) {
//       return mid;
//     }
//     // 判断左半部分是否有序
//     if (nums[left] <= nums[mid]) {
//       // 目标在左半有序区间
//       if (nums[left] <= target && target < nums[mid]) {
//         right = mid - 1;
//       } else {
//         left = mid + 1;
//       }
//     }
//     // 右半部分有序
//     else {
//       // 目标在右半有序区间
//       if (nums[mid] < target && target <= nums[right]) {
//         left = mid + 1;
//       } else {
//         right = mid - 1;
//       }
//     }
//   }
//   return -1;
// };
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
// var searchRange = function(nums, target) {
//   let left = 0,
//     right = nums.length - 1;
//   let start = -1,
//     end = -1;
//   if(nums.length === 0) return [start, end];
//   if(nums[left] === target) start = left;
//   if(nums[right] === target) end = right;
//   if(nums[left] > target || nums[right] < target) return [start, end];

//   while (left <= right) {
//     const mid = Math.floor(left + (right - left) / 2);
//     // 找到目标值
//     if (nums[mid] === target) {
//       start = mid;
//       end = mid;
//       while(start >= 0 && nums[start] === target) start--;
//       while(end < nums.length && nums[end] === target) end++;
//       return [start + 1, end - 1];
//     }
//     // 判断左半部分是否有序
//     if (nums[left] <= nums[mid]) {
//       // 目标在左半有序区间
//       if (nums[left] <= target && target < nums[mid]) {
//         right = mid - 1;
//       } else {
//         left = mid + 1;
//       }
//     }
//     // 右半部分有序
//     else {
//       // 目标在右半有序区间
//       if (nums[mid] < target && target <= nums[right]) {
//         left = mid + 1;
//       } else {
//         right = mid - 1;
//       }
//     }
//   }
//   return [start, end];
// };

/**
 * @param {character[][]} board
 * @return {boolean}
 */
// var isValidSudoku = function (board) {
//   // 初始化行、列、宫的记录数组
//   const rows = Array.from({ length: 9 }, () => new Array(9).fill(0));
//   const cols = Array.from({ length: 9 }, () => new Array(9).fill(0));
//   const boxes = Array.from({ length: 9 }, () => new Array(9).fill(0));

//   for (let i = 0; i < 9; i++) {
//     for (let j = 0; j < 9; j++) {
//       const num = board[i][j];

//       // 跳过空格
//       if (num === ".") continue;

//       // 将字符 '1'-'9' 转换为索引 0-8
//       const index = num.charCodeAt(0) - "1".charCodeAt(0);

//       // 计算 3x3 宫的索引
//       const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);

//       // 检查数字是否已在行、列、宫中出现过
//       if (rows[i][index] || cols[j][index] || boxes[boxIndex][index]) {
//         return false;
//       }

//       // 标记数字已在对应行、列、宫中出现过
//       rows[i][index] = 1;
//       cols[j][index] = 1;
//       boxes[boxIndex][index] = 1;
//     }
//   }

//   return true;
// };

/**
 * @param {number} n
 * @return {string}
 */
// var countAndSay = function (n) {
//   if (n === 1) return "1";

//   let result = "1";

//   for (let i = 2; i <= n; i++) {
//     result = rleEncode(result);
//   }

//   return result;
// };
// function rleEncode(s) {
//   if (!s) return "";

//   let result = "";
//   let count = 1;

//   for (let i = 1; i < s.length; i++) {
//     if (s[i] === s[i - 1]) {
//       count++;
//     } else {
//       result += count + s[i - 1];
//       count = 1;
//     }
//   }

//   // 处理最后一组字符
//   result += count + s[s.length - 1];

//   return result;
// }

/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
// var combinationSum = function (candidates, target) {
//   const result = [];
//   // 先排序，便于剪枝
//   candidates.sort((a, b) => a - b);
//   const backtrack = (start, path, sum) => {
//     // 找到合法组合
//     if (sum === target) {
//       result.push([...path]);
//       return;
//     }
//     // 超过目标值，剪枝
//     if (sum > target) {
//       return;
//     }
//     // 从 start 开始，避免重复组合
//     for (let i = start; i < candidates.length; i++) {
//       const num = candidates[i];
//       // 剪枝：如果当前数字已经使和超过 target，后续更大数字更不用考虑
//       if (sum + num > target) {
//         break;
//       }
//       // 做选择d
//       path.push(num);
//       // 递归：注意传入 i 而不是 i+1，因为可以重复使用当前数字
//       backtrack(i, path, sum + num);
//       // 撤销选择
//       path.pop();
//     }
//   };
//   backtrack(0, [], 0);
//   return result;
// };
/**
 * @param {number[]} nums
 * @return {number}
 */
// var firstMissingPositive = function (nums) {
//   const n = nums.length;

//   // 第一步：将每个正整数k放到正确的位置(k-1)上
//   for (let i = 0; i < n; i++) {
//     // 当数字在[1, n]范围内，且不在正确位置时，交换到正确位置
//     while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
//       // 交换nums[i]和nums[nums[i]-1]
//       // 注意：这里必须用临时变量，因为nums[i]会被改变
//       [nums[i], nums[nums[i] - 1]] = [nums[nums[i] - 1], nums[i]];
//     }
//   }

//   // 第二步：遍历数组，找到第一个不满足nums[i] = i + 1的位置
//   for (let i = 0; i < n; i++) {
//     if (nums[i] !== i + 1) {
//       return i + 1;
//     }
//   }

//   // 如果所有位置都正确，缺失的是n+1
//   return n + 1;
// };
// Object.prototype[Symbol.iterator] = function () {
//   return Object.values(this)[Symbol.iterator]()
//   return yield* Object.values(this)
// }
// const [a, b] = { a: 2, b: 4}
// console.log(a, b)
/**
 * @param {number[]} height
 * @return {number}
 */
// var trap = function (height) {
//     let left = 0;
//     let right = height.length - 1;
//     let leftMax = 0;
//     let rightMax = 0;
//     let water = 0;

//     while (left < right) {
//         if (height[left] < height[right]) {
//             // 左侧是短板，由 leftMax 决定水位
//             if (height[left] >= leftMax) {
//                 leftMax = height[left];
//             } else {
//                 water += leftMax - height[left];
//             }
//             left++;
//         } else {
//             // 右侧是短板，由 rightMax 决定水位
//             if (height[right] >= rightMax) {
//                 rightMax = height[right];
//             } else {
//                 water += rightMax - height[right];
//             }
//             right--;
//         }
//     }

//     return water;
// };
/**
 * @param {number[]} nums
 * @return {number[][]}
 * @description: 全排列
 */
// var permute = function (nums) {
//   let res = [];
//   const backtrack = (start) => {
//     // 终止条件
//     if(start === nums.length) {
//         return res.push([...nums]);
//     }
//     for(let i = start; i < nums.length; i++) {
//         // 做选择
//         [nums[start], nums[i]] = [nums[i], nums[start]];
//         // 递归
//         backtrack(start + 1);
//         // 撤销选择
//         [nums[start], nums[i]] = [nums[i], nums[start]];
//     }
//   };
//   backtrack(0);
//   return res;
// };
// console.log(permute([1, 2, 3]));
// var permuteUnique = function(nums) {
//   const result = [];
//   const backtrack = (start) => {
//     if (start === nums.length) {
//       result.push([...nums]);
//       return;
//     }
//     const set = new Set();
//     for (let i = start; i < nums.length; i++) {
//       if (set.has(nums[i])) continue;
//       set.add(nums[i]);
//       [nums[start], nums[i]] = [nums[i], nums[start]];
//       backtrack(start + 1);
//       [nums[start], nums[i]] = [nums[i], nums[start]];
//     }
//   }
//   backtrack(0)
//   return result;
// };

/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 * @description: 旋转图像 先转置再反转
 */
// var rotate = function (matrix) {
//   const n = matrix.length;
//   // 转置
//   for (let i = 0; i < n; i++) {
//     for (let j = i + 1; j < n; j++) {
//       [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
//     }
//   }

//   // 反转每一行
//   for (let i = 0; i < n; i++) {
//     matrix[i].reverse();
//   }
// };
/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
// var myPow = function (x, n) {
//     if (n === 0) return 1;
//     if(n === 1) return x;
//     if (n < 0) return myPow(1 / x, -n);
//     const half = myPow(x, Math.floor(n / 2));

//     if (n % 2 === 0) {
//         return half * half;
//     } else {
//         return half * half * x;
//     }
// };

/**
 * @param {number} n
 * @return {string[][]}
 */
// var solveNQueens = function(n) {
//     const result = [];
    
//     // 记录列、主对角线、副对角线的占用情况
//     const cols = new Set();           // 列占用
//     const diag1 = new Set();          // 主对角线占用 (row - col)
//     const diag2 = new Set();          // 副对角线占用 (row + col)
    
//     // 当前棋盘状态，每行一个字符串
//     const board = new Array(n).fill().map(() => new Array(n).fill('.'));
    
//     /** 
//      * 回溯放置皇后
//      * @param {number} row - 当前行号
//      */
//     const backtrack = (row) => {
//         // 基础情况：所有皇后都放置完成
//         if (row === n) {
//             result.push(board.map(row => row.join('')));
//             return;
//         }
        
//         // 尝试在当前行的每一列放置皇后
//         for (let col = 0; col < n; col++) {
//             // 检查当前位置是否可放置
//             const d1 = row - col;  // 主对角线索引
//             const d2 = row + col;  // 副对角线索引
            
//             if (cols.has(col) || diag1.has(d1) || diag2.has(d2)) {
//                 continue;  // 冲突，跳过
//             }
            
//             // 放置皇后
//             board[row][col] = 'Q';
//             cols.add(col);
//             diag1.add(d1);
//             diag2.add(d2);
            
//             // 递归处理下一行
//             backtrack(row + 1);
            
//             // 回溯：撤销当前选择
//             board[row][col] = '.';
//             cols.delete(col);
//             diag1.delete(d1);
//             diag2.delete(d2);
//         }
//     };
    
//     backtrack(0);
//     return result;
// };
/**
 * @param {number[]} nums
 * @return {number}
 */
// var maxSubArray = function (nums) {
//     if (!nums || nums.length === 0) return 0;

//     let maxSum = nums[0];      // 全局最大值
//     let currentSum = nums[0];  // 当前连续子数组的最大和

//     for (let i = 1; i < nums.length; i++) {
//         // 状态转移：要么重新开始，要么累加
//         currentSum = Math.max(nums[i], currentSum + nums[i]);
//         // 更新全局最大值
//         maxSum = Math.max(maxSum, currentSum);
//     }

//     return maxSum;
// };
/**
 * @param {number} n
 * @return {number}
 */
// var totalNQueens = function (n) {
//     let count = 0;
//     const backtrack = (row, cols, diag1, diag2) => {
//         if (row === n) {
//             count++;
//             return;
//         }
//         for (let col = 0; col < n; col++) {
//             const d1 = row - col;
//             const d2 = row + col;
//             if (cols.has(col) || diag1.has(d1) || diag2.has(d2)) {
//                 continue;
//             }
//             backtrack(row + 1, cols.add(col), diag1.add(d1), diag2.add(d2));
//             // 撤销选择
//             cols.delete(col);
//             diag1.delete(d1);
//             diag2.delete(d2);
//         }
//     };
    
//     backtrack(0, new Set(), new Set(), new Set());
//     return count;
// };

// // 测试
// console.log(solveNQueens(4));

/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
// var spiralOrder = function(matrix) {
//     if (!matrix || matrix.length === 0) return [];
    
//     const result = [];
//     let top = 0, bottom = matrix.length - 1;
//     let left = 0, right = matrix[0].length - 1;
    
//     while (top <= bottom && left <= right) {
//         // 1. 从左到右遍历上边界
//         for (let i = left; i <= right; i++) {
//             result.push(matrix[top][i]);
//         }
//         top++; // 上边界下移
        
//         // 2. 从上到下遍历右边界
//         for (let i = top; i <= bottom; i++) {
//             result.push(matrix[i][right]);
//         }
//         right--; // 右边界左移
        
//         // 3. 从右到左遍历下边界（注意检查是否越界）
//         if (top <= bottom) {
//             for (let i = right; i >= left; i--) {
//                 result.push(matrix[bottom][i]);
//             }
//             bottom--; // 下边界上移
//         }
         
//         // 4. 从下到上遍历左边界（注意检查是否越界）
//         if (left <= right) {
//             for (let i = bottom; i >= top; i--) {
//                 result.push(matrix[i][left]);
//             }
//             left++; // 左边界右移
//         }
//     }
    
//     return result;
// };
/**
 * @param {number[]} nums
 * @return {boolean}
 */
// var canJump = function (nums) {
//     const n = nums.length;
//     if (n <= 1) return true;

//     let maxReach = 0; // 能到达的最远位置

//     for (let i = 0; i < n; i++) {
//         // 如果当前位置已经超出了能到达的范围，说明无法到达
//         if (i > maxReach) {
//             return false;
//         }

//         // 更新能到达的最远位置
//         maxReach = Math.max(maxReach, i + nums[i]);

//         // 如果已经能到达最后一个位置
//         if (maxReach >= n - 1) {
//             return true;
//         }
//     }

//     return true;
// };

/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
// function uniquePathsWithObstacles(obstacleGrid) {
//     const m = obstacleGrid.length;
//     const n = obstacleGrid[0].length;
    
//     // 如果起点或终点是障碍物，无法到达
//     if (obstacleGrid[0][0] === 1 || obstacleGrid[m-1][n-1] === 1) {
//         return 0;
//     }
    
//     // 使用一维数组优化空间，dp[j] 表示第 j 列的路径数
//     const dp = new Array(n).fill(0);
//     dp[0] = 1; // 起点
    
//     for (let i = 0; i < m; i++) {
//         for (let j = 0; j < n; j++) {
//             if (obstacleGrid[i][j] === 1) {
//                 dp[j] = 0; // 障碍物位置路径数为 0
//             } else if (j > 0) {
//                 dp[j] = dp[j] + dp[j-1]; // 上方 + 左方
//             }
//             // j === 0 时，dp[j] 保持不变（只能从上方到达）
//         }
//     }
    
//     return dp[n-1];
// }
/**
 * @param {number[][]} grid
 * @return {number}
 */
// var minPathSum = function(grid) {
//     const m = grid.length;
//     const n = grid[0].length;
    
//     // 使用一维数组优化空间
//     const dp = new Array(n).fill(0);
    
//     for (let i = 0; i < m; i++) {
//         for (let j = 0; j < n; j++) {
//             if (i === 0 && j === 0) {
//                 // 起点
//                 dp[j] = grid[i][j];
//             } else if (i === 0) {
//                 // 第一行，只能从左边来
//                 dp[j] = dp[j - 1] + grid[i][j];
//             } else if (j === 0) {
//                 // 第一列，只能从上边来
//                 dp[j] = dp[j] + grid[i][j];
//             } else {
//                 // 其他位置，取上方和左方的最小值
//                 dp[j] = Math.min(dp[j - 1], dp[j]) + grid[i][j];
//             }
//         }
//     }
    
//     return dp[n - 1];
// };
/**
 * @param {number[]} digits
 * @return {number[]}
 */
// var plusOne = function(digits) {
//     let isContinue = true;
//     let currentIndex = digits.length - 1;
//     while (isContinue) {
//         if(digits[currentIndex] === 9) {
//             digits[currentIndex] = 0;
//             if(currentIndex === 0) {
//                 digits.unshift(1);
//                 isContinue = false;
//             } else {
//                 currentIndex--;
//                 isContinue = true;
//             }
//         } else {
//             digits[currentIndex] += 1;
//             isContinue = false;
//         }
//     }
//     return digits;
//     const num = BigInt(digits.join('')) + 1n;
//     return String(num).split('').map(Number);
//     const recursion = (index) => {
//         if (index < 0) {
//             digits.unshift(1);
//             return;
//         }
//         if (digits[index] === 9) {
//             digits[index] = 0;
//             recursion(index - 1);
//         } else {
//             digits[index] += 1;
//         }
//     };
//     recursion(digits.length - 1);
//     return digits;
// };

/**
 * @param {string[]} words
 * @param {number} maxWidth
 * @return {string[]}
 */
// function fullJustify(words, maxWidth) {
//     const result = [];
//     let i = 0;
//     const n = words.length;
    
//     while (i < n) {
//         // 第一步：确定当前行能放哪些单词
//         let lineStart = i;
//         let lineLength = 0;
        
//         while (i < n && lineLength + words[i].length + (i - lineStart) <= maxWidth) {
//             lineLength += words[i].length;
//             i++;
//         }
        
//         // 当前行的单词个数
//         const wordCount = i - lineStart;
//         const isLastLine = i === n;
        
//         // 第二步：构建每行
//         let line = '';
        
//         if (wordCount === 1 || isLastLine) {
//             // 只有一个单词或最后一行：左对齐
//             line = words[lineStart];
//             for (let j = lineStart + 1; j < i; j++) {
//                 line += ' ' + words[j];
//             }
//             // 右侧补空格
//             line += ' '.repeat(maxWidth - line.length);
//         } else {
//             // 多个单词且非最后一行：两端对齐
//             const totalSpaces = maxWidth - lineLength;
//             const gaps = wordCount - 1;
//             const spacePerGap = Math.floor(totalSpaces / gaps);
//             const extraSpaces = totalSpaces % gaps;
            
//             line = words[lineStart];
//             for (let j = 0; j < gaps; j++) {
//                 // 左侧的间隔多一个空格
//                 const spaces = spacePerGap + (j < extraSpaces ? 1 : 0);
//                 line += ' '.repeat(spaces) + words[lineStart + 1 + j];
//             }
//         }
        
//         result.push(line);
//     }
    
//     return result;
// }

