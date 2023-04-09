import { Client } from 'pg';
import { FileImport } from '../src/plugins/file-import';
import { PgRepository } from '../src/plugins/pg-repository';
import { loadData } from '../src/load-data';

const countriesFilePath = '/home/paul/Downloads/ONSPD_FEB_2023_UK/Documents/Country names and codes UK as at 08_12.csv';
const countiesFilePath = '/home/paul/Downloads/ONSPD_FEB_2023_UK/Documents/County names and codes UK as at 04_21.csv';
const parishFilePath = '/home/paul/Downloads/ONSPD_FEB_2023_UK/Documents/Parish_NCP names and codes EW as at 12_21.csv';
const dataFilePath = '/home/paul/Downloads/ONSPD_FEB_2023_UK/Data/ONSPD_FEB_2023_UK.csv';

describe('load data', () => {
    it.skip('', async () => {
        const importStrategy = new FileImport(countriesFilePath, countiesFilePath, parishFilePath, [dataFilePath]);

        const connectionString = 'postgresql://postgres:Password1@localhost:5432/ons_spd?schema=public';
        const client = new Client({
            connectionString,
        });
        await client.connect();

        const repo = new PgRepository(client);
        try {
            await loadData(importStrategy, repo);
        } finally {
            client.end();
        }
    });
});
