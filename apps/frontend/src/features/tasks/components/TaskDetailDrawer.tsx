import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTaskDetail, useTaskMutations } from '../hooks/useTaskQueries.js';
import { TaskStatusBadge, PriorityBadge } from './TaskStatusBadge.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog.js';
import { Button } from '../../../components/ui/button.js';
import { Input } from '../../../components/ui/input.js';
import { Textarea } from '../../../components/ui/textarea.js';
import { FormFieldWrapper } from '../../../components/forms/FormFieldWrapper.js';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner.js';
import { Clock, History, FileText, Paperclip, RotateCcw, Ban, Copy, Trash2, Edit2 } from 'lucide-react';

const editTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});
type EditTaskForm = z.infer<typeof editTaskSchema>;

interface TaskDetailDrawerProps {
  taskId: string | null;
  onClose: () => void;
}

export function TaskDetailDrawer({ taskId, onClose }: TaskDetailDrawerProps) {
  const { data: task, isLoading } = useTaskDetail(taskId || undefined);
  const { cancelTask, isCancelling, retryTask, isRetrying, duplicateTask, isDuplicating, deleteTask, isDeleting, updateTask, isUpdating } =
    useTaskMutations();

  const [isEditing, setIsEditing] = useState(false);

  const editForm = useForm<EditTaskForm>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: { title: '', description: '', priority: 'MEDIUM' },
  });

  useEffect(() => {
    if (task) {
      editForm.reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
      });
    }
  }, [task]);

  if (!taskId) return null;

  return (
    <Dialog open={!!taskId} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <DialogTitle className="text-lg sm:text-xl font-bold break-words">{task?.title || 'Task Details'}</DialogTitle>
            {task && (
              <div className="flex flex-wrap items-center gap-2">
                <TaskStatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>
            )}
          </div>
          <DialogDescription className="break-all text-xs">ID: {taskId}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : task ? (
          <div className="space-y-6 pt-2 text-sm">
            {/* Description Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Description</h4>
              <p className="text-foreground bg-muted/40 p-3 rounded-lg border border-border text-xs sm:text-sm leading-relaxed break-words">
                {task.description || 'No description provided.'}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3 rounded-lg border border-border bg-card">
              <div>
                <span className="text-xs text-muted-foreground block">Created By</span>
                <span className="font-semibold text-xs sm:text-sm">{task.author?.name || 'System'}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Assignee</span>
                <span className="font-semibold text-xs sm:text-sm">{task.assignee?.name || 'Unassigned'}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Retry Count</span>
                <span className="font-semibold text-xs sm:text-sm">{task.retryCount}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Created At</span>
                <span className="font-semibold text-xs sm:text-sm">{new Date(task.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Updated At</span>
                <span className="font-semibold text-xs sm:text-sm">{new Date(task.updatedAt).toLocaleString()}</span>
              </div>
              {task.attachment && (
                <div>
                  <span className="text-xs text-muted-foreground block">Attachment</span>
                  <a
                    href={task.attachment}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary font-medium hover:underline flex items-center gap-1 text-xs sm:text-sm truncate"
                  >
                    <Paperclip className="w-3.5 h-3.5 shrink-0" /> File Link
                  </a>
                </div>
              )}
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-2">
              {task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && (
                <Button
                  variant="outline"
                  size="sm"
                  isLoading={isCancelling}
                  onClick={async () => {
                    await cancelTask(task.id);
                    onClose();
                  }}
                  className="text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
                >
                  <Ban className="w-3.5 h-3.5 mr-1" /> Cancel Task
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                isLoading={isRetrying}
                onClick={async () => {
                  await retryTask(task.id);
                  onClose();
                }}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Requeue / Retry
              </Button>

              <Button
                variant="outline"
                size="sm"
                isLoading={isDuplicating}
                onClick={async () => {
                  await duplicateTask(task.id);
                  onClose();
                }}
              >
                <Copy className="w-3.5 h-3.5 mr-1" /> Duplicate
              </Button>

              <Button
                variant="destructive"
                size="sm"
                isLoading={isDeleting}
                onClick={async () => {
                  if (confirm('Are you sure you want to delete this task?')) {
                    await deleteTask(task.id);
                    onClose();
                  }
                }}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className={isEditing ? 'border-primary text-primary' : ''}
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" /> {isEditing ? 'Cancel Edit' : 'Edit Task'}
              </Button>
            </div>

            {/* Inline Edit Form */}
            {isEditing && (
              <form
                onSubmit={editForm.handleSubmit(async (data) => {
                  await updateTask({ id: task.id, data });
                  setIsEditing(false);
                })}
                className="p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-3"
              >
                <h4 className="text-sm font-semibold text-foreground">Edit Task Details</h4>
                <FormFieldWrapper label="Title" error={editForm.formState.errors.title?.message} required>
                  <Input {...editForm.register('title')} className="text-sm" />
                </FormFieldWrapper>
                <FormFieldWrapper label="Description" error={editForm.formState.errors.description?.message}>
                  <Textarea {...editForm.register('description')} rows={2} className="text-sm" />
                </FormFieldWrapper>
                <FormFieldWrapper label="Priority">
                  <select
                    {...editForm.register('priority')}
                    className="w-full px-3 py-2 text-sm rounded-md bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </FormFieldWrapper>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="submit" size="sm" isLoading={isUpdating}>Save Changes</Button>
                </div>
              </form>
            )}

            {/* History Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-primary" /> Status Transition History
              </h4>
              {task.history && task.history.length > 0 ? (
                <div className="space-y-2 pl-2 border-l-2 border-primary/20">
                  {task.history.map((h) => (
                    <div key={h.id} className="text-xs space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {h.oldStatus || 'NONE'} → {h.newStatus}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(h.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      {h.notes && <p className="text-muted-foreground">{h.notes}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No transition history recorded.</p>
              )}
            </div>

            {/* Output Logs */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-primary" /> Execution Logs
              </h4>
              {task.logs && task.logs.length > 0 ? (
                <div className="bg-slate-950 text-slate-200 p-3 rounded-lg font-mono text-xs max-h-48 overflow-y-auto space-y-1">
                  {task.logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2">
                      <Clock className="w-3 h-3 text-muted-foreground mt-0.5" />
                      <span className="text-slate-400">[{new Date(log.createdAt).toLocaleTimeString()}]</span>
                      <span className={log.level === 'warn' ? 'text-amber-400' : 'text-emerald-400'}>
                        [{log.level.toUpperCase()}]
                      </span>
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No logs generated yet.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="py-8 text-center text-muted-foreground">Task not found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
