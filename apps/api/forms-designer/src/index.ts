import { Request, Response } from 'express';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import { container } from '@/ioc/container';
import { CreateFormController } from '~/adapters/controllers/createForm';
import { GetFormController } from '~/adapters/controllers/getForm';
import { GetAllFormsController } from './adapters/controllers/getAllForms';
import { DeleteFormController } from './adapters/controllers/deleteForm';
import { UpdateFormController } from './adapters/controllers/updateForm';

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

const createFormController = container.get<CreateFormController>(CreateFormController);
const getFormController = container.get<GetFormController>(GetFormController);
const getAllFormsController = container.get<GetAllFormsController>(GetAllFormsController);
const deleteFormController = container.get<DeleteFormController>(DeleteFormController);
const updateFormController = container.get<UpdateFormController>(UpdateFormController);

app.get('/api/form/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.get('/api/form/:id', getFormController.get.bind(getFormController));

app.get('/api/form', getAllFormsController.get.bind(getAllFormsController));

/**
 * @swagger
 * /api/form:
 *   put:
 *     summary: Create a new form
 *     description: Creates a new form in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFormRequest'
 *     responses:
 *       201:
 *         description: Form created successfully
 *       400:
 *         description: Bad request
 */
app.put('/api/form', createFormController.put.bind(createFormController));

app.post('/api/form', updateFormController.post.bind(updateFormController));

app.delete('/api/form/:id', deleteFormController.delete.bind(deleteFormController));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Form API',
      version: '1.0.0',
      description: 'API for managing forms',
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

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});