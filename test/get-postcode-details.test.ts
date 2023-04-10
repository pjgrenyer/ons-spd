import { ManagedPgRepository } from '../src/plugins/managed-pg-repository';

describe('', () => {
    it('', async () => {
        const connectionString = 'postgresql://postgres:Password1@localhost:5432/ons_spd?schema=public';
        const repo = new ManagedPgRepository(connectionString);
        await repo.connect();
        try {
            await repo.getPostcodeDetails('AB25 9AN');
        } finally {
            await repo.cleanUp();
        }
    });
});
