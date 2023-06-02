import {DELETE, GET, PUT, route} from 'awilix-express';
import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { TtlMapService } from '../services/ttlMap.service';
import { MapRequest } from '../models/requests/map.request';
import { NoKeyValuePairError } from '../errors/noKeyValuePair.error';

@route('/map')
export class TtlMapController {
    constructor(private readonly ttlMapService: TtlMapService<string, string>) {}

    @route('/put')
    @PUT()
    async put(req: Request, res: Response) {
        const mapRequest = new MapRequest(req.body.key, req.body.value, req.body.ttlInSeconds);
        const errors = await validate(mapRequest);

        if (errors.length) {
            res.status(400);
            res.json({
                status: 400,
                timestamp: new Date().toUTCString(),
                errors: errors,
            });
            return;
        }

        try {
            this.ttlMapService.put(mapRequest.key, mapRequest.value, mapRequest.ttlInSeconds);
        } catch (error) {
            res.status(500);
            res.json({
                status: 500,
                timestamp: new Date().toUTCString(),
                errors: [error instanceof Error ? error.message : String(error)],
            });
            return;
        }

        res.status(204).send();
    }

    @route('/get/:key')
    @GET()
    pop(req: Request, res: Response) {
        const key = req.params.key;
        let value;

        if (key == undefined || key == '') {
            res.status(400);
            res.json({
                status: 400,
                timestamp: new Date().toUTCString(),
                errors: ["'key' request parameter should be specified and it must not be empty"],
            });
            return;
        }

        try {
            value = this.ttlMapService.get(key);
        } catch (error) {
            this.handleMapActionError(error instanceof Error ? (error as Error) : new Error(String(error)), res);
            return;
        }

        res.status(200);
        res.json({
            status: 200,
            timestamp: new Date().toUTCString(),
            data: value,
        });
    }

    @route('/remove/:key')
    @DELETE()
    remove(req: Request, res: Response) {
        const key = req.params.key;

        if (key == undefined || key == '') {
            res.status(400);
            res.json({
                status: 400,
                timestamp: new Date().toUTCString(),
                errors: ["'key' request parameter should be specified and it must not be empty"],
            });
            return;
        }

        try {
            this.ttlMapService.remove(key);
        } catch (error) {
            this.handleMapActionError(error instanceof Error ? (error as Error) : new Error(String(error)), res);
            return;
        }

        res.status(204).send();
    }

    private handleMapActionError(error: Error, res: Response) {
        let status = 500;
        let errors = [error.message];

        if (error instanceof NoKeyValuePairError) {
            status = 404;
            errors = ['No value found for the specified key'];
        }

        res.status(status);
        res.json({
            status: status,
            timestamp: new Date().toUTCString(),
            errors: errors,
        });
    }
}
