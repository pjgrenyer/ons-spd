import csvtoJson from 'csvtojson';
import { ImportStrategy } from './import-strategy';
import { Repository } from './repository';
import { ReadStream } from 'fs';
import { NullLoadObserver } from './plugins/null-load-observer';
import { LoadObserver } from './load-observer';
import OSPoint from 'ospoint';

export const loadData = async (importStrategy: ImportStrategy, repository: Repository, observer = new NullLoadObserver()) => {
    await observer.onStart();
    await repository.connect();
    try {
        await seedGridReferencePositionalQualityIndicators(repository);

        const countryFile = importStrategy.countries();
        await importCsv(
            countryFile.filePath,
            countryFile.stream,
            (data) => repository.upsertCountry(data['CTRY12CD'], data['CTRY12CDO'], data['CTRY12NM'], data['CTRY12NMW']),
            observer
        );

        await preSeedCounties(repository);
        const countyFile = importStrategy.counties();
        await importCsv(countyFile.filePath, countyFile.stream, (data) => repository.upsertCounty(data['CTY21CD'], data['CTY21NM']), observer);

        await preSeedParishes(repository);
        const parishFile = importStrategy.parishes();
        await importCsv(parishFile.filePath, parishFile.stream, (data) => repository.upsertParish(data['PARNCP21CD'], data['PARNCP21NM']), observer);

        for (const postodeFilePath of importStrategy.postcodeFilePaths()) {
            const { filePath, stream } = importStrategy.postcodes(postodeFilePath);
            await importCsv(
                filePath,
                stream,
                (data: any) => {
                    const { northing, easting, longitude, latitude } = getGeoCords(data['osnrth1m'], data['oseast1m']);

                    return repository.upsertPostcodes(
                        data['pcds'],
                        +data['dointr'],
                        data['doterm'] ? +data['doterm'] : null,
                        toUnknownIfEmptyOrNull(data['parish']),
                        toUnknownIfEmptyOrNull(data['oscty']),
                        data['ctry'],
                        easting,
                        northing,
                        +data['osgrdind'],
                        longitude,
                        latitude
                    );
                },
                observer
            );
        }
    } finally {
        repository.cleanUp();
    }
    await observer.onFinish();
};

const seedGridReferencePositionalQualityIndicators = async (repository: Repository) => {
    repository.upsertGridReferencePositionalQualityIndicator(1, 'within the building of the matched address closest to the postcode mean');
    repository.upsertGridReferencePositionalQualityIndicator(
        2,
        'within the building of the matched address closest to the postcode mean,  by visual inspection of Landline maps (Scotland only)'
    );
    repository.upsertGridReferencePositionalQualityIndicator(3, 'approximate to within 50 metres');
    repository.upsertGridReferencePositionalQualityIndicator(4, 'postcode unit mean (mean of matched addresses with the same postcode, but not snapped to a building)');
    repository.upsertGridReferencePositionalQualityIndicator(5, 'imputed by ONS, by reference to surrounding postcode grid references');
    repository.upsertGridReferencePositionalQualityIndicator(6, 'postcode sector mean, (mainly PO Boxes)');
    repository.upsertGridReferencePositionalQualityIndicator(8, 'postcode terminated prior to Gridlink ® initiative, last known ONS postcode grid reference 1');
    repository.upsertGridReferencePositionalQualityIndicator(9, 'no grid reference available');
};

const unknown = '<unknown>';

const toUnknownIfEmptyOrNull = (s: string | null): string => {
    if (s == null) {
        return unknown;
    } else if (s.trim().length == 0) {
        return unknown;
    } else {
        return s.trim();
    }
};

const preSeedParishes = async (repository: Repository) => {
    await repository.upsertParish(unknown, unknown);
    await repository.upsertParish('S99999999', 'Scotland');
    await repository.upsertParish('N99999999', 'Northern Ireland');
    await repository.upsertParish('L99999999', 'Channel Islands');
    await repository.upsertParish('M99999999', 'Isle of Man');
};

const preSeedCounties = async (repository: Repository) => {
    await repository.upsertCounty(unknown, unknown);
};

const getGeoCords = (osnrth1m: string, oseast1m: string): { easting: number | null; northing: number | null; longitude: number | null; latitude: number | null } => {
    const easting = oseast1m ? +oseast1m : null;
    const northing = osnrth1m ? +osnrth1m : null;

    if (!easting || !northing) {
        return {
            easting,
            northing,
            longitude: null,
            latitude: null,
        };
    }

    const point = new OSPoint(osnrth1m, oseast1m);
    const { longitude, latitude } = point.toWGS84();

    return {
        easting,
        northing,
        longitude,
        latitude,
    };
};

const importCsv = async (filePath: string, stream: ReadStream, handler: (data: any, lineNumber: number) => Promise<void>, observer: LoadObserver): Promise<number> => {
    try {
        let count = 0;
        await observer.onStartFile(filePath);
        await csvtoJson()
            .fromStream(stream)
            .subscribe((data, lineNumber) => {
                count++;
                return handler(data, lineNumber);
            });
        await observer.onFinishFile(filePath, count);
        return count;
    } finally {
        stream.close();
    }
};
