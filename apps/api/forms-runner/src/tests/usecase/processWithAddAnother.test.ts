import { ProcessApplicationUseCase } from '@/usecase/process';
import ApplicationStoreTestDouble from '@/tests/doubles/applicationStore.testdouble';
import { ProcessApplicationRequest, ProcessApplicationResponse } from '@model/runnerApiTypes';
import { AddAnotherPage, Application } from '@model/formTypes';

const mockApplicationWithAddAnother: Application = require('@/tests/data/moj-add-another.json') as Application;

describe('ProcessApplicationUseCase', () => {
    let applicationStore: ApplicationStoreTestDouble;
    let processApplicationUseCase: ProcessApplicationUseCase;

    beforeEach(() => {
        applicationStore = new ApplicationStoreTestDouble();
        processApplicationUseCase = new ProcessApplicationUseCase(applicationStore);
    });

    it('should process the add another page correctly', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithAddAnother);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'test-component', formData: { 
            "full_name-1": 'John Doe', 
            "date_of_birth-day-1": '1', 
            "date_of_birth-month-1": '1', 
            "date_of_birth-year-1": '2000', 
            "full_name-2": 'Jane Doe', 
            "date_of_birth-day-2": '2', 
            "date_of_birth-month-2": '2', 
            "date_of_birth-year-2": '2001' } };

        const response: ProcessApplicationResponse = await processApplicationUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];
        const page = applicationArg.pages.find((p): p is AddAnotherPage => p.pageId === 'test-component');
        
        expect(page?.pageAnswer).toEqual([
            { "full_name": "John Doe", "date_of_birth": { day: "1", month: "1", year: "2000" } },
            { "full_name": "Jane Doe", "date_of_birth": { day: "2", month: "2", year: "2001" } }
        ]);
        expect(response.nextPageId).toEqual('summary');
        expect(response.nextPageType).toEqual('summary');
    });    

    it('should return errors if the form data is invalid', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithAddAnother);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'test-component', formData: { 
            "full_name-1": 'John Doe', 
            "date_of_birth-day-1": '', 
            "date_of_birth-month-1": '1', 
            "date_of_birth-year-1": '2000', 
            "full_name-2": '', 
            "date_of_birth-day-2": '2', 
            "date_of_birth-month-2": '', 
            "date_of_birth-year-2": '2001' } };

        const response: ProcessApplicationResponse = await processApplicationUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];
        const page = applicationArg.pages.find((p): p is AddAnotherPage => p.pageId === 'test-component');
        
        expect(page?.pageErrors).toEqual({
            "date_of_birth-1": ["{\"errorMessage\":\"date must include a day\",\"dayError\":true,\"monthError\":false,\"yearError\":false}"],
            "full_name-2": ["An answer is required"],
            "date_of_birth-2": ["{\"errorMessage\":\"date must include a month\",\"dayError\":false,\"monthError\":true,\"yearError\":false}"]
        });

        expect(page?.pageAnswer).toEqual([
            { "full_name": "John Doe", "date_of_birth": { day: "", month: "1", year: "2000" } },
            { "full_name": "", "date_of_birth": { day: "2", month: "", year: "2001" } }
        ]);
        expect(response.nextPageId).toEqual('test-component');
        expect(response.nextPageType).toEqual('mojAddAnother');
    });
    
    it('should return an error if BOB appears..', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithAddAnother);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'test-component', formData: { 
            "full_name-1": 'BOB', 
            "date_of_birth-day-1": '', 
            "date_of_birth-month-1": '1', 
            "date_of_birth-year-1": '2000', 
            "full_name-2": 'Jane Doe', 
            "date_of_birth-day-2": '2', 
            "date_of_birth-month-2": '', 
            "date_of_birth-year-2": '2001' } };

        const response: ProcessApplicationResponse = await processApplicationUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];
        const page = applicationArg.pages.find((p): p is AddAnotherPage => p.pageId === 'test-component');
        
        expect(page?.pageErrors).toEqual({
            "date_of_birth-1": ["{\"errorMessage\":\"date must include a day\",\"dayError\":true,\"monthError\":false,\"yearError\":false}"],
            "full_name-1": ["YOUR NAME IS NOT BOB"],
            "date_of_birth-2": ["{\"errorMessage\":\"date must include a month\",\"dayError\":false,\"monthError\":true,\"yearError\":false}"]
        });

        expect(page?.pageAnswer).toEqual([
            { "full_name": "BOB", "date_of_birth": { day: "", month: "1", year: "2000" } },
            { "full_name": "Jane Doe", "date_of_birth": { day: "2", month: "", year: "2001" } }
        ]);
        expect(response.nextPageId).toEqual('test-component');
        expect(response.nextPageType).toEqual('mojAddAnother');
    });

    it('should go to the who-is-doug page if DOUG appears..', async () => {
        applicationStore.withGetApplicationReturning(mockApplicationWithAddAnother);

        const request: ProcessApplicationRequest = { applicantId: '123', pageId: 'test-component', formData: {
            "full_name-1": 'John Doe',
            "date_of_birth-day-1": '1',
            "date_of_birth-month-1": '1',
            "date_of_birth-year-1": '2000',
            "full_name-2": 'DOUG',
            "date_of_birth-day-2": '2',
            "date_of_birth-month-2": '2',
            "date_of_birth-year-2": '2001' } };

        const response: ProcessApplicationResponse = await processApplicationUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];
        const page = applicationArg.pages.find((p): p is AddAnotherPage => p.pageId === 'test-component');

        expect(page?.pageErrors).toEqual({});
        expect(page?.pageAnswer).toEqual([
            { "full_name": "John Doe", "date_of_birth": { day: "1", month: "1", year: "2000" } },
            { "full_name": "DOUG", "date_of_birth": { day: "2", month: "2", year: "2001" } }
        ]);
        expect(response.nextPageId).toEqual('who-is-doug');
        expect(response.nextPageType).toEqual('default');
    });
});