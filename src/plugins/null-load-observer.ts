/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoadObserver } from '../load-observer';

export class NullLoadObserver implements LoadObserver {
    async onStart(): Promise<void> {}
    async onFinish(): Promise<void> {}
    async onStartFile(filename: string): Promise<void> {}
    async onFinishFile(filename: string, lineCount: number): Promise<void> {}
}
