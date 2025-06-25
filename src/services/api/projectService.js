import { delay } from '@/utils/delay';
import projectData from '@/services/mockData/projects.json';
import { taskService } from './taskService';

let projects = [...projectData];

export const projectService = {
  async getAll() {
    await delay(250);
    return [...projects];
  },

  async getById(id) {
    await delay(200);
    const project = projects.find(project => project.Id === parseInt(id, 10));
    if (!project) {
      throw new Error('Project not found');
    }
    return { ...project };
  },

  async create(projectData) {
    await delay(350);
    const newProject = {
      Id: Math.max(...projects.map(p => p.Id), 0) + 1,
      ...projectData,
      taskCount: 0,
      completedCount: 0
    };
    projects.push(newProject);
    return { ...newProject };
  },

  async update(id, projectData) {
    await delay(300);
    const index = projects.findIndex(project => project.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    const updatedProject = {
      ...projects[index],
      ...projectData,
      Id: projects[index].Id // Prevent ID modification
    };
    
    projects[index] = updatedProject;
    return { ...updatedProject };
  },

  async delete(id) {
    await delay(250);
    const index = projects.findIndex(project => project.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    const deletedProject = projects[index];
    projects.splice(index, 1);
    return { ...deletedProject };
  },

  async updateCounts(projectId) {
    await delay(200);
    const tasks = await taskService.getByProject(projectId);
    const project = projects.find(p => p.Id === parseInt(projectId, 10));
    
    if (project) {
      project.taskCount = tasks.length;
      project.completedCount = tasks.filter(t => t.status === 'completed').length;
    }
    
    return { ...project };
  }
};