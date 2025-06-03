import 'reflect-metadata';
import { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import { container } from '@/ioc/container';
import { ProcessController } from '~/adapters/controllers/process';
import { StartApplicationController } from '~/adapters/controllers/start';
import { GetApplicationController } from './adapters/controllers/get';
import { ProcessChangeController } from '~/adapters/controllers/processChange';

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
const getApplicationController = container.get<GetApplicationController>(GetApplicationController);
const processChangeController = container.get<ProcessChangeController>(ProcessChangeController);

app.get('/api/application/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.get('/api/application/:applicantId/:pageId/:extraData', (req: Request, res: Response) => {
  const { applicantId, pageId, extraData } = req.params;
  req.params.extraData = extraData || ''; // Handle missing extraData parameter
  getApplicationController.put(req, res);
});

app.get('/api/application/:applicantId/:pageId', (req: Request, res: Response) => {
  const { applicantId, pageId } = req.params;
  req.params.extraData = ''; // Default extraData to an empty string
  getApplicationController.put(req, res);
});

app.put('/api/application/start', startController.put.bind(startController));

app.post('/api/application', processController.post.bind(processController));

app.patch('/api/application', processChangeController.patch.bind(processChangeController));

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

process.on('unhandledRejection', (reason: any, promise) => {
  console.error('Unhandled Rejection:', JSON.stringify(reason, null, 2));
});