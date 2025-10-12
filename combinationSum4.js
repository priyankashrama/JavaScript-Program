//problem link:https://leetcode.com/problems/combination-sum-iv/description/
class Solution {
    // DP approach
    combinationSum4(nums, target) {
        const dp = new Array(target + 1).fill(0);
        dp[0] = 1;

        for (let i = 0; i <= target; i++) {
            for (let j = 0; j < nums.length; j++) {
                if (i - nums[j] >= 0) {
                    dp[i] += dp[i - nums[j]];
                }
            }
        }

        return dp[target];
    }

    // Recursive approach
    combinations(nums, target) {
        if (target === 0) return 1;
        if (target < 0) return 0;

        let ways = 0;
        for (let i = 0; i < nums.length; i++) {
            ways += this.combinations(nums, target - nums[i]);
        }

        return ways;
    }
}

// Example usage:
const sol = new Solution();
console.log(sol.combinationSum4([1,2,3], 4)); // 7
console.log(sol.combinations([1,2,3], 4));    // 7
