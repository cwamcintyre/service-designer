import ApplicationStoreTestDouble from '@/tests/doubles/applicationStore.testdouble';
import { MoJRemoveFromAddAnotherUseCase } from '../../usecase/mojRemoveFromAddAnother';
import { MoJRemoveRequest, ProcessApplicationResponse } from '@model/runnerApiTypes';
import { Application, AddAnotherPage } from '@model/formTypes';

const mockApplicationWithAddAnother: Application = require('@/tests/data/moj-add-another-change.json') as Application;
const mockApplicationWithRemoveFirst: Application = require('@/tests/data/moj-add-another-change-remove-first.json') as Application;
const mockApplicationWithNoErrorsAfterRemove: Application = require('@/tests/data/moj-add-another-no-errors-after-remove.json') as Application;

describe('MoJRemoveFromAddAnother Use Case', () => {
    let applicationStore: ApplicationStoreTestDouble;
    let useCase: MoJRemoveFromAddAnotherUseCase;

    beforeEach(() => {
        applicationStore = new ApplicationStoreTestDouble();
        useCase = new MoJRemoveFromAddAnotherUseCase(applicationStore);
    });

    it('should throw an error if the application is not found', async () => {
        const request: MoJRemoveRequest = {
            applicantId: '123',
            pageId: 'page1',
            itemIndex: 0,
            formData: {}
        };

        applicationStore.withGetApplicationReturning(null);

        await expect(useCase.execute(request)).rejects.toThrow('Application with ID 123 not found.');
    });

    it('should throw an error if the page is not found', async () => {
        const request: MoJRemoveRequest = {
            applicantId: '123',
            pageId: 'page1',
            itemIndex: 0,
            formData: {}
        };

        applicationStore.withGetApplicationReturning(mockApplicationWithAddAnother);

        await expect(useCase.execute(request)).rejects.toThrow('Page with ID page1 not found.');
    });

    it('should throw an error if the item index is out of bounds', async () => {
        const request: MoJRemoveRequest = {
            applicantId: '123',
            pageId: 'test-component',
            itemIndex: 5,
            formData: {}
        };        

        applicationStore.withGetApplicationReturning(mockApplicationWithAddAnother);

        await expect(useCase.execute(request)).rejects.toThrow('Item index 5 is out of bounds for page test-component.');
    });

    it('should remove the first item at the specified index and update the application', async () => {
        const request: MoJRemoveRequest = {
            applicantId: '123',
            pageId: 'test-component',
            itemIndex: 0,
            formData: { 
            "1-full_name": 'John Doe', 
            "1-date_of_birth-day": '1', 
            "1-date_of_birth-month": '1', 
            "1-date_of_birth-year": '2000', 
            "2-full_name": 'Jane Doe', 
            "2-date_of_birth-day": '2', 
            "2-date_of_birth-month": '2', 
            "2-date_of_birth-year": '2001' }
        };

        applicationStore.withGetApplicationReturning(mockApplicationWithRemoveFirst);

        const response: ProcessApplicationResponse = await useCase.execute(request);

        expect(applicationStore.getUpdateApplicationSpy()).toHaveBeenCalledWith(mockApplicationWithRemoveFirst);
        expect((mockApplicationWithRemoveFirst.pages[0] as AddAnotherPage).pageAnswer).toEqual([{
                "full_name": "Jane Doe",
                "date_of_birth": {
                    "day": "2",
                    "month": "2",
                    "year": "2001"
                }
            }]);
        expect((mockApplicationWithRemoveFirst.pages[0] as AddAnotherPage).numberOfItems).toBe(1);
        expect(response).toEqual({ nextPageId: 'test-component', extraData: '' });
    });

    it('should remove the last item at the specified index and update the application', async () => {
        const request: MoJRemoveRequest = {
            applicantId: '123',
            pageId: 'test-component',
            itemIndex: 1,
            formData: { 
            "1-full_name": 'John Doe', 
            "1-date_of_birth-day": '1', 
            "1-date_of_birth-month": '1', 
            "1-date_of_birth-year": '2000', 
            "2-full_name": 'Jane Doe', 
            "2-date_of_birth-day": '2', 
            "2-date_of_birth-month": '2', 
            "2-date_of_birth-year": '2001' }
        };

        applicationStore.withGetApplicationReturning(mockApplicationWithAddAnother);

        const response: ProcessApplicationResponse = await useCase.execute(request);

        expect(applicationStore.getUpdateApplicationSpy()).toHaveBeenCalledWith(mockApplicationWithAddAnother);
        expect((mockApplicationWithAddAnother.pages[0] as AddAnotherPage).pageAnswer).toEqual([{
                "full_name": "John Doe",
                "date_of_birth": {
                    "day": "1",
                    "month": "1",
                    "year": "2000"
                }
            }]);
        expect((mockApplicationWithAddAnother.pages[0] as AddAnotherPage).numberOfItems).toBe(1);
        expect(response).toEqual({ nextPageId: 'test-component', extraData: '' });
    });

    it('should not validate the page when removing items', async () => {
        const request: MoJRemoveRequest = {
            applicantId: '123',
            pageId: 'test-component',
            itemIndex: 1,
            formData: { 
            "1-full_name": 'BOB', 
            "1-date_of_birth-day": '1', 
            "1-date_of_birth-month": '1', 
            "1-date_of_birth-year": '2000', 
            "2-full_name": 'Jane Doe', 
            "2-date_of_birth-day": '2', 
            "2-date_of_birth-month": '2', 
            "2-date_of_birth-year": '2001' }
        };

        applicationStore.withGetApplicationReturning(mockApplicationWithNoErrorsAfterRemove);

        const response: ProcessApplicationResponse = await useCase.execute(request);

        expect(applicationStore.getUpdateApplicationSpy()).toHaveBeenCalledWith(mockApplicationWithNoErrorsAfterRemove);
        expect((mockApplicationWithNoErrorsAfterRemove.pages[0] as AddAnotherPage).pageAnswer).toEqual([{
                "full_name": "BOB",
                "date_of_birth": {
                    "day": "1",
                    "month": "1",
                    "year": "2000"
                }
            }]);
        expect((mockApplicationWithNoErrorsAfterRemove.pages[0] as AddAnotherPage).numberOfItems).toBe(1);
        expect((mockApplicationWithNoErrorsAfterRemove.pages[0] as AddAnotherPage).pageErrors).toEqual({});
        expect(response).toEqual({ nextPageId: 'test-component', extraData: '' });
    });

    it('should throw a generic error if an unknown error occurs', async () => {
        const request: MoJRemoveRequest = {
            applicantId: '123',
            pageId: 'page1',
            itemIndex: 0,
            formData: {}
        };

        applicationStore.withGetApplicationThrowing(new Error('Unknown error'));

        await expect(useCase.execute(request)).rejects.toThrow('Error removing from add another for applicant 123: Unknown error');
    });

    it('should throw a generic error if an unknown any error occurs', async () => {
        const request: MoJRemoveRequest = {
            applicantId: '123',
            pageId: 'page1',
            itemIndex: 0,
            formData: {}
        };

        applicationStore.withGetApplicationThrowingAny('Unknown error');

        await expect(useCase.execute(request)).rejects.toThrow('Error removing from add another for applicant 123: Unknown error');
    });    
});
