import { ProcessApplicationChangeUseCase } from '@/usecase/processChange';
import ApplicationStoreTestDouble from '@/tests/doubles/applicationStore.testdouble';
import { ProcessApplicationRequest, ProcessApplicationResponse } from '@model/runnerApiTypes';
import { Application } from '@model/formTypes';

const mockApplication: Application = require('@/tests/data/change-answer-valid.json') as Application;
const mockApplicationWithErrors: Application = require('@/tests/data/change-answer-invalid-and-blank.json') as Application;

describe('ProcessApplicationChangeUseCase', () => {
    let applicationStore: ApplicationStoreTestDouble;
    let processApplicationChangeUseCase: ProcessApplicationChangeUseCase;

    beforeEach(() => {
        applicationStore = new ApplicationStoreTestDouble();
        processApplicationChangeUseCase = new ProcessApplicationChangeUseCase(applicationStore);
    });

    it('should throw an error if the application is not found', async () => {
        applicationStore.withGetApplicationReturning(null);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'page1', formData: {} };

        await expect(processApplicationChangeUseCase.execute(request)).rejects.toThrow('Application with ID 123 not found.');
    });

    it('should handle errors thrown by the application store', async () => {
        const error = new Error('Database error');
        applicationStore.withGetApplicationThrowing(error);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'page1', formData: {} };

        await expect(processApplicationChangeUseCase.execute(request)).rejects.toThrow(`Error processing form for applicant 123: ${error.message}`);
    });

    it('should process an application change successfully and walk to the summary page', async () => {
        applicationStore.withGetApplicationReturning(mockApplication);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'what-is-your-name', formData: { what_is_your_name: "Jane Doe"} };
        const response: ProcessApplicationResponse = await processApplicationChangeUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];
        const component = applicationArg.pages.find(p => p.pageId === 'what-is-your-name')?.components.find(c => c.name === 'what_is_your_name');

        expect(component?.errors).toEqual([]);
        expect(component?.answer).toEqual('Jane Doe');

        expect(response.nextPageId).toEqual('summary');
    });

    it('should return the same page if there are processing errors', async () => {
        applicationStore.withGetApplicationReturning(mockApplication);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'what-is-your-name', formData: { what_is_your_name: "BOB" } };
        const response: ProcessApplicationResponse = await processApplicationChangeUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];
        const component = applicationArg.pages.find(p => p.pageId === 'what-is-your-name')?.components.find(c => c.name === 'what_is_your_name');

        expect(component?.errors).toEqual(["Your name is not BOB"]);
        expect(component?.answer).toEqual("BOB");

        expect(response.nextPageId).toEqual('what-is-your-name');
    });

    it('should process an application change and walk to the next invalid page', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithErrors);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'do-you-want-branch-a', formData: { do_you_want_branch_a: "yes" } };
        const response: ProcessApplicationResponse = await processApplicationChangeUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];
        const component = applicationArg.pages.find(p => p.pageId === 'do-you-want-branch-a')?.components.find(c => c.name === 'do_you_want_branch_a');

        expect(component?.errors).toEqual([]);
        expect(component?.answer).toEqual({ id: 'yes', value: 'yes', label: 'Yes' });

        expect(response.nextPageId).toEqual('branch-a');
    });

    it('should process an application change and walk to the next unfilled page', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithErrors);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'do-you-want-branch-a', formData: { do_you_want_branch_a: "no" } };
        const response: ProcessApplicationResponse = await processApplicationChangeUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];
        const component = applicationArg.pages.find(p => p.pageId === 'do-you-want-branch-a')?.components.find(c => c.name === 'do_you_want_branch_a');

        expect(component?.errors).toEqual([]);
        expect(component?.answer).toEqual({ id: 'no', value: 'no', label: 'No' });

        expect(response.nextPageId).toEqual('branch-b-subsequent-q');
    });
});