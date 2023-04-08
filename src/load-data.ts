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
        await preSeedParishes(repository);
        const parishFile = importStrategy.parishes();
        await importCsv(parishFile.filePath, parishFile.stream, (data) => repository.upsertParish(data['PARNCP21CD'], data['PARNCP21NM']), observer);

        for (const postodeFilePath of importStrategy.postcodeFilePaths()) {
            const { filePath, stream } = importStrategy.postcodes(postodeFilePath);
            await importCsv(
                filePath,
                stream,
                (data: any) => {
                    const point = new OSPoint(data['osnrth1m'], data['oseast1m']);
                    const { longitude, latitude } = point.toWGS84();
                    return repository.upsertPostcodes(data['pcds'], toUnknownIfEmptyOrNull(data['parish']), +data['oseast1m'], +data['osnrth1m'], longitude, latitude);
                },
                observer
            );
        }
    } finally {
        repository.cleanUp();
    }
    await observer.onFinish();
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
