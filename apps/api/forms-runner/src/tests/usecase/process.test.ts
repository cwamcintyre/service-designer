import { ProcessApplicationUseCase } from '@/usecase/process';
import ApplicationStoreTestDouble from '@/tests/doubles/applicationStore.testdouble';
import { ProcessApplicationRequest, ProcessApplicationResponse } from '@model/runnerApiTypes';
import { Application } from '@model/formTypes';
import { text } from 'express';

const mockApplication: Application = require('@/tests/data/test-text-component.json') as Application;
const mockApplicationWithErrors: Application = require('@/tests/data/test-errors-component.json') as Application;

describe('ProcessApplicationUseCase', () => {
    let applicationStore: ApplicationStoreTestDouble;
    let processApplicationUseCase: ProcessApplicationUseCase;

    beforeEach(() => {
        applicationStore = new ApplicationStoreTestDouble();
        processApplicationUseCase = new ProcessApplicationUseCase(applicationStore);
    });

    it('should process an application successfully and return the next page', async () => {
        applicationStore.withGetApplicationReturning(mockApplication);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'text-component', formData: { text: 'Hello World' } };
        const response: ProcessApplicationResponse = await processApplicationUseCase.execute(request);

        expect(response.nextPageId).toEqual('summary');
        expect(response.nextPageType).toEqual('summary');
    });

    it('should throw an error if the application is not found', async () => {
        applicationStore.withGetApplicationReturning(null);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'page1', formData: {} };

        await expect(processApplicationUseCase.execute(request)).rejects.toThrow('Application with ID 123 not found.');
    });

    it('should handle errors thrown by the application store', async () => {
        const error = new Error('Database error');
        applicationStore.withGetApplicationThrowing(error);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'page1', formData: {} };

        await expect(processApplicationUseCase.execute(request)).rejects.toThrow(`Error processing form for applicant 123: ${error.message}`);
    });

    it('should return the same page if there are validation errors', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithErrors);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'text-component', formData: { text: 'ERROR' } };
        const response: ProcessApplicationResponse = await processApplicationUseCase.execute(request);

        expect(response.nextPageId).toEqual('text-component');
    });
});