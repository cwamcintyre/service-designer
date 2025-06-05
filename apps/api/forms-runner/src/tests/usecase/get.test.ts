import { GetApplicationUseCase } from '@/usecase/get';
import ApplicationStoreTestDouble from '@/tests/doubles/applicationStore.testdouble';
import { GetApplicationRequest, GetApplicationResponse } from '@model/runnerApiTypes';
import { Application } from '@model/formTypes';

const mockBasicApplication: Application = require('@/tests/data/test-text-component.json') as Application;
const mockBasicApplicationWithBranch: Application = require('@/tests/data/previous-link-branch-b.json') as Application;

describe('GetApplicationUseCase', () => {
    let applicationStore: ApplicationStoreTestDouble;
    let getApplicationUseCase: GetApplicationUseCase;

    beforeEach(() => {
        applicationStore = new ApplicationStoreTestDouble();
        getApplicationUseCase = new GetApplicationUseCase(applicationStore);
    });

    it('should retrieve an application successfully', async () => {
        applicationStore.withGetApplicationReturning(mockBasicApplication);

        const request: GetApplicationRequest = { applicantId: '123', pageId: 'text-component', extraData: '' };
        const response: GetApplicationResponse = await getApplicationUseCase.execute(request);

        expect(response.application).toEqual(mockBasicApplication);
        expect(response.previousPageId).toBeDefined();
        expect(response.previousExtraData).toBeDefined();
    });

    it('should throw an error if the application is not found', async () => {
        applicationStore.withGetApplicationReturning(null);

        const request: GetApplicationRequest = { applicantId: '123', pageId: 'page1', extraData: '' };

        await expect(getApplicationUseCase.execute(request)).rejects.toThrow('Application with ID 123 not found.');
    });

    it('should handle errors thrown by the application store', async () => {
        const error = new Error('Database error');
        applicationStore.withGetApplicationThrowing(error);

        const request: GetApplicationRequest = { applicantId: '123', pageId: 'page1', extraData: 'extra' };

        await expect(getApplicationUseCase.execute(request)).rejects.toThrow(`Error getting application with ID 123: ${error.message}`);
    });

    it('should return the correct previous page when conditions are met', async () => {
        applicationStore.withGetApplicationReturning(mockBasicApplicationWithBranch);

        const request: GetApplicationRequest = { applicantId: '123', pageId: 'branch-b-subsequent-q', extraData: '' };
        const response: GetApplicationResponse = await getApplicationUseCase.execute(request);

        expect(response.previousPageId).toEqual('branch-b');
        expect(response.previousExtraData).toEqual('');
    })
});