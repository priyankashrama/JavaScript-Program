//leetcode problem link:https://leetcode.com/problems/unique-paths/description/
class Solution {
    uniquePaths(m, n) {
        const dp = Array.from({ length: m }, () => Array(n).fill(0));
        dp[0][0] = 1;

        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (i > 0) {
                    dp[i][j] = dp[i - 1][j];
                }
                if (j > 0) {
                    dp[i][j] += dp[i][j - 1];
                }
            }
        }
        return dp[m - 1][n - 1];
    }

    paths(m, n, x, y) {
        if (x === m - 1 && y === n - 1) {
            return 1;
        }
        if (x === m || y === n) {
            return 0;
        }
        return this.paths(m, n, x + 1, y) + this.paths(m, n, x, y + 1);
    }
}

// Example usage:
const sol = new Solution();
console.log(sol.uniquePaths(3, 7)); // 28
console.log(sol.paths(3, 7, 0, 0)); // 28
