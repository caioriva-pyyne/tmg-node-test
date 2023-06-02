import express, { Application } from 'express';
import { loadControllers } from 'awilix-express';
import { loadContainer } from './container';

const PORT = 3000;

const app: Application = express();
loadContainer(app);

app.use(express.json());
app.use(loadControllers('controllers/*.ts', { cwd: __dirname }));

try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error: any) {
  console.error(`Error occurred: ${error.message}`);
}
