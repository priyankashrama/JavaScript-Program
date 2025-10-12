//problem link:https://leetcode.com/problems/house-robber/description/
class Solution {
    rob(nums) {
        if (nums.length === 1) {
            return nums[0];
        }
        const dp = new Array(nums.length).fill(0);
        dp[0] = nums[0];
        dp[1] = Math.max(nums[0], nums[1]);

        for (let i = 2; i < nums.length; i++) {
            dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
        }

        return dp[nums.length - 1];
    }
}

// Example usage:
const sol = new Solution();
console.log(sol.rob([1,2,3,1])); // 4
console.log(sol.rob([2,7,9,3,1])); // 12
