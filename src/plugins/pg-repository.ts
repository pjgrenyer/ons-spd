import { Repository } from '../repository';

export class PgRepository implements Repository {
    constructor(protected client: any) {}

    async upsertGridReferencePositionalQualityIndicator(osgrdind: number, description: string) {
        const data = [osgrdind, description];
        await this.client.query('BEGIN');
        try {
            await this.client.query(
                'UPDATE onsspd.grid_reference_positional_quality_indicator SET osgrdind=$1, description=$2::text, updatedAt = current_timestamp WHERE osgrdind=$1;',
                data
            );
            await this.client.query(
                'INSERT INTO onsspd.grid_reference_positional_quality_indicator (osgrdind, description, createdAt) SELECT $1, $2::text, current_timestamp WHERE NOT EXISTS (SELECT 1 FROM onsspd.grid_reference_positional_quality_indicator WHERE osgrdind=$1);',
                data
            );
            await this.client.query('COMMIT');
        } catch (error: any) {
            await this.client.query('ROLLBACK');
            throw error;
        }
    }

    async upsertParish(parncp21cd: string, parncp21nm: string) {
        const data = [parncp21cd, parncp21nm];

        await this.client.query('BEGIN');
        try {
            await this.client.query('UPDATE onsspd.parishes SET parncp21cd=$1::text, parncp21nm=$2::text, updatedAt = current_timestamp WHERE parncp21cd=$1::text;', data);
            await this.client.query(
                'INSERT INTO onsspd.parishes (parncp21cd, parncp21nm, createdAt) SELECT $1::text, $2::text, current_timestamp WHERE NOT EXISTS (SELECT 1 FROM onsspd.parishes WHERE parncp21cd=$1::text);',
                data
            );
            await this.client.query('COMMIT');
        } catch (error: any) {
            await this.client.query('ROLLBACK');
            throw error;
        }
    }

    async upsertPostcodes(pcds: string, parish: string, oseast1m: number, osnrth1m: number, osgrdind: number, longitude: number, latitude: number) {
        const data = [pcds, parish, oseast1m, osnrth1m, osgrdind, longitude, latitude];
        await this.client.query('BEGIN');
        try {
            await this.client.query(
                'UPDATE onsspd.postcodes SET pcds=$1::text, parish=$2::text, oseast1m=$3, osnrth1m = $4, osgrdind = $5, longitude = $6, latitude = $7, updatedAt = current_timestamp WHERE pcds=$1::text;',
                data
            );
            await this.client.query(
                'INSERT INTO onsspd.postcodes (pcds, parish, oseast1m, osnrth1m, osgrdind, longitude, latitude, createdAt) SELECT $1::text, $2::text, $3, $4, $5, $6, $7, current_timestamp WHERE NOT EXISTS (SELECT 1 FROM onsspd.postcodes WHERE pcds=$1::text);',
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
