import { ImportStrategy } from '../import-strategy';
import * as fs from 'fs';

export class FileImport implements ImportStrategy {
    constructor(countiesFilePath: string, parishFilePath: string, postcodeFilePaths: string[]) {
        this._countiesFilePath = countiesFilePath;
        this._parishFilePath = parishFilePath;
        this._postcodeFilePaths = postcodeFilePaths;
    }

    private _countiesFilePath: string;
    private _parishFilePath: string;
    private _postcodeFilePaths: string[];

    counties(): { filePath: string; stream: fs.ReadStream } {
        return { filePath: this._countiesFilePath, stream: this.createStream(this._countiesFilePath) };
    }

    parishes(): { filePath: string; stream: fs.ReadStream } {
        return { filePath: this._parishFilePath, stream: this.createStream(this._parishFilePath) };
    }

    postcodes(postcodeFilePath: string): { filePath: string; stream: fs.ReadStream } {
        return { filePath: postcodeFilePath, stream: this.createStream(postcodeFilePath) };
    }

    postcodeFilePaths() {
        return this._postcodeFilePaths;
    }

    private createStream(filePath: string): fs.ReadStream {
        return fs.createReadStream(filePath);
    }
}
