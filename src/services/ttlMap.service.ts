import { TimeManagementService } from './timeManagement.service';
import { NoKeyValuePairError } from '../errors/noKeyValuePair.error';

const cleanTTLMapJobPeriod = Number(process.env.CLEAN_TTL_MAP_JOB_PERIOD) || 20000;

export class TtlMapService<K extends string | number, V extends string | number> {
    constructor(private readonly timeManagementService: TimeManagementService) {
        this.dispatchCleanTTLMapJob();
    }

    private ttlMap: Map<K, number> = new Map<K, number>();
    private dataMap: Map<K, V> = new Map<K, V>();

    public put(key: K, value: V, ttl: number | undefined = undefined) {
        this.dataMap.set(key, value);

        if (ttl != undefined) this.ttlMap.set(key, this.timeManagementService.getEpochAfterDurationInSeconds(ttl));
    }

    public get(key: K): V {
        const expiration = this.ttlMap.get(key);

        if (
            !this.dataMap.has(key) ||
            (expiration != undefined && this.timeManagementService.getCurrentEpoch() > expiration)
        ) {
            this.ttlMap.delete(key);
            this.dataMap.delete(key);
            throw new NoKeyValuePairError();
        }

        return this.dataMap.get(key)!;
    }

    public remove(key: K) {
        const isDeleted = this.dataMap.delete(key);
        if (!isDeleted) throw new NoKeyValuePairError();
        this.ttlMap.delete(key);
    }

    private dispatchCleanTTLMapJob() {
        setTimeout(() => {
            if (this.ttlMap.size !== 0) {
                [...this.ttlMap]
                    .filter(([, v]) => this.timeManagementService.getCurrentEpoch() > v)
                    .forEach(([k]) => {
                        this.ttlMap.delete(k);
                        this.dataMap.delete(k);
                    });
            }
            this.dispatchCleanTTLMapJob();
        }, cleanTTLMapJobPeriod);
    }
}
