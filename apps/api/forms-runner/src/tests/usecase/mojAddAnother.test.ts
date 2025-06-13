import ApplicationStoreTestDouble from '@/tests/doubles/applicationStore.testdouble';
import { MoJAddAnotherUseCase } from '../../usecase/mojAddAnother';
import { MoJAddAnotherRequest, ProcessApplicationResponse } from '@model/runnerApiTypes';
import { Application, AddAnotherPage } from '@model/formTypes';

const mockApplicationWithAddAnother: Application = require('@/tests/data/moj-add-another-change.json') as Application;

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
        };

        applicationStore.withGetApplicationReturning(null);

        await expect(useCase.execute(request)).rejects.toThrow('Application with ID 123 not found.');
    });

    it('should throw an error if the page is not found', async () => {
        const request: MoJAddAnotherRequest = {
            applicantId: '123',
            pageId: 'does-not-exist',
            numberOfItems: 2,
        };

        applicationStore.withGetApplicationReturning(mockApplicationWithAddAnother);

        await expect(useCase.execute(request)).rejects.toThrow('Page with ID does-not-exist not found.');
    });

    it('should update the number of items on the page and return the response', async () => {
        const request: MoJAddAnotherRequest = {
            applicantId: '123',
            pageId: 'test-component',
            numberOfItems: 3,
        };

        applicationStore.withGetApplicationReturning(mockApplicationWithAddAnother);

        const response: ProcessApplicationResponse = await useCase.execute(request);

        expect(applicationStore.getUpdateApplicationSpy()).toHaveBeenCalledWith(mockApplicationWithAddAnother);
        expect((mockApplicationWithAddAnother.pages[0] as AddAnotherPage).numberOfItems).toBe(3);
        expect(response).toEqual({ nextPageId: 'test-component', extraData: '' });
    });

    it('should throw a generic error if an unknown error occurs', async () => {
        const request: MoJAddAnotherRequest = {
            applicantId: '123',
            pageId: 'test-component',
            numberOfItems: 3,
        };

        applicationStore.withGetApplicationThrowing(new Error('Unknown error'));

        await expect(useCase.execute(request)).rejects.toThrow('Error adding another for applicant 123: Unknown error');
    });
});