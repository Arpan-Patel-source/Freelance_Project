import { useState, useEffect, useCallback } from 'react';

// Google API Configuration
// NOTE: Replace these with your actual Google API credentials
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const API_KEY = 'YOUR_GOOGLE_API_KEY';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

export function useGoogleDrive() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [tokenClient, setTokenClient] = useState(null);

    // Initialize Google API
    useEffect(() => {
        const initClient = () => {
            if (!window.gapi) return;

            window.gapi.load('client:picker', async () => {
                try {
                    await window.gapi.client.init({
                        apiKey: API_KEY,
                        discoveryDocs: DISCOVERY_DOCS,
                    });
                    setIsInitialized(true);
                } catch (error) {
                    console.error('Error initializing Google API:', error);
                }
            });
        };

        // Initialize token client for OAuth
        if (window.google?.accounts?.oauth2) {
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: (response) => {
                    if (response.access_token) {
                        setIsAuthenticated(true);
                    }
                },
            });
            setTokenClient(client);
        }

        initClient();
    }, []);

    // Authenticate user
    const authenticate = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (!tokenClient) {
                reject(new Error('Token client not initialized'));
                return;
            }

            tokenClient.callback = (response) => {
                if (response.error) {
                    reject(response);
                    return;
                }
                setIsAuthenticated(true);
                resolve(response);
            };

            tokenClient.requestAccessToken();
        });
    }, [tokenClient]);

    // Open Google Drive Picker
    const openPicker = useCallback((onFileSelected) => {
        return new Promise(async (resolve, reject) => {
            if (!isInitialized) {
                reject(new Error('Google API not initialized'));
                return;
            }

            if (!isAuthenticated) {
                try {
                    await authenticate();
                } catch (error) {
                    reject(error);
                    return;
                }
            }

            const token = window.gapi.client.getToken();
            if (!token) {
                reject(new Error('No access token'));
                return;
            }

            const picker = new window.google.picker.PickerBuilder()
                .addView(window.google.picker.ViewId.DOCS)
                .addView(new window.google.picker.DocsUploadView())
                .setOAuthToken(token.access_token)
                .setDeveloperKey(API_KEY)
                .setCallback((data) => {
                    if (data.action === window.google.picker.Action.PICKED) {
                        const file = data.docs[0];
                        const fileInfo = {
                            id: file.id,
                            name: file.name,
                            url: file.url,
                            mimeType: file.mimeType,
                        };

                        // Make the file shareable and get a public link
                        makeFileShareable(file.id).then((shareableUrl) => {
                            fileInfo.url = shareableUrl;
                            if (onFileSelected) onFileSelected(fileInfo);
                            resolve(fileInfo);
                        }).catch((error) => {
                            console.error('Error making file shareable:', error);
                            // Use the original URL if sharing fails
                            if (onFileSelected) onFileSelected(fileInfo);
                            resolve(fileInfo);
                        });
                    } else if (data.action === window.google.picker.Action.CANCEL) {
                        resolve(null);
                    }
                })
                .build();

            picker.setVisible(true);
        });
    }, [isInitialized, isAuthenticated, authenticate]);

    // Make file shareable and get public URL
    const makeFileShareable = async (fileId) => {
        try {
            // Set file permissions to anyone with the link can view
            await window.gapi.client.drive.permissions.create({
                fileId: fileId,
                resource: {
                    role: 'reader',
                    type: 'anyone',
                },
            });

            // Get the file metadata with webViewLink
            const response = await window.gapi.client.drive.files.get({
                fileId: fileId,
                fields: 'webViewLink,webContentLink',
            });

            return response.result.webViewLink || response.result.webContentLink;
        } catch (error) {
            console.error('Error making file shareable:', error);
            throw error;
        }
    };

    // Upload file from desktop to Google Drive
    const uploadFile = useCallback((file, onProgress) => {
        return new Promise(async (resolve, reject) => {
            if (!isAuthenticated) {
                try {
                    await authenticate();
                } catch (error) {
                    reject(error);
                    return;
                }
            }

            const metadata = {
                name: file.name,
                mimeType: file.type,
            };

            const formData = new FormData();
            formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            formData.append('file', file);

            const token = window.gapi.client.getToken();
            if (!token) {
                reject(new Error('No access token'));
                return;
            }

            try {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink');
                xhr.setRequestHeader('Authorization', `Bearer ${token.access_token}`);

                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable && onProgress) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(percentComplete);
                    }
                };

                xhr.onload = async () => {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);

                        // Make file shareable
                        try {
                            const shareableUrl = await makeFileShareable(response.id);
                            resolve({
                                id: response.id,
                                name: response.name,
                                url: shareableUrl,
                                mimeType: file.type,
                            });
                        } catch (error) {
                            console.error('Error making uploaded file shareable:', error);
                            resolve({
                                id: response.id,
                                name: response.name,
                                url: response.webViewLink || response.webContentLink,
                                mimeType: file.type,
                            });
                        }
                    } else {
                        reject(new Error(`Upload failed: ${xhr.statusText}`));
                    }
                };

                xhr.onerror = () => reject(new Error('Upload failed'));
                xhr.send(formData);
            } catch (error) {
                reject(error);
            }
        });
    }, [isAuthenticated, authenticate]);

    return {
        isInitialized,
        isAuthenticated,
        authenticate,
        openPicker,
        uploadFile,
    };
}
