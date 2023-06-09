import { PostcodeDetails } from '../postcore-details';
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

    async upsertCountry(ctry12cn: string, ctry12cdo: string, ctry12nm: string, ctry12nmw: string) {
        const data = [ctry12cn, ctry12cdo, ctry12nm, ctry12nmw];
        await this.client.query('BEGIN');
        try {
            await this.client.query(
                'UPDATE onsspd.countries SET ctry12cn = $1, ctry12cdo = $2, ctry12nm = $3, ctry12nmw = $4, updatedAt = current_timestamp WHERE ctry12cn=$1;',
                data
            );
            await this.client.query(
                'INSERT INTO onsspd.countries (ctry12cn, ctry12cdo, ctry12nm, ctry12nmw, createdAt) SELECT $1::text, $2, $3::text, $4::text, current_timestamp WHERE NOT EXISTS (SELECT 1 FROM onsspd.countries WHERE ctry12cn=$1);',
                data
            );
            await this.client.query('COMMIT');
        } catch (error: any) {
            await this.client.query('ROLLBACK');
            throw error;
        }
    }

    async upsertCounty(cty21cd: string, cty21nm: string) {
        const data = [cty21cd, cty21nm];

        await this.client.query('BEGIN');
        try {
            await this.client.query('UPDATE onsspd.counties SET cty21cd=$1::text, cty21nm=$2::text, updatedAt = current_timestamp WHERE cty21cd=$1::text;', data);
            await this.client.query(
                'INSERT INTO onsspd.counties (cty21cd, cty21nm, createdAt) SELECT $1::text, $2::text, current_timestamp WHERE NOT EXISTS (SELECT 1 FROM onsspd.counties WHERE cty21cd=$1::text);',
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

    async upsertPostcodes(
        pcds: string,
        dointr: number,
        doterm: number | null,
        parish: string,
        oscty: string,
        ctry: string,
        oseast1m: number | null,
        osnrth1m: number | null,
        osgrdind: number,
        longitude: number | null,
        latitude: number | null
    ) {
        const data = [pcds, dointr, doterm, parish, oscty, ctry, oseast1m, osnrth1m, osgrdind, longitude, latitude];
        await this.client.query('BEGIN');
        try {
            await this.client.query(
                'UPDATE onsspd.postcodes SET pcds=$1::text, dointr = $2, doterm = $3, parish=$4::text, oscty=$5::text, ctry=$6::text, oseast1m=$7, osnrth1m = $8, osgrdind = $9, longitude = $10, latitude = $11, updatedAt = current_timestamp WHERE pcds=$1::text;',
                data
            );
            await this.client.query(
                'INSERT INTO onsspd.postcodes (pcds, dointr, doterm, parish, oscty, ctry, oseast1m, osnrth1m, osgrdind, longitude, latitude, createdAt) SELECT $1::text, $2, $3, $4::text, $5::text, $6::text, $7, $8, $9, $10, $11, current_timestamp WHERE NOT EXISTS (SELECT 1 FROM onsspd.postcodes WHERE pcds=$1::text);',
                data
            );
            await this.client.query('COMMIT');
        } catch (error: any) {
            await this.client.query('ROLLBACK');
            throw error;
        }
    }

    async getPostcodeDetails(postcode: string): Promise<PostcodeDetails | undefined> {
        const response = await this.client.query(
            'SELECT id, postcode, startdate, terminationdate, parish, county, easting, northing, latitude, longitude, gridreferencepositionalqualityindicatorid, gridreferencepositionalqualityindicator, createdat, updatedat FROM onsspd.postcode_details where postcode = $1;',
            [postcode]
        );
        const row = response.rows[0];
        if (!row) {
            return undefined;
        }
        return {
            id: row.id,
            postcode: row.postcode,
            startDate: row.startdate,
            terminationDate: row.terminationdate != 0 ? row.terminationdate : undefined,
            parish: row.parish,
            county: row.county,
            easting: row.easting ? row.easting : undefined,
            northing: row.northing ? row.northing : undefined,
            latitude: row.latitude ?? undefined,
            longitude: row.longitude ?? undefined,
            gridReferencePositionalQualityIndicatorId: row.gridreferencepositionalqualityindicatorid,
            gridReferencePositionalQualityIndicator: row.gridreferencepositionalqualityindicator,
            createdAt: row.createdat,
            updatedAt: row.updatedat ?? undefined,
        };
    }

    async connect() {
        /* No Op */
    }

    async cleanUp() {
        /* No Op */
    }
}
