import MainLayout from "@/layout/MainLayout";
import UploadForm from "@/components/track/UploadForm";

export default function UploadPage() {
  return (
    <MainLayout>
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <UploadForm />
      </main>
    </MainLayout>
  );
}
