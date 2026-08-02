import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog.js';
import { Button } from '../../../components/ui/button.js';
import { Input } from '../../../components/ui/input.js';
import { Textarea } from '../../../components/ui/textarea.js';
import { FormFieldWrapper } from '../../../components/forms/FormFieldWrapper.js';
import { useTaskMutations } from '../hooks/useTaskQueries.js';
import { Priority } from '../types/tasks.types.js';
import { FileUploader } from '../../../components/common/FileUploader.js';
import { Plus } from 'lucide-react';

const createTaskValidationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  scheduledTime: z.string().optional(),
  attachment: z.string().optional(),
});

type CreateTaskFormType = z.infer<typeof createTaskValidationSchema>;

interface TaskBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskBuilderModal({ isOpen, onClose }: TaskBuilderModalProps) {
  const { createTask, isCreating } = useTaskMutations();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormType>({
    resolver: zodResolver(createTaskValidationSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
      scheduledTime: '',
      attachment: '',
    },
  });

  const onSubmit = async (data: CreateTaskFormType) => {
    try {
      await createTask({
        title: data.title,
        description: data.description || undefined,
        priority: data.priority as Priority,
        scheduledTime: data.scheduledTime || undefined,
        attachment: data.attachment || undefined,
      });
      reset();
      onClose();
    } catch {
      // Toast handles error
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" /> Create Task Execution
          </DialogTitle>
          <DialogDescription>
            Configure parameters for automated job queue dispatch.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <FormFieldWrapper label="Task Title" error={errors.title?.message} required>
            <Input {...register('title')} placeholder="e.g. Daily Data Export & Sync" error={!!errors.title} />
          </FormFieldWrapper>

          <FormFieldWrapper label="Description" error={errors.description?.message}>
            <Textarea
              {...register('description')}
              placeholder="Describe execution instructions, payload, or target endpoints..."
              rows={3}
            />
          </FormFieldWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormFieldWrapper label="Priority Level">
              <select
                {...register('priority')}
                className="w-full px-3 py-2 text-sm rounded-md bg-background border border-border focus:ring-1 focus:ring-primary outline-none min-h-[40px] sm:min-h-[38px]"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </FormFieldWrapper>

            <FormFieldWrapper label="Scheduled Time">
              <Input {...register('scheduledTime')} type="datetime-local" className="text-xs min-h-[40px] sm:min-h-[38px]" />
            </FormFieldWrapper>
          </div>

          <div className="space-y-2">
            <FileUploader
              label="Task Attachment (Optional)"
              allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']}
              onUploadSuccess={(url) => {
                setValue('attachment', url);
              }}
              acceptText="Upload PDF or Image attachment for task context"
            />
            <Input
              {...register('attachment')}
              placeholder="Or paste attachment URL directly..."
              className="text-xs min-h-[38px]"
            />
          </div>

          <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto min-h-[44px] sm:min-h-[38px]">
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating} className="w-full sm:w-auto font-semibold min-h-[44px] sm:min-h-[38px]">
              Enqueue Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
