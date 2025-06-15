import ApplicationStoreTestDouble from '@/tests/doubles/applicationStore.testdouble';
import { MoJAddAnotherUseCase } from '../../usecase/mojAddAnother';
import { MoJAddAnotherRequest, ProcessApplicationResponse } from '@model/runnerApiTypes';
import { Application, AddAnotherPage } from '@model/formTypes';

const mockApplicationWithAddAnother: Application = require('@/tests/data/moj-add-another-change.json') as Application;
const mockApplicationRetainsInfoWithNoErrors: Application = require('@/tests/data/moj-add-another-retains-info-on-add.json') as Application; 

describe('MoJAddAnother Use Case', () => {
    let applicationStore: ApplicationStoreTestDouble;
    let useCase: MoJAddAnotherUseCase;

    beforeEach(() => {
        applicationStore = new ApplicationStoreTestDouble();
        useCase = new MoJAddAnotherUseCase(applicationStore);
    });

    it('should throw an error if the application is not found', async () => {
        const request: MoJAddAnotherRequest = {
            applicantId: '123',
            pageId: 'page1',
            numberOfItems: 2,
            formData: {}
        };

        applicationStore.withGetApplicationReturning(null);

        await expect(useCase.execute(request)).rejects.toThrow('Application with ID 123 not found.');
    });

    it('should throw an error if the page is not found', async () => {
        const request: MoJAddAnotherRequest = {
            applicantId: '123',
            pageId: 'does-not-exist',
            numberOfItems: 2,
            formData: {}
        };

        applicationStore.withGetApplicationReturning(mockApplicationWithAddAnother);

        await expect(useCase.execute(request)).rejects.toThrow('Page with ID does-not-exist not found.');
    });

    it('should update the number of items on the page and return the response', async () => {
        const request: MoJAddAnotherRequest = {
            applicantId: '123',
            pageId: 'test-component',
            numberOfItems: 3,
            formData: {}
        };

        applicationStore.withGetApplicationReturning(mockApplicationWithAddAnother);

        const response: ProcessApplicationResponse = await useCase.execute(request);

        expect(applicationStore.getUpdateApplicationSpy()).toHaveBeenCalledWith(mockApplicationWithAddAnother);
        expect((mockApplicationWithAddAnother.pages[0] as AddAnotherPage).numberOfItems).toBe(3);
        expect(response).toEqual({ nextPageId: 'test-component', extraData: '' });
    });

    it('should retain information that has been typed into the form without validating it', async () => {
        const request: MoJAddAnotherRequest = {
            applicantId: '123',
            pageId: 'test-component',
            numberOfItems: 2,
            formData: {
                '1-full_name': 'John Doe',
                '1-date_of_birth-day': '1',
                '1-date_of_birth-month': '1',
                '1-date_of_birth-year': '2000'
            }
        };

        applicationStore.withGetApplicationReturning(mockApplicationRetainsInfoWithNoErrors);
        const response: ProcessApplicationResponse = await useCase.execute(request);

        expect(applicationStore.getUpdateApplicationSpy()).toHaveBeenCalledWith(mockApplicationRetainsInfoWithNoErrors);
        const page = mockApplicationRetainsInfoWithNoErrors.pages.find(p => p.pageId === 'test-component') as AddAnotherPage;
        expect(page.pageAnswer).toEqual([
            { full_name: 'John Doe', date_of_birth: { day: '1', month: '1', year: '2000' } },
            { full_name: undefined, date_of_birth: { day: undefined, month: undefined, year: undefined } } // this is not what is stored in DynamoDB but is returned by the use case..
        ]);
        expect(page.numberOfItems).toBe(2);
        expect(page.pageErrors).toEqual({});
    });

    it('should throw a generic error if an unknown error occurs', async () => {
        const request: MoJAddAnotherRequest = {
            applicantId: '123',
            pageId: 'test-component',
            numberOfItems: 3,
            formData: {}
        };

        applicationStore.withGetApplicationThrowing(new Error('Unknown error'));

        await expect(useCase.execute(request)).rejects.toThrow('Error adding another for applicant 123: Unknown error');
    });

    it('should throw a generic error if an unknown any error occurs', async () => {
        const request: MoJAddAnotherRequest = {
            applicantId: '123',
            pageId: 'test-component',
            numberOfItems: 3,
            formData: {}
        };

        applicationStore.withGetApplicationThrowingAny('Unknown error');

        await expect(useCase.execute(request)).rejects.toThrow('Error adding another for applicant 123: Unknown error');
    });    
});