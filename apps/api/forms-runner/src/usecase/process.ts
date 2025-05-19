import { AppTypes } from '@/ioc/appTypes';
import { type ProcessFormRequest, type ProcessFormResponse } from '@model/runnerApiTypes';
import { requestResponse } from '@clean/useCaseInterfaces';
import { type Application } from '@model/formTypes';
import { type ApplicationStore } from '@/usecase/shared/infrastructure/applicationStore';
import { inject, injectable } from 'inversify';

@injectable()
export class ProcessFormUseCase implements requestResponse<ProcessFormRequest, ProcessFormResponse> {
    public request: ProcessFormRequest;
    public response: ProcessFormResponse;

    constructor(@inject(AppTypes.ApplicationStore) public applicationStore: ApplicationStore) {
        this.request = { applicantId: '', pageId: '', formData: {} };
        this.response = { nextPageId: '', extraData: '' };
    }

    public async execute(request: ProcessFormRequest): Promise<ProcessFormResponse> {
        try {
            const application = await this.applicationStore.getApplication(request.applicantId);
            if (!application) {
                throw new Error(`Application with ID ${request.applicantId} not found.`);
            }


            return this.response;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error processing form for applicant ${request.applicantId}: ${error.message}`);
            } else {
                throw new Error(`Error processing form for applicant ${request.applicantId}: Unknown error occurred.`);
            }
        }
    }
}