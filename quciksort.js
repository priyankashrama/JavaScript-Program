function quickSort(arr, low = 0, high = arr.length - 1) {
    // Base case: if low is less than high
    if (low < high) {
        // Get the partition index
        const pi = partition(arr, low, high);
        
        // Recursively sort elements before and after partition
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    // Choose the rightmost element as pivot
    const pivot = arr[high];
    // Index of smaller element
    let i = low - 1;
    
    // Compare each element with pivot
    for (let j = low; j < high; j++) {
        // If current element is smaller than or equal to pivot
        if (arr[j] <= pivot) {
            i++; // Increment index of smaller element
            // Swap elements
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    // Place pivot in its correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1; // Return the partition index
}

