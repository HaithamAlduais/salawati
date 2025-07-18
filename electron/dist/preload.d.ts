declare global {
    interface Window {
        electronAPI: {
            storeGet: (key: string) => Promise<any>;
            storeSet: (key: string, value: any) => Promise<boolean>;
            storeDelete: (key: string) => Promise<boolean>;
            showNotification: (title: string, body: string) => Promise<boolean>;
            platform: string;
        };
    }
}
export {};
//# sourceMappingURL=preload.d.ts.map