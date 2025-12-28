import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Upload, Link as LinkIcon, X } from 'lucide-react';
import { Progress } from './ui/progress';
import api from '../lib/api';

export default function DualFilePicker({ onFileSelected, onCancel }) {
    const [mode, setMode] = useState(null); // 'upload' or 'link'
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [linkInput, setLinkInput] = useState({ url: '', name: '' });
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file');
            return;
        }

        try {
            setUploading(true);
            setUploadProgress(0);

            const formData = new FormData();
            formData.append('file', selectedFile);

            // Upload with progress tracking
            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
            });

            onFileSelected({
                name: response.data.file.name,
                url: response.data.file.url,
                fileType: response.data.file.mimetype || 'file',
                source: 'upload', // Mark as uploaded file
            });

            resetState();
        } catch (error) {
            console.error('Upload error:', error);
            alert(error.response?.data?.message || 'Failed to upload file. Please try again.');
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleLinkSubmit = () => {
        if (!linkInput.url || !linkInput.name) {
            alert('Please fill in both fields');
            return;
        }

        onFileSelected({
            name: linkInput.name,
            url: linkInput.url,
            fileType: 'link',
            source: 'drive', // Mark as Google Drive link
        });

        resetState();
    };

    const resetState = () => {
        setMode(null);
        setSelectedFile(null);
        setUploading(false);
        setUploadProgress(0);
        setLinkInput({ url: '', name: '' });
    };

    const handleCancel = () => {
        resetState();
        if (onCancel) onCancel();
    };

    // Selection screen
    if (!mode) {
        return (
            <div className="p-4 bg-muted rounded-lg border space-y-3">
                <p className="text-sm font-semibold mb-3">Choose how to add your file:</p>

                <div className="grid grid-cols-1 gap-3">
                    {/* Desktop Upload Option */}
                    <button
                        type="button"
                        onClick={() => setMode('upload')}
                        className="p-4 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                        <div className="flex items-start gap-3">
                            <Upload className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <p className="font-semibold text-sm mb-1">Upload from Desktop</p>
                                <p className="text-xs text-muted-foreground">
                                    Select a file from your computer and upload it directly to the server
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* Google Drive Link Option */}
                    <button
                        type="button"
                        onClick={() => setMode('link')}
                        className="p-4 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                        <div className="flex items-start gap-3">
                            <LinkIcon className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <p className="font-semibold text-sm mb-1">Google Drive Link</p>
                                <p className="text-xs text-muted-foreground">
                                    Paste a link to a file in your Google Drive
                                </p>
                            </div>
                        </div>
                    </button>
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2"
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
            </div>
        );
    }

    // Desktop Upload Mode
    if (mode === 'upload') {
        return (
            <div className="p-4 bg-muted rounded-lg border space-y-3">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">Upload File from Desktop</p>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setMode(null)}
                        disabled={uploading}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-3">
                    <div
                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                        onClick={() => !uploading && fileInputRef.current?.click()}
                    >
                        {selectedFile ? (
                            <div>
                                <Upload className="h-10 w-10 mx-auto mb-2 text-green-600" />
                                <p className="font-medium text-sm">{selectedFile.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        ) : (
                            <div>
                                <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm font-medium">Click to select a file</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Max size: 50MB
                                </p>
                            </div>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        disabled={uploading}
                    />

                    {uploading && (
                        <div className="space-y-2">
                            <Progress value={uploadProgress} />
                            <p className="text-xs text-center text-muted-foreground">
                                Uploading... {uploadProgress}%
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        onClick={handleFileUpload}
                        disabled={!selectedFile || uploading}
                        className="flex-1"
                    >
                        {uploading ? 'Uploading...' : 'Upload File'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setMode(null)}
                        disabled={uploading}
                    >
                        Back
                    </Button>
                </div>
            </div>
        );
    }

    // Google Drive Link Mode
    if (mode === 'link') {
        return (
            <div className="p-4 bg-muted rounded-lg border space-y-3">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">Add Google Drive Link</p>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setMode(null)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-3">
                    <div>
                        <Label htmlFor="linkName">File Name</Label>
                        <Input
                            id="linkName"
                            placeholder="e.g., Project Specifications"
                            value={linkInput.name}
                            onChange={(e) => setLinkInput({ ...linkInput, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="linkUrl">Google Drive URL</Label>
                        <Input
                            id="linkUrl"
                            placeholder="https://drive.google.com/..."
                            value={linkInput.url}
                            onChange={(e) => setLinkInput({ ...linkInput, url: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Make sure the file is set to "Anyone with the link can view"
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        onClick={handleLinkSubmit}
                        disabled={!linkInput.url || !linkInput.name}
                        className="flex-1"
                    >
                        Add Link
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setMode(null)}
                    >
                        Back
                    </Button>
                </div>
            </div>
        );
    }

    return null;
}
