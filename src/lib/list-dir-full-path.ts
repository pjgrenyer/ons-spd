import path from 'path';
import { readdir } from 'fs/promises';

export const listDirFullPath = async (dirPath: string) => {
    const entries = await readdir(dirPath);
    return entries.map((file: string) => path.join(dirPath, file));
};
