class Solution {
    canJump(nums) {
        let farthest = 0;
        for (let i = 0; i < nums.length; i++) {
            if (i > farthest) {
                return false;
            }
            farthest = Math.max(farthest, nums[i] + i);
            // if (farthest >= nums.length - 1) {
            //     return true;
            // }
        }
        return true;
    }
}

// Example usage:
const sol = new Solution();
console.log(sol.canJump([2,3,1,1,4])); // true
console.log(sol.canJump([3,2,1,0,4])); // false
