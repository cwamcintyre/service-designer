import { ProcessApplicationChangeUseCase } from '@/usecase/processChange';
import ApplicationStoreTestDouble from '@/tests/doubles/applicationStore.testdouble';
import { ProcessApplicationRequest, ProcessApplicationResponse } from '@model/runnerApiTypes';
import { AddAnotherPage, Application } from '@model/formTypes';

const mockApplicationWithAddAnother: Application = require('@/tests/data/moj-add-another-change.json') as Application;
const mockApplicationWithAddAnotherToBranch: Application = require('@/tests/data/moj-add-another-change-to-branch.json') as Application;
const mockApplicationWithEmptyAddAnother: Application = require('@/tests/data/moj-add-another-unfilled.json') as Application;
const mockApplicationWithInvalidAddAnother: Application = require('@/tests/data/moj-add-another-invalid.json') as Application;

describe('ProcessApplicationChangeUseCase', () => {
    let applicationStore: ApplicationStoreTestDouble;
    let processApplicationChangeUseCase: ProcessApplicationChangeUseCase;

    beforeEach(() => {
        applicationStore = new ApplicationStoreTestDouble();
        processApplicationChangeUseCase = new ProcessApplicationChangeUseCase(applicationStore);
    });

    it('should process an application change successfully and walk to the summary page', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithAddAnother);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'test-component', formData: { 
            "1-full_name": 'Jack Doe', 
            "1-date_of_birth-day": '1', 
            "1-date_of_birth-month": '1', 
            "1-date_of_birth-year": '2000', 
            "2-full_name": 'Jane Smith', 
            "2-date_of_birth-day": '2', 
            "2-date_of_birth-month": '2', 
            "2-date_of_birth-year": '2001' } };

        const response: ProcessApplicationResponse = await processApplicationChangeUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];
        const page = applicationArg.pages.find((p): p is AddAnotherPage => p.pageId === 'test-component');
        
        expect(page?.pageAnswer).toEqual([
            { "full_name": "Jack Doe", "date_of_birth": { day: "1", month: "1", year: "2000" } },
            { "full_name": "Jane Smith", "date_of_birth": { day: "2", month: "2", year: "2001" } }
        ]);
        expect(response.nextPageId).toEqual('summary');
        expect(response.nextPageType).toEqual('summary');
    });

    it('should return the same page if there are processing errors', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithAddAnother);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'test-component', formData: { 
            "1-full_name": 'BOB', 
            "1-date_of_birth-day": '1', 
            "1-date_of_birth-month": '1', 
            "1-date_of_birth-year": '2000', 
            "2-full_name": 'Jane Smith', 
            "2-date_of_birth-day": '2', 
            "2-date_of_birth-month": '', 
            "2-date_of_birth-year": '2001' } };

        const response: ProcessApplicationResponse = await processApplicationChangeUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];
        const page = applicationArg.pages.find((p): p is AddAnotherPage => p.pageId === 'test-component');
        
        expect(page?.pageAnswer).toEqual([
            { "full_name": "BOB", "date_of_birth": { day: "1", month: "1", year: "2000" } },
            { "full_name": "Jane Smith", "date_of_birth": { day: "2", month: "", year: "2001" } }
        ]);

        expect(page?.pageErrors).toEqual({
            "1-full_name": ["YOUR NAME IS NOT BOB"],
            "2-date_of_birth": ["{\"errorMessage\":\"date must include a month\",\"dayError\":false,\"monthError\":true,\"yearError\":false}"]            
        });

        expect(response.nextPageId).toEqual('test-component');
    });

    it('should process an application change and walk to the next unfilled page', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithAddAnotherToBranch);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'test-component', formData: { 
            "1-full_name": 'DOUG', 
            "1-date_of_birth-day": '1', 
            "1-date_of_birth-month": '1', 
            "1-date_of_birth-year": '2000', 
            "2-full_name": 'Jane Smith', 
            "2-date_of_birth-day": '2', 
            "2-date_of_birth-month": '2', 
            "2-date_of_birth-year": '2001' } };

        const response: ProcessApplicationResponse = await processApplicationChangeUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];
        const page = applicationArg.pages.find((p): p is AddAnotherPage => p.pageId === 'test-component');

        expect(page?.pageAnswer).toEqual([
            { "full_name": "DOUG", "date_of_birth": { day: "1", month: "1", year: "2000" } },
            { "full_name": "Jane Smith", "date_of_birth": { day: "2", month: "2", year: "2001" } }
        ]);
        expect(response.nextPageId).toEqual('who-is-doug');
        expect(response.nextPageType).toEqual('default');
    });

    it('should process an application change and walk to the add another page because it is empty', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithEmptyAddAnother);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'do-you-want-branch-a', formData: { 
            "do_you_want_branch_a": "yes" } 
        };

        const response: ProcessApplicationResponse = await processApplicationChangeUseCase.execute(request);

        expect(response.nextPageId).toEqual('branch-b');
        expect(response.nextPageType).toEqual('mojAddAnother');
    });

    it('should process an application change and walk to the add another page because it is now invalid', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithInvalidAddAnother);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'dont-include', formData: { 
            "dont_include": "BOB" } 
        };

        const response: ProcessApplicationResponse = await processApplicationChangeUseCase.execute(request);

        expect(response.nextPageId).toEqual('people');
        expect(response.nextPageType).toEqual('mojAddAnother');
    });    
});