import 'reflect-metadata';
import { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import { container } from '@/ioc/container';
import { ProcessController } from '~/adapters/controllers/process';
import { StartApplicationController } from '~/adapters/controllers/start';
//import { ProcessChangeController } from '~/adapters/controllers/processChange';

const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

dotenv.config();
const app = express();

const allowOrigin = process.env.ALLOW_ORIGIN || '*';
const allowMethods = process.env.ALLOW_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE';

app.use(cors({
    origin: allowOrigin,
    methods: allowMethods
}));

app.use(express.json());

const processController = container.get<ProcessController>(ProcessController);
const startController = container.get<StartApplicationController>(StartApplicationController);
//container.get<ProcessChangeController>(ProcessChangeController);

app.get('/api/application/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.put('/api/application/start', startController.put.bind(startController));

app.post('/api/application', processController.post.bind(processController));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Form Runner API',
      version: '1.0.0',
      description: 'API for form completion and application processing',
    },
    servers: [
      {
        url: `http://localhost:${process.env.EXPRESS_PORT || 3000}`,
      },
    ],
  },
  apis: ['./src/index.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
const port = process.env.EXPRESS_PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API documentation available at http://localhost:${port}/api-docs`);
});