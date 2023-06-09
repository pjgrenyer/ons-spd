import { FileImport } from './plugins/file-import';
import { loadData } from './load-data';
import { listDirFullPath } from './lib/list-dir-full-path';
import { ManagedPgRepository } from './plugins/managed-pg-repository';
import { ConsoleLoadObserver } from './plugins/console-load-observer';

const parishFilePath = '/home/paul/Downloads/ONSPD_FEB_2023_UK/Documents/Parish_NCP names and codes EW as at 12_21.csv';
const countiesFilePath = '/home/paul/Downloads/ONSPD_FEB_2023_UK/Documents/County names and codes UK as at 04_21.csv';
const countriesFilePath = '/home/paul/Downloads/ONSPD_FEB_2023_UK/Documents/Country names and codes UK as at 08_12.csv';
const postcodeFileDir = '/home/paul/Downloads/ONSPD_FEB_2023_UK/Data/multi_csv';
const connectionString = 'postgresql://postgres:Password1@localhost:5432/ons_spd?schema=public';

const main = async () => {
    const importStrategy = new FileImport(countriesFilePath, countiesFilePath, parishFilePath, await listDirFullPath(postcodeFileDir));
    const repo = new ManagedPgRepository(connectionString);
    await loadData(importStrategy, repo, new ConsoleLoadObserver());
};

main();
