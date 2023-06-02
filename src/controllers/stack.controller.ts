import { GET, POST, route } from 'awilix-express';
import { Request, Response } from 'express';
import { StackService } from '../services/stack.service';
import { StackRequest } from '../models/requests/stack.request';
import { validate } from 'class-validator';
import { EmptyStackError } from '../errors/emptyStack.error';

@route('/stack')
export class StackController {
    constructor(private readonly stackService: StackService<string>) {}

    @route('/push')
    @POST()
    async push(req: Request, res: Response) {
        const stackRequest = new StackRequest(req.body.item);
        const errors = await validate(stackRequest);

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
            this.stackService.push(stackRequest.item);
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

    @route('/pop')
    @GET()
    pop(req: Request, res: Response) {
        let item;
        try {
            item = this.stackService.pop();
        } catch (error) {
            let status = 500;
            let errors = [error instanceof Error ? error.message : String(error)];

            if (error instanceof EmptyStackError) {
                status = 404;
                errors = ['No item could be returned because the stack is empty'];
            }

            res.status(status);
            res.json({
                status: status,
                timestamp: new Date().toUTCString(),
                errors: errors,
            });
            return;
        }

        res.status(200);
        res.json({
            status: 200,
            timestamp: new Date().toUTCString(),
            data: item,
        });
    }
}
