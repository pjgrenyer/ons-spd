import csvtoJson from 'csvtojson';
import { ImportStrategy } from './import-strategy';
import { Repository } from './repository';

export const loadData = async (importStrategy: ImportStrategy, repository: Repository) => {
    await repository.connect();
    try {
        await preSeedParishes(repository);
        const parishStream = importStrategy.parishes();
        try {
            await csvtoJson()
                .fromStream(parishStream)
                .subscribe((line) => repository.upsertParish(line['PARNCP21CD'], line['PARNCP21NM']));
        } finally {
            parishStream.close();
        }

        for (const postodeFilePath of importStrategy.postcodeFilePaths()) {
            const dataStream = importStrategy.postcodes(postodeFilePath);
            try {
                await csvtoJson()
                    .fromStream(dataStream)
                    .subscribe((line) => repository.upsertPostcodes(line['pcds'], toUnknownIfEmptyOrNull(line['parish']), +line['oseast1m'], +line['osnrth1m']));
            } finally {
                dataStream.close();
            }
        }
    } finally {
        repository.cleanUp();
    }
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
