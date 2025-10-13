// Breadth-First Search (BFS) Traversal of a Graph
// Time Complexity: O(V + E), Space Complexity: O(V)
//
// Idea: Use a queue to explore all neighbors of a node before moving
// to the next level. Keep track of visited nodes to avoid revisiting.
//
// BFS is useful for finding the shortest path in unweighted graphs
// and exploring connected components.

function bfsTraversal(graph, start) {
  const visited = new Set(); // keeps track of visited nodes
  const queue = []; // queue for BFS
  const result = []; // stores traversal order

  // Start BFS from the 'start' node
  visited.add(start);
  queue.push(start);

  while (queue.length > 0) {
    const node = queue.shift(); // dequeue front element
    result.push(node);

    // Traverse all neighbors of the current node
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return result;
}

// Quick test example
if (require.main === module) {
  // Example graph represented as adjacency list
  const graph = {
    A: ["B", "C"],
    B: ["D", "E"],
    C: ["F"],
    D: [],
    E: ["F"],
    F: [],
  };

  console.log(bfsTraversal(graph, "A"));
  // Expected output: ['A', 'B', 'C', 'D', 'E', 'F']
}

module.exports = bfsTraversal;
