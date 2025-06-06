import { StartApplicationUseCase } from '@/usecase/start';
import ApplicationStoreTestDouble from '../doubles/applicationStore.testdouble';
import { FormStoreTestDouble } from '../doubles/formStore.testdouble';
import { StartApplicationRequest, StartApplicationResponse } from '@model/runnerApiTypes';
import { Form } from '@model/formTypes';

const mockBasicForm: Form = require('@/tests/data/test-text-component.json') as Form;

describe('StartApplicationUseCase', () => {
    let formStore: FormStoreTestDouble;
    let applicationStore: ApplicationStoreTestDouble;
    let startApplicationUseCase: StartApplicationUseCase;

    beforeEach(() => {
        formStore = new FormStoreTestDouble();
        applicationStore = new ApplicationStoreTestDouble();
        startApplicationUseCase = new StartApplicationUseCase(formStore, applicationStore);
    });

    it('should start an application successfully', async () => {
        formStore.withForm('form123', mockBasicForm);

        const request: StartApplicationRequest = { applicantId: 'applicant123', formId: 'form123' };
        const response: StartApplicationResponse = await startApplicationUseCase.execute(request);

        const applicationArg = applicationStore.getUpdateApplicationSpy().mock.calls[0][0];

        expect(response.startPageId).toBe(mockBasicForm.startPage);
        expect(response.extraData).toBe('');

        expect(applicationArg.id).toBe(request.applicantId);
        expect(applicationArg.applicantId).toBe(request.applicantId);
        expect(applicationArg.status).toBe('Started');
        expect(applicationArg.createdAt).toBeInstanceOf(Date);
        expect(applicationArg.updatedAt).toBeInstanceOf(Date);
        expect(applicationArg.formId).toBe(mockBasicForm.formId);
    });

    it('should throw an error if the form is not found', async () => {
        formStore.withNoForm('form123');

        const request: StartApplicationRequest = { applicantId: 'applicant123', formId: 'form123' };

        await expect(startApplicationUseCase.execute(request)).rejects.toThrow('Form with ID form123 not found.');
    });

    it('should handle errors thrown by the application store', async () => {
        formStore.withForm('form123', mockBasicForm);

        const error = new Error('Database error');
        applicationStore.withUpdateApplicationThrowing(error);

        const request: StartApplicationRequest = { applicantId: 'applicant123', formId: 'form123' };

        await expect(startApplicationUseCase.execute(request)).rejects.toThrow(`Error starting application with ID form123: ${error.message}`);
    });
});