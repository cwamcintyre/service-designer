import { AppTypes } from '@/ioc/appTypes';
import { MoJAddAnotherRequest, type ProcessApplicationRequest, type ProcessApplicationResponse } from '@model/runnerApiTypes';
import { requestResponse } from '@clean/useCaseInterfaces';
import { type Application, type AddAnotherPage } from '@model/formTypes';
import { type ApplicationStore } from '@/usecase/shared/infrastructure/applicationStore';
import { PageHandlerFactory } from '@/utils/pageHandler/pageHandlerFactory';
import { inject, injectable } from 'inversify';

@injectable()
export class MoJAddAnotherUseCase implements requestResponse<MoJAddAnotherRequest, ProcessApplicationResponse> {
    public request: MoJAddAnotherRequest;
    public response: ProcessApplicationResponse;

    constructor(@inject(AppTypes.ApplicationStore) public applicationStore: ApplicationStore) {
        this.request = { applicantId: '', pageId: '', numberOfItems: 0, formData: {} };
        this.response = { nextPageId: '', extraData: '' };
    }

    public async execute(request: MoJAddAnotherRequest): Promise<ProcessApplicationResponse> {
        try {
            this.request = request;
            const application = await this.applicationStore.getApplication(request.applicantId);
            if (!application) {
                throw new Error(`Application with ID ${request.applicantId} not found.`);
            }

            const page: AddAnotherPage | undefined = application.pages.find((p): p is AddAnotherPage => p.pageId === request.pageId && 'numberOfItems' in p);
            if (!page) {
                throw new Error(`Page with ID ${request.pageId} not found.`);
            }

            if (!page.pageType) {
                throw new Error(`Page type is undefined for page ID ${request.pageId} in application ${request.applicantId}.`);
            }

            const pageHandler = PageHandlerFactory.For(page.pageType);
            // process the page so that we don't lose any input but skip validation..
            const processErrors = await pageHandler.Process(application, request.pageId, request.formData, true);

            page.numberOfItems = request.numberOfItems;

            await this.applicationStore.updateApplication(application);

            this.response = { nextPageId: request.pageId, extraData: "" };
            return this.response;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error adding another for applicant ${request.applicantId}: ${error.message}`);
            } else {
                throw new Error(`Error adding another for applicant ${request.applicantId}: Unknown error occurred.`);
            }
        }
    }
}