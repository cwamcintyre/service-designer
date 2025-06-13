import { ProcessApplicationUseCase } from '@/usecase/process';
import ApplicationStoreTestDouble from '@/tests/doubles/applicationStore.testdouble';
import { ProcessApplicationRequest, ProcessApplicationResponse } from '@model/runnerApiTypes';
import { AddAnotherPage, Application } from '@model/formTypes';

const mockApplication: Application = require('@/tests/data/test-text-component.json') as Application;
const mockApplicationWithErrors: Application = require('@/tests/data/test-errors-component.json') as Application;
const mockApplicationWithErrorInAnswer = require('@/tests/data/test-errors-component-with-error-in-answer.json') as Application;
const mockApplicationWithUnknownPageType: Application = require('@/tests/data/undefined-page-type.json') as Application;
const mockApplicationWithCondition: Application = require('@/tests/data/next-page-condition.json') as Application;
const mockMultipleComponentsApplication: Application = require('@/tests/data/multiple-components-one-page.json') as Application;

describe('ProcessApplicationUseCase', () => {
    let applicationStore: ApplicationStoreTestDouble;
    let processApplicationUseCase: ProcessApplicationUseCase;

    beforeEach(() => {
        applicationStore = new ApplicationStoreTestDouble();
        processApplicationUseCase = new ProcessApplicationUseCase(applicationStore);
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

    it('should throw an error if the page is not found', async () => {
        applicationStore.withGetApplicationReturning(mockApplication);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'undefined-page-type', formData: {} };

        await expect(processApplicationUseCase.execute(request)).rejects.toThrow(`Page with ID undefined-page-type not found in application 123.`);
    });

    it('should throw an error if the page does not have a page type', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithUnknownPageType);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'text-component', formData: {} };

        await expect(processApplicationUseCase.execute(request)).rejects.toThrow(`Page type is undefined for page ID ${request.pageId} in application ${request.applicantId}.`);
    });

    it('should process an application successfully and return the next page', async () => {
        applicationStore.withGetApplicationReturning(mockApplication);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'text-component', formData: { text: 'Hello World' } };
        const response: ProcessApplicationResponse = await processApplicationUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];
        const component = applicationArg.pages.find(p => p.pageId === 'text-component')?.components.find(c => c.name === 'text');

        expect(component?.errors).toEqual([]);
        expect(component?.answer).toEqual('Hello World');

        expect(response.nextPageId).toEqual('summary');
        expect(response.nextPageType).toEqual('summary');
    });

    it('should return the same page if there are validation errors', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithErrors);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'text-component', formData: { text: 'ERROR' } };
        const response: ProcessApplicationResponse = await processApplicationUseCase.execute(request);

        expect(response.nextPageId).toEqual('text-component');
    });

    it('should store the validation error and the answer in the application if there is a validation error', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithErrors);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'text-component', formData: { text: 'ERROR' } };
        const response: ProcessApplicationResponse = await processApplicationUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];
        const component = applicationArg.pages.find(p => p.pageId === 'text-component')?.components.find(c => c.name === 'text');

        expect(component?.errors).toEqual(['ERROR MESSAGE']);
        expect(component?.answer).toEqual('ERROR');

        expect(response.nextPageId).toEqual('text-component');
    });

    it('should store multiple validation errors and the answer in the application if there are errors and multiple components', async () => {
        applicationStore.withGetApplicationReturning(mockMultipleComponentsApplication);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'test-component', formData: { full_name: 'BOB', "date_of_birth-day": "", "date_of_birth-month": "1", "date_of_birth-year": "2000" } };
        const response: ProcessApplicationResponse = await processApplicationUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];

        const fullNameComponent = applicationArg.pages.find(p => p.pageId === 'test-component')?.components.find(c => c.name === 'full_name');
        expect(fullNameComponent?.errors).toEqual(['YOUR NAME IS NOT BOB']);
        expect(fullNameComponent?.answer).toEqual('BOB');

        const dobComponent = applicationArg.pages.find(p => p.pageId === 'test-component')?.components.find(c => c.name === 'date_of_birth');
        expect(dobComponent?.errors).toEqual(["{\"errorMessage\":\"date must include a day\",\"dayError\":true,\"monthError\":false,\"yearError\":false}"]);
        expect(dobComponent?.answer).toEqual({ day: '', month: '1', year: '2000' });

        expect(response.nextPageId).toEqual('test-component');
    });

    it('should clear the errors if the user gives a valid answer after an invalid answer', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithErrorInAnswer);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'text-component', formData: { text: 'Hello No Errors' } };
        const response: ProcessApplicationResponse = await processApplicationUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];
        const component = applicationArg.pages.find(p => p.pageId === 'text-component')?.components.find(c => c.name === 'text');

        expect(component?.errors).toEqual([]);
        expect(component?.answer).toEqual('Hello No Errors');

        expect(response.nextPageId).toEqual('summary');
    });

    it('should return the correct next page if no conditions exist', async () => {
        applicationStore.withGetApplicationReturning(mockApplication);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'text-component', formData: { text: 'Hello World' } };
        const response: ProcessApplicationResponse = await processApplicationUseCase.execute(request);

        expect(response.nextPageId).toEqual('summary');
        expect(response.nextPageType).toEqual('summary');
    });

    it('should return the correct next page if the condition is met', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithCondition);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'text-component', formData: { text: 'Hello Branch B' } };
        const response: ProcessApplicationResponse = await processApplicationUseCase.execute(request);

        expect(response.nextPageId).toEqual('branch-b');
        expect(response.nextPageType).toEqual('default');
    });

    it('should return the correct next page if the condition is not met', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithCondition);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'text-component', formData: { text: 'Hello Summary' } };
        const response: ProcessApplicationResponse = await processApplicationUseCase.execute(request);

        expect(response.nextPageId).toEqual('summary');
        expect(response.nextPageType).toEqual('summary');
    });    
});