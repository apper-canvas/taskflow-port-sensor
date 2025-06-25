import { toast } from 'react-toastify';

export const projectService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "color" } },
          { field: { Name: "task_count" } },
          { field: { Name: "completed_count" } }
        ]
      };

      const response = await apperClient.fetchRecords('project', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(project => ({
        Id: project.Id,
        name: project.Name || '',
        tags: project.Tags || '',
        owner: project.Owner || '',
        color: project.color || '#5B21B6',
        taskCount: project.task_count || 0,
        completedCount: project.completed_count || 0
      }));
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "color" } },
          { field: { Name: "task_count" } },
          { field: { Name: "completed_count" } }
        ]
      };

      const response = await apperClient.getRecordById('project', parseInt(id, 10), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Project not found');
      }

      if (!response.data) {
        throw new Error('Project not found');
      }

      const project = response.data;
      return {
        Id: project.Id,
        name: project.Name || '',
        tags: project.Tags || '',
        owner: project.Owner || '',
        color: project.color || '#5B21B6',
        taskCount: project.task_count || 0,
        completedCount: project.completed_count || 0
      };
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw error;
    }
  },

  async create(projectData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: projectData.name,
          Tags: projectData.tags || '',
          color: projectData.color || '#5B21B6',
          task_count: 0,
          completed_count: 0
        }]
      };

      const response = await apperClient.createRecord('project', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create project');
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdProject = successfulRecords[0].data;
          return {
            Id: createdProject.Id,
            name: createdProject.Name || '',
            tags: createdProject.Tags || '',
            owner: createdProject.Owner || '',
            color: createdProject.color || '#5B21B6',
            taskCount: createdProject.task_count || 0,
            completedCount: createdProject.completed_count || 0
          };
        }
      }

      throw new Error('Failed to create project');
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  async update(id, projectData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id, 10),
          ...(projectData.name && { Name: projectData.name }),
          ...(projectData.tags !== undefined && { Tags: projectData.tags }),
          ...(projectData.color && { color: projectData.color }),
          ...(projectData.taskCount !== undefined && { task_count: projectData.taskCount }),
          ...(projectData.completedCount !== undefined && { completed_count: projectData.completedCount })
        }]
      };

      const response = await apperClient.updateRecord('project', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update project');
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedProject = successfulUpdates[0].data;
          return {
            Id: updatedProject.Id,
            name: updatedProject.Name || '',
            tags: updatedProject.Tags || '',
            owner: updatedProject.Owner || '',
            color: updatedProject.color || '#5B21B6',
            taskCount: updatedProject.task_count || 0,
            completedCount: updatedProject.completed_count || 0
          };
        }
      }

      throw new Error('Failed to update project');
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await apperClient.deleteRecord('project', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to delete project');
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  async updateCounts(projectId) {
    // This will be handled by database triggers or calculated fields
    // For now, we'll return the current project data
    return await this.getById(projectId);
  }
};