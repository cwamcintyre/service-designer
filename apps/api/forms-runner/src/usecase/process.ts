import { AppTypes } from '@/ioc/appTypes';
import { type ProcessApplicationRequest, type ProcessApplicationResponse } from '@model/runnerApiTypes';
import { requestResponse } from '@clean/useCaseInterfaces';
import { PageHandlerFactory } from '@/utils/pageHandler/pageHandlerFactory';
import { type Application } from '@model/formTypes';
import { type ApplicationStore } from '@/usecase/shared/infrastructure/applicationStore';
import { inject, injectable } from 'inversify';

@injectable()
export class ProcessApplicationUseCase implements requestResponse<ProcessApplicationRequest, ProcessApplicationResponse> {
    public request: ProcessApplicationRequest;
    public response: ProcessApplicationResponse;

    constructor(@inject(AppTypes.ApplicationStore) public applicationStore: ApplicationStore) {
        this.request = { applicantId: '', pageId: '', formData: {} };
        this.response = { nextPageId: '', extraData: '' };
    }

    public async execute(request: ProcessApplicationRequest): Promise<ProcessApplicationResponse> {
        try {
            const application = await this.applicationStore.getApplication(request.applicantId);
            if (!application) {
                throw new Error(`Application with ID ${request.applicantId} not found.`);
            }

            const { applicantId, pageId, formData } = request;
            this.response = { nextPageId: '', extraData: '' };
            
            const page = application.pages.find((p) => p.pageId === pageId);

            if (!page) {
                throw new Error(`Page with ID ${pageId} not found in application ${applicantId}.`);
            }

            if (!page.pageType) {
                throw new Error(`Page type is undefined for page ID ${pageId} in application ${applicantId}.`);
            }
            
            const pageHandler = PageHandlerFactory.For(page.pageType);
            const processErrors = await pageHandler.Process(application, pageId, formData);
            
            if (processErrors) {
                this.response = { nextPageId: page.pageId, nextPageType: page.pageType, extraData: request.extraData };
            }
            else {
                this.response = await pageHandler.GetNextPageId(application, pageId);
            }

            await this.applicationStore.updateApplication(application);

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