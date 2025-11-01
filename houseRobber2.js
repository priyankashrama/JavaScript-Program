//problem link:https://leetcode.com/problems/house-robber-ii/description/
class Solution {
    rob(nums) {
        if (nums.length === 1) {
            return nums[0];
        }
        if (nums.length === 2) {
            return Math.max(nums[0], nums[1]);
        }

        let ans = 0;
        const dp = new Array(nums.length).fill(0);

        // Case 1: Consider 0th house (exclude last house)
        dp[0] = nums[0];
        dp[1] = Math.max(nums[0], nums[1]);
        for (let i = 2; i < nums.length - 1; i++) {
            dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
        }
        dp[nums.length - 1] = dp[nums.length - 2];
        ans = dp[nums.length - 1];

        // Case 2: Skip 0th house (allow last house)
        dp[0] = 0;
        dp[1] = nums[1];
        for (let i = 2; i < nums.length; i++) {
            dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
        }
        ans = Math.max(ans, dp[nums.length - 1]);

        return ans;
    }
}

// Example usage:
const sol = new Solution();
console.log(sol.rob([2,3,2]));    // 3
console.log(sol.rob([1,2,3,1]));  // 4
console.log(sol.rob([1,2,3]));    // 3
