import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasksApi.js';
import { TasksListQueryParams, CreateTaskFormData } from '../types/tasks.types.js';
import { showSuccess, showError } from '../../../lib/toast.js';
import { getErrorMessage } from '../../../api/apiHelpers.js';

export function useTasks(params: TasksListQueryParams) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: async () => {
      const response = await tasksApi.getTasks(params);
      return response;
    },
  });
}

export function useTaskDetail(id?: string) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await tasksApi.getTaskById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useTaskMutations() {
  const queryClient = useQueryClient();

  const createTask = useMutation({
    mutationFn: (data: CreateTaskFormData) => tasksApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showSuccess('Task created successfully!');
    },
    onError: (error) => {
      showError(getErrorMessage(error, 'Failed to create task'));
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTaskFormData> & { status?: string } }) =>
      tasksApi.updateTask(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showSuccess('Task updated successfully');
    },
    onError: (error) => {
      showError(getErrorMessage(error, 'Failed to update task'));
    },
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showSuccess('Task deleted successfully');
    },
    onError: (error) => {
      showError(getErrorMessage(error, 'Failed to delete task'));
    },
  });

  const cancelTask = useMutation({
    mutationFn: (id: string) => tasksApi.cancelTask(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showSuccess('Task execution cancelled');
    },
    onError: (error) => {
      showError(getErrorMessage(error, 'Failed to cancel task'));
    },
  });

  const retryTask = useMutation({
    mutationFn: (id: string) => tasksApi.retryTask(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showSuccess('Task requeued for retry');
    },
    onError: (error) => {
      showError(getErrorMessage(error, 'Failed to retry task'));
    },
  });

  const duplicateTask = useMutation({
    mutationFn: (id: string) => tasksApi.duplicateTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      showSuccess('Task duplicated successfully');
    },
    onError: (error) => {
      showError(getErrorMessage(error, 'Failed to duplicate task'));
    },
  });

  return {
    createTask: createTask.mutateAsync,
    isCreating: createTask.isPending,
    updateTask: updateTask.mutateAsync,
    isUpdating: updateTask.isPending,
    deleteTask: deleteTask.mutateAsync,
    isDeleting: deleteTask.isPending,
    cancelTask: cancelTask.mutateAsync,
    isCancelling: cancelTask.isPending,
    retryTask: retryTask.mutateAsync,
    isRetrying: retryTask.isPending,
    duplicateTask: duplicateTask.mutateAsync,
    isDuplicating: duplicateTask.isPending,
  };
}
