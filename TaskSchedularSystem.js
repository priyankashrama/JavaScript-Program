// Advanced Task Scheduler with Priority Queue, Event System, and State Management

class PriorityQueue {
  constructor(comparator = (a, b) => a.priority - b.priority) {
    this.heap = [];
    this.comparator = comparator;
  }

  push(item) {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.isEmpty()) return null;
    const top = this.heap[0];
    const bottom = this.heap.pop();
    if (!this.isEmpty()) {
      this.heap[0] = bottom;
      this.bubbleDown(0);
    }
    return top;
  }

  peek() {
    return this.isEmpty() ? null : this.heap[0];
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  bubbleUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.comparator(this.heap[idx], this.heap[parent]) >= 0) break;
      [this.heap[idx], this.heap[parent]] = [this.heap[parent], this.heap[idx]];
      idx = parent;
    }
  }

  bubbleDown(idx) {
    const len = this.heap.length;
    while (true) {
      let smallest = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;

      if (left < len && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < len && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === idx) break;

      [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
      idx = smallest;
    }
  }
}

class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(listener);
    return () => this.off(event, listener);
  }

  off(event, listener) {
    if (!this.events.has(event)) return;
    const listeners = this.events.get(event);
    const idx = listeners.indexOf(listener);
    if (idx > -1) listeners.splice(idx, 1);
  }

  emit(event, ...args) {
    if (!this.events.has(event)) return;
    this.events.get(event).forEach(listener => listener(...args));
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

class Task {
  static idCounter = 0;

  constructor(name, fn, options = {}) {
    this.id = Task.idCounter++;
    this.name = name;
    this.fn = fn;
    this.priority = options.priority || 0;
    this.delay = options.delay || 0;
    this.retries = options.retries || 0;
    this.maxRetries = options.retries || 0;
    this.timeout = options.timeout || 5000;
    this.dependencies = options.dependencies || [];
    this.status = 'pending';
    this.result = null;
    this.error = null;
    this.startTime = null;
    this.endTime = null;
  }

  async execute() {
    this.status = 'running';
    this.startTime = Date.now();

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Task timeout')), this.timeout)
      );

      this.result = await Promise.race([
        Promise.resolve(this.fn()),
        timeoutPromise
      ]);

      this.status = 'completed';
      this.endTime = Date.now();
      return this.result;
    } catch (error) {
      if (this.retries > 0) {
        this.retries--;
        this.status = 'retrying';
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.execute();
      }
      this.error = error;
      this.status = 'failed';
      this.endTime = Date.now();
      throw error;
    }
  }

  getDuration() {
    return this.endTime && this.startTime ? this.endTime - this.startTime : null;
  }
}

class TaskScheduler extends EventEmitter {
  constructor(config = {}) {
    super();
    this.maxConcurrent = config.maxConcurrent || 3;
    this.running = 0;
    this.queue = new PriorityQueue();
    this.completed = new Map();
    this.failed = new Map();
    this.taskGraph = new Map();
    this.isProcessing = false;
    this.stats = {
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      totalDuration: 0
    };
  }

  addTask(name, fn, options = {}) {
    const task = new Task(name, fn, options);
    this.queue.push(task);
    this.taskGraph.set(task.id, task);
    this.stats.totalTasks++;
    this.emit('taskAdded', task);

    if (!this.isProcessing) {
      this.process();
    }

    return task.id;
  }

  addBulkTasks(tasks) {
    return tasks.map(({ name, fn, options }) => this.addTask(name, fn, options));
  }

  async process() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (!this.queue.isEmpty() || this.running > 0) {
      while (this.running < this.maxConcurrent && !this.queue.isEmpty()) {
        const task = this.queue.pop();
        
        if (!this.checkDependencies(task)) {
          this.queue.push(task);
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        }

        this.running++;
        this.emit('taskStarted', task);

        if (task.delay > 0) {
          await new Promise(resolve => setTimeout(resolve, task.delay));
        }

        this.executeTask(task);
      }

      await new Promise(resolve => setTimeout(resolve, 50));
    }

    this.isProcessing = false;
    this.emit('allTasksCompleted', this.getStats());
  }

  checkDependencies(task) {
    return task.dependencies.every(depId => {
      const dep = this.taskGraph.get(depId);
      return dep && dep.status === 'completed';
    });
  }

  async executeTask(task) {
    try {
      const result = await task.execute();
      this.completed.set(task.id, task);
      this.stats.completedTasks++;
      this.stats.totalDuration += task.getDuration();
      this.emit('taskCompleted', task, result);
    } catch (error) {
      this.failed.set(task.id, task);
      this.stats.failedTasks++;
      this.emit('taskFailed', task, error);
    } finally {
      this.running--;
    }
  }

  getTask(taskId) {
    return this.taskGraph.get(taskId);
  }

  getStats() {
    return {
      ...this.stats,
      averageDuration: this.stats.completedTasks > 0
        ? this.stats.totalDuration / this.stats.completedTasks
        : 0,
      successRate: this.stats.totalTasks > 0
        ? (this.stats.completedTasks / this.stats.totalTasks) * 100
        : 0
    };
  }

  cancelTask(taskId) {
    const task = this.taskGraph.get(taskId);
    if (task && task.status === 'pending') {
      task.status = 'cancelled';
      this.emit('taskCancelled', task);
      return true;
    }
    return false;
  }

  async waitForCompletion() {
    return new Promise(resolve => {
      if (!this.isProcessing && this.running === 0) {
        resolve(this.getStats());
      } else {
        this.once('allTasksCompleted', resolve);
      }
    });
  }
}

// Demo Usage
(async () => {
  const scheduler = new TaskScheduler({ maxConcurrent: 2 });

  // Event listeners
  scheduler.on('taskCompleted', (task, result) => {
    console.log(`✓ ${task.name} completed in ${task.getDuration()}ms:`, result);
  });

  scheduler.on('taskFailed', (task, error) => {
    console.log(`✗ ${task.name} failed:`, error.message);
  });

  scheduler.on('allTasksCompleted', stats => {
    console.log('\n=== Scheduler Stats ===');
    console.log(`Total: ${stats.totalTasks}`);
    console.log(`Completed: ${stats.completedTasks}`);
    console.log(`Failed: ${stats.failedTasks}`);
    console.log(`Success Rate: ${stats.successRate.toFixed(2)}%`);
    console.log(`Average Duration: ${stats.averageDuration.toFixed(2)}ms`);
  });

  // Add complex tasks
  const task1 = scheduler.addTask(
    'Fetch User Data',
    async () => {
      await new Promise(r => setTimeout(r, 500));
      return { id: 1, name: 'Alice' };
    },
    { priority: 1 }
  );

  const task2 = scheduler.addTask(
    'Process Analytics',
    async () => {
      await new Promise(r => setTimeout(r, 800));
      return { views: 1000, clicks: 50 };
    },
    { priority: 2, retries: 2 }
  );

  scheduler.addTask(
    'Generate Report',
    async () => {
      await new Promise(r => setTimeout(r, 300));
      return 'Report Generated';
    },
    { priority: 3, dependencies: [task1, task2] }
  );

  scheduler.addTask(
    'Flaky Task',
    async () => {
      if (Math.random() > 0.5) throw new Error('Random failure');
      return 'Success';
    },
    { retries: 3, timeout: 2000 }
  );

  // Bulk add
  scheduler.addBulkTasks([
    { name: 'Task A', fn: async () => 'A done', options: { delay: 200 } },
    { name: 'Task B', fn: async () => 'B done', options: { delay: 150 } },
    { name: 'Task C', fn: async () => 'C done', options: { delay: 100 } }
  ]);

  await scheduler.waitForCompletion();
})();