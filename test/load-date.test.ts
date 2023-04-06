import * as fs from 'fs';
import csvtoJson from 'csvtojson';
import { Client } from 'pg';

interface ImportStrategy {
    parishes(): fs.ReadStream;
    data(): fs.ReadStream;
}

class FileImport implements ImportStrategy {
    constructor(private parishFilePath: string, private dataFilePath: string) {
        this.parishFilePath = parishFilePath;
        this.dataFilePath = dataFilePath;
    }

    parishes(): fs.ReadStream {
        return this.createStream(this.parishFilePath);
    }

    data(): fs.ReadStream {
        return this.createStream(this.dataFilePath);
    }

    private createStream(filePath: string): fs.ReadStream {
        return fs.createReadStream(filePath);
    }
}

interface Repository {
    upsertParish(parncp21cd: string, parncp21nm: string): Promise<void>;
}

class PgRepository implements Repository {
    constructor(private client: any) {}

    async upsertParish(parncp21cd: string, parncp21nm: string) {
        await this.client.query('BEGIN');
        try {
            await this.client.query('UPDATE public.parishes SET parncp21cd=$1::text, parncp21nm=$2::text, updatedAt = current_timestamp WHERE parncp21cd=$1::text;', [
                parncp21cd,
                parncp21nm,
            ]);
            await this.client.query(
                'INSERT INTO public.parishes (parncp21cd, parncp21nm, createdAt) SELECT $1::text, $2::text, current_timestamp WHERE NOT EXISTS (SELECT 1 FROM public.parishes WHERE parncp21cd=$1::text);',
                [parncp21cd, parncp21nm]
            );
            await this.client.query('COMMIT');
        } catch (error: any) {
            await this.client.query('ROLLBACK');
            throw error;
        }
    }
}

const loadData = async (importStrategy: ImportStrategy, repository: Repository) => {
    const parishStream = importStrategy.parishes();
    try {
        await csvtoJson()
            .fromStream(parishStream)
            .subscribe((line) => repository.upsertParish(line['PARNCP21CD'], line['PARNCP21NM']));
    } finally {
        parishStream.close();
    }

    // const dataStream = importStrategy.data();
    // try {
    //     await csvtoJson()
    //         .fromStream(dataStream)
    //         .subscribe((line) => console.log(line));
    // } finally {
    //     dataStream.close();
    // }
};

const parishFilePath = '/home/paul/Downloads/ONSPD_FEB_2023_UK/Documents/Parish_NCP names and codes EW as at 12_21.csv';
const dataFilePath = '/home/paul/Downloads/ONSPD_FEB_2023_UK/Data/ONSPD_FEB_2023_UK.csv';

describe('load data', () => {
    it('', async () => {
        const importStrategy = new FileImport(parishFilePath, dataFilePath);

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
