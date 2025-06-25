import { toast } from "react-toastify";
import React from "react";

export const taskDependencyService = {
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
          { field: { Name: "dependentTaskId" } },
          { field: { Name: "precedingTaskId" } },
          { field: { Name: "dependencyType" } }
        ]
      };

      const response = await apperClient.fetchRecords('taskdependency', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
}

      return response.data.map(dependency => ({
        Id: dependency.Id,
        name: dependency.Name || '',
        dependentTaskId: dependency.dependentTaskId ? 
          (typeof dependency.dependentTaskId === 'object' ? dependency.dependentTaskId.Id : dependency.dependentTaskId).toString() : '',
        precedingTaskId: dependency.precedingTaskId ? 
          (typeof dependency.precedingTaskId === 'object' ? dependency.precedingTaskId.Id : dependency.precedingTaskId).toString() : '',
        dependencyType: dependency.dependencyType || 'finish-to-start'
      }));
    } catch (error) {
      console.error("Error fetching task dependencies:", error);
      toast.error("Failed to load task dependencies");
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
          { field: { Name: "dependentTaskId" } },
          { field: { Name: "precedingTaskId" } },
          { field: { Name: "dependencyType" } }
        ]
      };

      const response = await apperClient.getRecordById('taskdependency', parseInt(id, 10), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Task dependency not found');
      }

      if (!response.data) {
        throw new Error('Task dependency not found');
      }
const dependency = response.data;
      return {
        Id: dependency.Id,
        name: dependency.Name || '',
        dependentTaskId: dependency.dependentTaskId ? 
          (typeof dependency.dependentTaskId === 'object' ? dependency.dependentTaskId.Id : dependency.dependentTaskId).toString() : '',
        precedingTaskId: dependency.precedingTaskId ? 
          (typeof dependency.precedingTaskId === 'object' ? dependency.precedingTaskId.Id : dependency.precedingTaskId).toString() : '',
        dependencyType: dependency.dependencyType || 'finish-to-start'
      };
    } catch (error) {
      console.error(`Error fetching task dependency with ID ${id}:`, error);
      throw error;
    }
  },

  async create(dependencyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

      const params = {
        records: [{
          Name: dependencyData.name || dependencyData.Name || `${dependencyData.dependentTaskId}-${dependencyData.precedingTaskId}`,
          dependentTaskId: parseInt(dependencyData.dependentTaskId, 10),
          precedingTaskId: parseInt(dependencyData.precedingTaskId, 10),
          dependencyType: dependencyData.dependencyType || 'finish-to-start'
        }]
      };

      const response = await apperClient.createRecord('taskdependency', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create task dependency');
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
          const createdDependency = successfulRecords[0].data;
          return {
            Id: createdDependency.Id,
            name: createdDependency.Name || '',
            dependentTaskId: createdDependency.dependentTaskId ? 
              (typeof createdDependency.dependentTaskId === 'object' ? createdDependency.dependentTaskId.Id : createdDependency.dependentTaskId).toString() : '',
            precedingTaskId: createdDependency.precedingTaskId ? 
              (typeof createdDependency.precedingTaskId === 'object' ? createdDependency.precedingTaskId.Id : createdDependency.precedingTaskId).toString() : '',
            dependencyType: createdDependency.dependencyType || 'finish-to-start'
          };
        }
      }

      throw new Error('Failed to create task dependency');
    } catch (error) {
      console.error("Error creating task dependency:", error);
      throw error;
    }
  },

  async update(id, dependencyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id, 10)
      };

      if (dependencyData.dependentTaskId !== undefined) {
        updateData.dependentTaskId = parseInt(dependencyData.dependentTaskId, 10);
      }
      if (dependencyData.precedingTaskId !== undefined) {
        updateData.precedingTaskId = parseInt(dependencyData.precedingTaskId, 10);
      }
      if (dependencyData.dependencyType !== undefined) {
        updateData.dependencyType = dependencyData.dependencyType;
      }
      if (dependencyData.name !== undefined) {
        updateData.Name = dependencyData.name;
      }

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('taskdependency', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update task dependency');
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
          const updatedDependency = successfulUpdates[0].data;
          return {
            Id: updatedDependency.Id,
            name: updatedDependency.Name || '',
            dependentTaskId: updatedDependency.dependentTaskId ? 
              (typeof updatedDependency.dependentTaskId === 'object' ? updatedDependency.dependentTaskId.Id : updatedDependency.dependentTaskId).toString() : '',
            precedingTaskId: updatedDependency.precedingTaskId ? 
              (typeof updatedDependency.precedingTaskId === 'object' ? updatedDependency.precedingTaskId.Id : updatedDependency.precedingTaskId).toString() : '',
            dependencyType: updatedDependency.dependencyType || 'finish-to-start'
          };
        }
      }

      throw new Error('Failed to update task dependency');
    } catch (error) {
      console.error("Error updating task dependency:", error);
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

      const response = await apperClient.deleteRecord('taskdependency', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to delete task dependency');
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
      console.error("Error deleting task dependency:", error);
      throw error;
    }
  },

  async getByTask(taskId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "dependentTaskId" } },
          { field: { Name: "precedingTaskId" } },
          { field: { Name: "dependencyType" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "dependentTaskId",
                    operator: "EqualTo",
                    values: [parseInt(taskId, 10)]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "precedingTaskId",
                    operator: "EqualTo",
                    values: [parseInt(taskId, 10)]
                  }
                ]
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords('taskdependency', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data) {
        return [];
}

      return response.data.map(dependency => ({
        Id: dependency.Id,
        name: dependency.Name || '',
        dependentTaskId: dependency.dependentTaskId ? 
          (typeof dependency.dependentTaskId === 'object' ? dependency.dependentTaskId.Id : dependency.dependentTaskId).toString() : '',
        precedingTaskId: dependency.precedingTaskId ? 
          (typeof dependency.precedingTaskId === 'object' ? dependency.precedingTaskId.Id : dependency.precedingTaskId).toString() : '',
        dependencyType: dependency.dependencyType || 'finish-to-start'
      }));
    } catch (error) {
      console.error("Error fetching task dependencies:", error);
      return [];
    }
  },

  async getDependencies(taskId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "dependentTaskId" } },
          { field: { Name: "precedingTaskId" } },
          { field: { Name: "dependencyType" } }
        ],
        where: [
          {
            FieldName: "dependentTaskId",
            Operator: "EqualTo",
            Values: [parseInt(taskId, 10)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('taskdependency', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data) {
        return [];
}

      return response.data.map(dependency => ({
        Id: dependency.Id,
        name: dependency.Name || '',
        dependentTaskId: dependency.dependentTaskId ? 
          (typeof dependency.dependentTaskId === 'object' ? dependency.dependentTaskId.Id : dependency.dependentTaskId).toString() : '',
        precedingTaskId: dependency.precedingTaskId ? 
          (typeof dependency.precedingTaskId === 'object' ? dependency.precedingTaskId.Id : dependency.precedingTaskId).toString() : '',
        dependencyType: dependency.dependencyType || 'finish-to-start'
      }));
    } catch (error) {
      console.error("Error fetching task dependencies:", error);
      return [];
    }
  },

  async getDependents(taskId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "dependentTaskId" } },
          { field: { Name: "precedingTaskId" } },
          { field: { Name: "dependencyType" } }
        ],
        where: [
          {
            FieldName: "precedingTaskId",
            Operator: "EqualTo",
            Values: [parseInt(taskId, 10)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('taskdependency', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data) {
        return [];
}

      return response.data.map(dependency => ({
        Id: dependency.Id,
        name: dependency.Name || '',
        dependentTaskId: dependency.dependentTaskId ? 
          (typeof dependency.dependentTaskId === 'object' ? dependency.dependentTaskId.Id : dependency.dependentTaskId).toString() : '',
        precedingTaskId: dependency.precedingTaskId ? 
          (typeof dependency.precedingTaskId === 'object' ? dependency.precedingTaskId.Id : dependency.precedingTaskId).toString() : '',
        dependencyType: dependency.dependencyType || 'finish-to-start'
      }));
    } catch (error) {
      console.error("Error fetching dependent tasks:", error);
      return [];
    }
  }
};