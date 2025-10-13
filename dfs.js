// Depth-First Search (DFS) Traversal of a Graph
// Time Complexity: O(V + E), Space Complexity: O(V)
//
// Idea: Explore as far as possible along each branch before backtracking.
// DFS can be implemented using recursion or an explicit stack.
//
// DFS is useful for pathfinding, topological sorting, and detecting cycles.

function dfsTraversal(graph, start) {
  const visited = new Set(); // keeps track of visited nodes
  const result = []; // stores traversal order

  function dfs(node) {
    visited.add(node);
    result.push(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  }

  dfs(start);
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

  console.log(dfsTraversal(graph, "A"));
  // Expected output: ['A', 'B', 'D', 'E', 'F', 'C']
}

module.exports = dfsTraversal;
