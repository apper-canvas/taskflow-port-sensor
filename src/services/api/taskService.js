import { toast } from 'react-toastify';

export const taskService = {
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "project_id" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "completed_at" } }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

return response.data.map(task => ({
        Id: task.Id,
        name: task.Name || '',
        title: task.title || '',
        description: task.description || '',
        projectId: task.project_id ? task.project_id.toString() : '',
        priority: task.priority || 'medium',
        status: task.status || 'active',
        dueDate: task.due_date || null,
        createdAt: task.created_at || null,
        completedAt: task.completed_at || null,
        parentTaskId: null // Subtask functionality placeholder
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "project_id" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "completed_at" } }
        ]
      };

      const response = await apperClient.getRecordById('task', parseInt(id, 10), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Task not found');
      }

      if (!response.data) {
        throw new Error('Task not found');
      }

      const task = response.data;
return {
        Id: task.Id,
        name: task.Name || '',
        title: task.title || '',
        description: task.description || '',
        projectId: task.project_id ? task.project_id.toString() : '',
        priority: task.priority || 'medium',
        status: task.status || 'active',
        dueDate: task.due_date || null,
        createdAt: task.created_at || null,
        completedAt: task.completed_at || null,
        parentTaskId: null // Subtask functionality placeholder
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: taskData.title,
          title: taskData.title,
          description: taskData.description || '',
          project_id: parseInt(taskData.projectId, 10),
          priority: taskData.priority || 'medium',
          status: 'active',
          due_date: taskData.dueDate || null,
          created_at: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('task', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create task');
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
          const createdTask = successfulRecords[0].data;
return {
            Id: createdTask.Id,
            name: createdTask.Name || '',
            title: createdTask.title || '',
            description: createdTask.description || '',
            projectId: createdTask.project_id ? createdTask.project_id.toString() : '',
            priority: createdTask.priority || 'medium',
            status: createdTask.status || 'active',
            dueDate: createdTask.due_date || null,
            createdAt: createdTask.created_at || null,
            completedAt: createdTask.completed_at || null,
            parentTaskId: null // Subtask functionality placeholder
          };
        }
      }

      throw new Error('Failed to create task');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id, 10)
      };

      // Only include fields that are provided
      if (taskData.title !== undefined) {
        updateData.Name = taskData.title;
        updateData.title = taskData.title;
      }
      if (taskData.description !== undefined) {
        updateData.description = taskData.description;
      }
      if (taskData.projectId !== undefined) {
        updateData.project_id = parseInt(taskData.projectId, 10);
      }
      if (taskData.priority !== undefined) {
        updateData.priority = taskData.priority;
      }
      if (taskData.status !== undefined) {
        updateData.status = taskData.status;
        // Handle completion timestamp
        if (taskData.status === 'completed') {
          updateData.completed_at = new Date().toISOString();
        } else if (taskData.status === 'active') {
          updateData.completed_at = null;
        }
      }
      if (taskData.dueDate !== undefined) {
        updateData.due_date = taskData.dueDate;
      }

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update task');
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
          const updatedTask = successfulUpdates[0].data;
return {
            Id: updatedTask.Id,
            name: updatedTask.Name || '',
            title: updatedTask.title || '',
            description: updatedTask.description || '',
            projectId: updatedTask.project_id ? updatedTask.project_id.toString() : '',
            priority: updatedTask.priority || 'medium',
            status: updatedTask.status || 'active',
            dueDate: updatedTask.due_date || null,
            createdAt: updatedTask.created_at || null,
            completedAt: updatedTask.completed_at || null,
            parentTaskId: null // Subtask functionality placeholder
          };
        }
      }

      throw new Error('Failed to update task');
    } catch (error) {
      console.error("Error updating task:", error);
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

      const response = await apperClient.deleteRecord('task', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to delete task');
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
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  async getByProject(projectId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "project_id" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "completed_at" } }
        ],
        where: [
          {
            FieldName: "project_id",
            Operator: "EqualTo",
            Values: [parseInt(projectId, 10)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data) {
        return [];
      }

return response.data.map(task => ({
        Id: task.Id,
        name: task.Name || '',
        title: task.title || '',
        description: task.description || '',
        projectId: task.project_id ? task.project_id.toString() : '',
        priority: task.priority || 'medium',
        status: task.status || 'active',
        dueDate: task.due_date || null,
        createdAt: task.created_at || null,
        completedAt: task.completed_at || null,
        parentTaskId: null // Subtask functionality placeholder
      }));
    } catch (error) {
      console.error("Error fetching project tasks:", error);
      return [];
    }
  },

  async getByStatus(status) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "project_id" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "completed_at" } }
        ],
        where: [
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: [status]
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data) {
        return [];
      }

return response.data.map(task => ({
        Id: task.Id,
        name: task.Name || '',
        title: task.title || '',
        description: task.description || '',
        projectId: task.project_id ? task.project_id.toString() : '',
        priority: task.priority || 'medium',
        status: task.status || 'active',
        dueDate: task.due_date || null,
        createdAt: task.created_at || null,
        completedAt: task.completed_at || null,
        parentTaskId: null // Subtask functionality placeholder
      }));
    } catch (error) {
      console.error("Error fetching tasks by status:", error);
      return [];
    }
  },

  async getToday() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const today = new Date().toISOString().split('T')[0];

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "project_id" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "completed_at" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "due_date",
                    operator: "ExactMatch",
                    subOperator: "Day",
                    values: [today]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "status",
                    operator: "EqualTo",
                    values: ["active"]
                  }
                ]
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data) {
        return [];
      }

return response.data.map(task => ({
        Id: task.Id,
        name: task.Name || '',
        title: task.title || '',
        description: task.description || '',
        projectId: task.project_id ? task.project_id.toString() : '',
        priority: task.priority || 'medium',
        status: task.status || 'active',
        dueDate: task.due_date || null,
        createdAt: task.created_at || null,
        completedAt: task.completed_at || null,
        parentTaskId: null // Subtask functionality placeholder
      }));
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
      return [];
    }
  },

  async getUpcoming() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "project_id" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "completed_at" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "due_date",
                    operator: "RelativeMatch",
                    values: ["next 7 days"]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "status",
                    operator: "NotEqualTo",
                    values: ["completed"]
                  }
                ]
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data) {
        return [];
      }

return response.data.map(task => ({
        Id: task.Id,
        name: task.Name || '',
        title: task.title || '',
        description: task.description || '',
        projectId: task.project_id ? task.project_id.toString() : '',
        priority: task.priority || 'medium',
        status: task.status || 'active',
        dueDate: task.due_date || null,
        createdAt: task.created_at || null,
        completedAt: task.completed_at || null,
        parentTaskId: null // Subtask functionality placeholder
      }));
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error);
      return [];
}
  },

  async bulkUpdate(updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Prepare records for bulk update
      const records = updates.map(update => {
        const record = { Id: parseInt(update.Id, 10) };
        
        // Only include updateable fields
        if (update.title !== undefined) {
          record.Name = update.title;
          record.title = update.title;
        }
        if (update.description !== undefined) {
          record.description = update.description;
        }
        if (update.project_id !== undefined) {
          record.project_id = parseInt(update.project_id, 10);
        }
        if (update.priority !== undefined) {
          record.priority = update.priority;
        }
        if (update.status !== undefined) {
          record.status = update.status;
          // Handle completion timestamp
          if (update.status === 'completed') {
            record.completed_at = new Date().toISOString();
          } else if (update.status === 'active') {
            record.completed_at = null;
          }
        }
        if (update.due_date !== undefined) {
          record.due_date = update.due_date;
        }

        return record;
      });

      const params = { records };
      const response = await apperClient.updateRecord('task', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update tasks');
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

return successfulUpdates.map(result => ({
          Id: result.data.Id,
          name: result.data.Name || '',
          title: result.data.title || '',
          description: result.data.description || '',
          projectId: result.data.project_id ? result.data.project_id.toString() : '',
          priority: result.data.priority || 'medium',
          status: result.data.status || 'active',
          dueDate: result.data.due_date || null,
          createdAt: result.data.created_at || null,
          completedAt: result.data.completed_at || null,
          parentTaskId: null // Subtask functionality placeholder
        }));
      }

      return [];
    } catch (error) {
      console.error("Error bulk updating tasks:", error);
      throw error;
    }
  },

  async bulkDelete(taskIds) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: taskIds.map(id => parseInt(id, 10))
      };

      const response = await apperClient.deleteRecord('task', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to delete tasks');
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

        return successfulDeletions.length === taskIds.length;
      }

      return false;
    } catch (error) {
      console.error("Error bulk deleting tasks:", error);
      throw error;
    }
},

  // Subtask management methods
  async createSubtask(parentTaskId, subtaskData) {
    try {
      const taskData = {
        ...subtaskData,
        // Note: parentTaskId would be implemented when database schema supports it
        // For now, we track subtasks through naming convention or custom fields
        title: `${subtaskData.title} (Subtask)`,
        description: `${subtaskData.description}\n\nParent Task ID: ${parentTaskId}`
      };
      
      return await this.create(taskData);
    } catch (error) {
      console.error("Error creating subtask:", error);
      throw error;
    }
  },

  async getSubtasks(parentTaskId) {
    try {
      // This is a placeholder implementation
      // In a real scenario, we would filter by parent_task_id field
      const allTasks = await this.getAll();
      return allTasks.filter(task => 
        task.description && task.description.includes(`Parent Task ID: ${parentTaskId}`)
      );
    } catch (error) {
      console.error("Error fetching subtasks:", error);
      return [];
    }
  },

  async updateTaskHierarchy(taskId, parentTaskId) {
    try {
      // Placeholder for updating parent-child relationships
      // Would update parent_task_id field when available in schema
      const task = await this.getById(taskId);
      const updatedDescription = task.description + `\n\nParent Task ID: ${parentTaskId}`;
      
      return await this.update(taskId, { 
        description: updatedDescription 
      });
    } catch (error) {
      console.error("Error updating task hierarchy:", error);
      throw error;
    }
  }
};