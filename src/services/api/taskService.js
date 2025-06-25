import { delay } from '@/utils/delay';
import taskData from '@/services/mockData/tasks.json';

let tasks = [...taskData];

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(task => task.Id === parseInt(id, 10));
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      status: 'active',
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(300);
    const index = tasks.findIndex(task => task.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[index],
      ...taskData,
      Id: tasks[index].Id // Prevent ID modification
    };
    
    // Handle completion
    if (taskData.status === 'completed' && tasks[index].status !== 'completed') {
      updatedTask.completedAt = new Date().toISOString();
    } else if (taskData.status === 'active' && tasks[index].status === 'completed') {
      updatedTask.completedAt = null;
    }
    
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(task => task.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const deletedTask = tasks[index];
    tasks.splice(index, 1);
    return { ...deletedTask };
  },

  async getByProject(projectId) {
    await delay(250);
    return tasks.filter(task => task.projectId === projectId).map(task => ({ ...task }));
  },

  async getByStatus(status) {
    await delay(250);
    return tasks.filter(task => task.status === status).map(task => ({ ...task }));
  },

  async getToday() {
    await delay(250);
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => 
      task.dueDate && task.dueDate.split('T')[0] === today && task.status === 'active'
    ).map(task => ({ ...task }));
  },

  async getUpcoming() {
    await delay(250);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return tasks.filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      const dueDate = new Date(task.dueDate);
      return dueDate > today && dueDate <= nextWeek;
    }).map(task => ({ ...task }));
  }
};