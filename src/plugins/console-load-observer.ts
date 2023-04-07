import { LoadObserver } from '../load-observer';

export class ConsoleLoadObserver implements LoadObserver {
    async onStart(): Promise<void> {
        // eslint-disable-next-line no-console
        console.log('Load started');
    }
    async onFinish(): Promise<void> {
        // eslint-disable-next-line no-console
        console.log('Load finished.');
    }
    async onStartFile(filename: string): Promise<void> {
        // eslint-disable-next-line no-console
        console.log(`Loading ${filename}`);
    }
    async onFinishFile(filename: string, lineCount: number): Promise<void> {
        // eslint-disable-next-line no-console
        console.log(`Finished loading ${filename}. ${lineCount} rows.`);
    }
}
