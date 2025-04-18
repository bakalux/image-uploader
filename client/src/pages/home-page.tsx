import { UploadDropzone } from '@/components/image-uploader/upload-dropzone.tsx';
import { LatestImageCard } from '@/components/image-uploader/latest-image-card.tsx';

export function HomePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <UploadDropzone />
      <LatestImageCard />
    </div>
  );
}
