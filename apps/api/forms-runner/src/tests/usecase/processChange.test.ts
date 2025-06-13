import { ProcessApplicationChangeUseCase } from '@/usecase/processChange';
import ApplicationStoreTestDouble from '@/tests/doubles/applicationStore.testdouble';
import { ProcessApplicationRequest, ProcessApplicationResponse } from '@model/runnerApiTypes';
import { Application } from '@model/formTypes';

const mockApplication: Application = require('@/tests/data/change-answer-valid.json') as Application;
const mockApplicationWithErrors: Application = require('@/tests/data/change-answer-invalid-and-blank.json') as Application;
const mockApplicationWithErrorsAgain: Application = require('@/tests/data/change-answer-invalid-and-blank-branch-b.json') as Application;
const mockApplicationWithInvalidDateAfter: Application = require('@/tests/data/change-date-after-becomes-invalid.json') as Application;
const mockMultipleComponentsApplication: Application = require('@/tests/data/multiple-components-one-page.json') as Application;

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

    it('should store multiple validation errors and the answer in the application if there are errors and multiple components', async () => {
        applicationStore.withGetApplicationReturning(mockMultipleComponentsApplication);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'test-component', formData: { full_name: 'BOB', "date_of_birth-day": "", "date_of_birth-month": "1", "date_of_birth-year": "2000" } };
        const response: ProcessApplicationResponse = await processApplicationChangeUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];

        const fullNameComponent = applicationArg.pages.find(p => p.pageId === 'test-component')?.components.find(c => c.name === 'full_name');
        expect(fullNameComponent?.errors).toEqual(['YOUR NAME IS NOT BOB']);
        expect(fullNameComponent?.answer).toEqual('BOB');

        const dobComponent = applicationArg.pages.find(p => p.pageId === 'test-component')?.components.find(c => c.name === 'date_of_birth');
        expect(dobComponent?.errors).toEqual(["{\"errorMessage\":\"date must include a day\",\"dayError\":true,\"monthError\":false,\"yearError\":false}"]);
        expect(dobComponent?.answer).toEqual({ day: '', month: '1', year: '2000' });

        expect(response.nextPageId).toEqual('test-component');
    });    

    it('should process an application change and walk to the next invalid page', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithErrors);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'do-you-want-branch-a', formData: { do_you_want_branch_a: "yes" } };
        const response: ProcessApplicationResponse = await processApplicationChangeUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];
        const component = applicationArg.pages.find(p => p.pageId === 'do-you-want-branch-a')?.components.find(c => c.name === 'do_you_want_branch_a');

        expect(component?.errors).toEqual([]);
        expect(component?.answer).toEqual({ id: 'yes', value: 'yes', label: 'Yes' });

        const invalidComponentOne = applicationArg.pages.find(p => p.pageId === 'branch-a')?.components.find(c => c.name === 'what_do_you_think_of_branch_a');
        expect(invalidComponentOne?.errors).toEqual(["Thats not right."]);
        expect(invalidComponentOne?.answer).toEqual("INVALID");

        const invalidComponentTwo = applicationArg.pages.find(p => p.pageId === 'branch-a')?.components.find(c => c.name === 'this_is_invalid_too');
        expect(invalidComponentTwo?.errors).toEqual(["Thats not right."]);
        expect(invalidComponentTwo?.answer).toEqual("INVALID TOO");

        expect(response.nextPageId).toEqual('branch-a');
    });

    it('should process an application change and walk to the next unfilled page', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithErrorsAgain);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'do-you-want-branch-a', formData: { do_you_want_branch_a: "no" } };
        const response: ProcessApplicationResponse = await processApplicationChangeUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];
        const component = applicationArg.pages.find(p => p.pageId === 'do-you-want-branch-a')?.components.find(c => c.name === 'do_you_want_branch_a');

        expect(component?.errors).toEqual([]);
        expect(component?.answer).toEqual({ id: 'no', value: 'no', label: 'No' });

        expect(response.nextPageId).toEqual('branch-b-subsequent-q');
    });

    it('should process an application change and find a date that is now invalid after it', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithInvalidDateAfter);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'what-is-the-first-date', formData: { "what_is_the_first_date-day": "15", "what_is_the_first_date-month": "02", "what_is_the_first_date-year": "2030" } };
        const response: ProcessApplicationResponse = await processApplicationChangeUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];
        const component = applicationArg.pages.find(p => p.pageId === 'what-is-the-first-date')?.components.find(c => c.name === 'what_is_the_first_date');
        const invalidComponent = applicationArg.pages.find(p => p.pageId === 'what-is-the-second-date')?.components.find(c => c.name === 'what_is_the_second_date');

        expect(invalidComponent?.errors).toEqual([JSON.stringify({ errorMessage: "The second date must be after the first date", dayError: true, monthError: true, yearError: true })]);
        expect(component?.answer).toEqual({ day: '15', month: '02', year: '2030' });
        expect(response.nextPageId).toEqual('what-is-the-second-date');
    });
});