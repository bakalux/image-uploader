import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CloudUpload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUploadImage } from '@/mutations/use-upload-image.ts';
import { toast } from 'sonner';

type UploadDropzoneProps = {
  onDrop?: (files: File[]) => void;
};

export function UploadDropzone({ onDrop }: UploadDropzoneProps) {
  const mutation = useUploadImage();
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (onDrop) {
      onDrop(acceptedFiles);
    }

    if (acceptedFiles.length === 0) {
      return console.error('No files uploaded');
    }

    if (acceptedFiles.length > 1) {
      toast.error('Не поддерживается загрузка больше одного файла');
      return;
    }

    mutation.mutate(acceptedFiles[0]);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        'flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed cursor-pointer transition-colors',
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-muted',
      )}
    >
      <input {...getInputProps()} />
      <CloudUpload className="w-8 h-8 text-muted-foreground" />
      <p className="text-muted-foreground text-sm text-center">
        Перетащите файл сюда или нажмите для выбора
      </p>
      <Button variant="outline" size="sm">
        Выбрать файл
      </Button>
    </Card>
  );
}
