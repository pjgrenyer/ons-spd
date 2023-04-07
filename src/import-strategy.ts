import * as fs from 'fs';

export interface ImportStrategy {
    parishes(): fs.ReadStream;
    postcodes(postcodeFilePath: string): fs.ReadStream;
    postcodeFilePaths(): string[];
}
