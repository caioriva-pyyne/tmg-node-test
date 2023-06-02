export class TimeManagementService {
    public getEpochAfterDurationInSeconds(durationInSeconds: number): number {
        const date = new Date();
        date.setSeconds(date.getSeconds() + durationInSeconds);
        return Math.round(date.getTime() / 1000);
    }

    public getCurrentEpoch(): number {
        return Math.round(Date.now() / 1000);
    }
}
