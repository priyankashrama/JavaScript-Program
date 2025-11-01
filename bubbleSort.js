// Bubble Sort Algorithm in JavaScript

function bubbleSort(arr) {
    // 'n' is the length of the array
    let n = arr.length;
  
    // Outer loop for each pass
    for (let i = 0; i < n - 1; i++) {
      // Inner loop for comparing adjacent elements
      for (let j = 0; j < n - i - 1; j++) {
        // Compare two adjacent values
        if (arr[j] > arr[j + 1]) {
          // Swap them if they are in the wrong order
  
          let temp = arr[j];       // store arr[j] in temp
          arr[j] = arr[j + 1];     // move smaller element to left
          arr[j + 1] = temp;       // move larger element to right
        }
      }
  
      // You can print the array after each pass to see progress
      console.log(`After pass ${i + 1}:`, arr);
    }
  
    // Return the sorted array
    return arr;
  }
  
// Example usage:
let numbers = [5, 3, 8, 4, 2];
console.log("Original array:", numbers);

let sortedArray = bubbleSort(numbers);
console.log("Sorted array:", sortedArray);
  