import { useLatestImage } from '@/queries/use-latest-image';
import { useLatestProcessedImageUrl } from '@/queries/use-latest-proccessed-url';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statusLabels: Record<string, string> = {
  uploaded: 'Загружено',
  processing: 'Обрабатывается',
  processed: 'Обработано',
};

export function getImageStatusLabel(status: string): string {
  return statusLabels[status] ?? 'Неизвестно';
}

export const LatestImageCard = () => {
  const { data: image, isLoading } = useLatestImage();
  const { data: processedData } = useLatestProcessedImageUrl(image?.status === 'processed');

  if (isLoading) return <p>Загрузка...</p>;
  if (!image) return <p>Нет загруженных изображений</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Последнее изображение</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {processedData?.url ? (
          <img
            src={processedData.url}
            alt="Обработанное изображение"
            className="rounded-md w-full max-w-lg max-h-[400px] object-contain"
          />
        ) : (
          <p>Изображение еще обрабатывается...</p>
        )}
        <div className="w-full max-w-lg text-sm space-y-1">
          <div className="flex">
            <div className="w-40 font-semibold">Имя файла:</div>
            <div>{image.name}</div>
          </div>
          <div className="flex">
            <div className="w-40 font-semibold">Статус:</div>
            <div>{getImageStatusLabel(image.status)}</div>
          </div>
          <div className="flex">
            <div className="w-40 font-semibold">Дата загрузки:</div>
            <div>{new Date(image.uploadedAt).toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
