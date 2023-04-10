export interface PostcodeDetails {
    id: number;
    postcode: string;
    startDate: number;
    terminationDate: number | undefined;
    parish: string;
    county: string;
    easting: number | undefined;
    northing: number | undefined;
    latitude: number | undefined;
    longitude: number | undefined;
    gridReferencePositionalQualityIndicatorId: number;
    gridReferencePositionalQualityIndicator: string;
    createdAt: Date;
    updatedAt: Date | undefined;
}
