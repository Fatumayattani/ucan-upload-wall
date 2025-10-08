import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { FileList } from './components/FileList';
import { Alert } from './components/Alert';
import { useFileUpload } from './hooks/useFileUpload';
import { UploadedFile } from './types/upload';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { uploadFile, isUploading, error } = useFileUpload();

  const handleFileSelect = useCallback(async (file: File) => {
    const result = await uploadFile(file);

    if (result && result.ok) {
      const newFile: UploadedFile = {
        id: crypto.randomUUID(),
        cid: result.cid,
        filename: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };

      setUploadedFiles(prev => [newFile, ...prev]);
      setAlert({
        type: 'success',
        message: `Successfully uploaded ${file.name}!`,
      });
    } else if (error) {
      setAlert({
        type: 'error',
        message: error,
      });
    }
  }, [uploadFile, error]);

  const handleCloseAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Store it your way
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Upload files directly to the Storacha network with UCAN authorization.
  Your data stays verifiable, private, and under your control — no tokens, no intermediaries.
            </p>
          </div>

          <UploadZone onFileSelect={handleFileSelect} isUploading={isUploading} />
          <FileList files={uploadedFiles} />
        </div>
      </main>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={handleCloseAlert}
        />
      )}
    </div>
  );
}

export default App;
