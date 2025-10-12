//leetcode problem link:https://leetcode.com/problems/decode-ways/description/
class Solution {
    numDecodings(s) {
        if (s.length === 1) {
            return s[0] !== '0' ? 1 : 0;
        }
        if (s[0] === '0') {
            return 0;
        }

        const arr = [];
        for (let i = 0; i < s.length; i++) {
            if (s[i] === '0' && i > 0 && s[i - 1] === '0') {
                return 0;
            }
            arr[i] = parseInt(s[i], 10);
        }

        const dp = new Array(s.length).fill(0);
        dp[0] = 1;

        if (arr[1] === 0) {
            if (arr[0] * 10 + arr[1] === 10 || arr[0] * 10 + arr[1] === 20) {
                dp[1] = 1;
            } else {
                return 0;
            }
        } else if (arr[0] * 10 + arr[1] <= 26) {
            dp[1] = 2;
        } else {
            dp[1] = 1;
        }

        for (let i = 2; i < s.length; i++) {
            const temp = arr[i - 1] * 10 + arr[i];
            if (arr[i] === 0) {
                if (temp > 26) {
                    return 0;
                }
                dp[i] = dp[i - 2];
            } else if (temp <= 26 && temp >= 10) {
                dp[i] = dp[i - 1] + dp[i - 2];
            } else {
                dp[i] = dp[i - 1];
            }
        }

        return dp[s.length - 1];
    }
}

// Example usage:
const sol = new Solution();
console.log(sol.numDecodings("12"));   // 2  ("AB", "L")
console.log(sol.numDecodings("226"));  // 3  ("BZ", "VF", "BBF")
console.log(sol.numDecodings("06"));   // 0
