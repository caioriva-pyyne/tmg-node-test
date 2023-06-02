import {asClass, createContainer} from 'awilix';
import { scopePerRequest } from 'awilix-express';
import { Application } from 'express';
import {StackService} from './services/stack.service';
import {TimeManagementService} from './services/timeManagement.service';
import {TtlMapService} from './services/ttlMap.service';

export const loadContainer = (app: Application) => {
    const container = createContainer({injectionMode: 'CLASSIC'});
    container.register({
        stackService: asClass(StackService<any>).singleton(),
        ttlMapService: asClass(TtlMapService<any, any>).singleton(),
        timeManagementService: asClass(TimeManagementService).scoped()
    });
    app.use(scopePerRequest(container));
}
