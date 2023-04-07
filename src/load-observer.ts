export interface LoadObserver {
    onStart(): Promise<void>;
    onFinish(): Promise<void>;
    onStartFile(filename: string): Promise<void>;
    onFinishFile(filename: string, lineCount: number): Promise<void>;
}
