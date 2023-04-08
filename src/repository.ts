export interface Repository {
    upsertGridReferencePositionalQualityIndicator(osgrdind: number, description: string): Promise<void>;
    upsertCounties(cty21cd: string, cty21nm: string): Promise<void>;
    upsertParish(parncp21cd: string, parncp21nm: string): Promise<void>;
    upsertPostcodes(pcds: string, parish: string, osnrth1m: number, oseast1m: number, osgrdind: number, longitude: number, latitude: number): Promise<void>;

    connect(): Promise<void>;
    cleanUp(): Promise<void>;
}
