/**
 * rateLimiter.js
 * ----------------
 * Simple in-memory rate limiter using the token bucket algorithm.
 * Limits how many times a function can be called in a given interval.
 *
 * Example:
 *   const limited = rateLimit(doSomething, 5, 10000); // 5 calls per 10 seconds
 *   limited(); // allowed
 */

function rateLimit(fn, maxCalls, interval) {
  let tokens = maxCalls;
  let lastRefill = Date.now();

  return function (...args) {
    const now = Date.now();
    const elapsed = now - lastRefill;

    // Refill tokens
    if (elapsed > interval) {
      tokens = maxCalls;
      lastRefill = now;
    }

    if (tokens > 0) {
      tokens--;
      return fn.apply(this, args);
    } else {
      throw new Error('Rate limit exceeded. Try again later.');
    }
  };
}

// Example usage:
function exampleAction() {
  console.log('Action executed at', new Date().toISOString());
}

const limitedAction = rateLimit(exampleAction, 3, 5000);

// Uncomment to test
// for (let i = 0; i < 5; i++) limitedAction();

module.exports = rateLimit;
