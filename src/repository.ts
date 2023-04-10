import { PostcodeDetails } from './postcore-details';

export interface Repository {
    upsertGridReferencePositionalQualityIndicator(osgrdind: number, description: string): Promise<void>;
    upsertCountry(ctry12cn: string, ctry12cdo: string, ctry12nm: string, ctry12nmw: string): Promise<void>;
    upsertCounty(cty21cd: string, cty21nm: string): Promise<void>;
    upsertParish(parncp21cd: string, parncp21nm: string): Promise<void>;
    upsertPostcodes(
        pcds: string,
        dointr: number,
        doterm: number | null,
        parish: string,
        oscty: string,
        ctry: string,
        osnrth1m: number | null,
        oseast1m: number | null,
        osgrdind: number,
        longitude: number | null,
        latitude: number | null
    ): Promise<void>;

    getPostcodeDetails(postcode: string): Promise<PostcodeDetails | undefined>;

    connect(): Promise<void>;
    cleanUp(): Promise<void>;
}
