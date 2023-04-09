export interface Repository {
    upsertGridReferencePositionalQualityIndicator(osgrdind: number, description: string): Promise<void>;
    upsertCountry(ctry12cn: string, ctry12cdo: string, ctry12nm: string, ctry12nmw: string): Promise<void>;
    upsertCounty(cty21cd: string, cty21nm: string): Promise<void>;
    upsertParish(parncp21cd: string, parncp21nm: string): Promise<void>;
    upsertPostcodes(
        pcds: string,
        dointr: number,
        doterm: number,
        parish: string,
        oscty: string,
        ctry: string,
        osnrth1m: number,
        oseast1m: number,
        osgrdind: number,
        longitude: number,
        latitude: number
    ): Promise<void>;

    connect(): Promise<void>;
    cleanUp(): Promise<void>;
}
