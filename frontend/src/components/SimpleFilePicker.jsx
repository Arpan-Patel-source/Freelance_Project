import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useGoogleDrive } from '../hooks/useGoogleDrive';
import { Upload, Link as LinkIcon, X } from 'lucide-react';
import { Progress } from './ui/progress';

export default function SimpleFilePicker({ onFileSelected, onCancel }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showManualLink, setShowManualLink] = useState(false);
    const [manualLink, setManualLink] = useState({ url: '', name: '' });
    const fileInputRef = useRef(null);
    const { uploadFile } = useGoogleDrive();

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Auto-upload the file when selected
            handleFileUpload(file);
        }
    };

    const handleFileUpload = async (file) => {
        try {
            setUploading(true);
            setUploadProgress(0);

            const result = await uploadFile(file, (progress) => {
                setUploadProgress(progress);
            });

            onFileSelected({
                name: result.name,
                url: result.url,
                fileType: result.mimeType || file.type || 'file',
            });

            resetState();
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload file. You can paste a Google Drive link manually instead.');
            setUploading(false);
            setUploadProgress(0);
            setShowManualLink(true);
        }
    };

    const handleManualLinkSubmit = () => {
        if (!manualLink.url || !manualLink.name) {
            alert('Please fill in both fields');
            return;
        }

        onFileSelected({
            name: manualLink.name,
            url: manualLink.url,
            fileType: 'link',
        });

        resetState();
    };

    const resetState = () => {
        setSelectedFile(null);
        setUploading(false);
        setUploadProgress(0);
        setShowManualLink(false);
        setManualLink({ url: '', name: '' });
    };

    const handleCancel = () => {
        resetState();
        if (onCancel) onCancel();
    };

    if (showManualLink) {
        return (
            <div className="p-4 bg-muted rounded-lg border space-y-3">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">Add Link Manually</p>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowManualLink(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-2">
                    <div>
                        <Label htmlFor="linkName">File Name</Label>
                        <Input
                            id="linkName"
                            placeholder="e.g., Project Specifications"
                            value={manualLink.name}
                            onChange={(e) => setManualLink({ ...manualLink, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="linkUrl">Google Drive URL</Label>
                        <Input
                            id="linkUrl"
                            placeholder="https://drive.google.com/..."
                            value={manualLink.url}
                            onChange={(e) => setManualLink({ ...manualLink, url: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        onClick={handleManualLinkSubmit}
                        disabled={!manualLink.url || !manualLink.name}
                        className="flex-1"
                    >
                        Add Link
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-muted rounded-lg border space-y-3">
            <p className="text-sm font-semibold mb-2">Upload File</p>

            <div className="space-y-3">
                <div
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => !uploading && fileInputRef.current?.click()}
                >
                    {uploading ? (
                        <div>
                            <Upload className="h-12 w-12 mx-auto mb-3 text-primary animate-pulse" />
                            <p className="font-medium mb-1">Uploading to Google Drive...</p>
                            <p className="text-sm text-muted-foreground mb-3">{selectedFile?.name}</p>
                            <Progress value={uploadProgress} className="mb-2" />
                            <p className="text-xs text-muted-foreground">
                                {Math.round(uploadProgress)}%
                            </p>
                        </div>
                    ) : (
                        <div>
                            <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-sm font-medium mb-1">Click to select a file</p>
                            <p className="text-xs text-muted-foreground">
                                File will be uploaded to Google Drive and shared
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

                <p className="text-xs text-muted-foreground text-center">
                    ⓘ Files are uploaded to your Google Drive with shareable links
                </p>
            </div>

            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowManualLink(true)}
                    className="flex-1"
                    disabled={uploading}
                >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Or Paste Link
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={uploading}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}
