import { Client } from 'pg';
import { PgRepository } from './pg-repository';

export class ManagedPgRepository extends PgRepository {
    constructor(connectionString: string) {
        super(new Client({ connectionString }));
    }

    async connect(): Promise<void> {
        await super.client.connect();
    }

    async cleanUp(): Promise<void> {
        await super.client.end();
    }
}
