import { Repository } from '../repository';

export class PgRepository implements Repository {
    constructor(protected client: any) {}

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

    async upsertPostcodes(pcds: string, parish: string, oseast1m: number, osnrth1m: number) {
        const data = [pcds, parish, oseast1m, osnrth1m];
        await this.client.query('BEGIN');
        try {
            await this.client.query(
                'UPDATE public.postcodes SET pcds=$1::text, parish=$2::text, oseast1m=$3, osnrth1m = $4, updatedAt = current_timestamp WHERE pcds=$1::text;',
                data
            );
            await this.client.query(
                'INSERT INTO public.postcodes (pcds, parish, oseast1m, osnrth1m, createdAt) SELECT $1::text, $2::text, $3, $4, current_timestamp WHERE NOT EXISTS (SELECT 1 FROM public.postcodes WHERE pcds=$1::text);',
                data
            );
            await this.client.query('COMMIT');
        } catch (error: any) {
            await this.client.query('ROLLBACK');
            throw error;
        }
    }

    async connect() {
        /* No Op */
    }

    async cleanUp() {
        /* No Op */
    }
}
