import * as fs from 'fs';

export interface ImportStrategy {
    countries(): { filePath: string; stream: fs.ReadStream };
    counties(): { filePath: string; stream: fs.ReadStream };
    parishes(): { filePath: string; stream: fs.ReadStream };
    postcodes(postcodeFilePath: string): { filePath: string; stream: fs.ReadStream };
    postcodeFilePaths(): string[];
}
