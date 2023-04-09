import { Client } from 'pg';
import { PgRepository } from './pg-repository';

export class ManagedPgRepository extends PgRepository {
    constructor(connectionString: string) {
        super(new Client({ connectionString }));
    }

    async connect(): Promise<void> {
        await this.client.connect();
    }

    async cleanUp(): Promise<void> {
        await this.client.end();
    }
}
