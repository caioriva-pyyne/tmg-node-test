import {asClass, createContainer} from "awilix";
import { scopePerRequest } from "awilix-express";
import { Application } from "express";
import {StackService} from "./services/stack.service";

export const loadContainer = (app: Application) => {
    const container = createContainer({injectionMode: 'CLASSIC'});
    container.register({
        stackService: asClass(StackService<any>).singleton()
    });
    app.use(scopePerRequest(container));
}
