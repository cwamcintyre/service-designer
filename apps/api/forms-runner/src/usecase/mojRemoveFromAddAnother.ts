import { AppTypes } from '@/ioc/appTypes';
import { MoJRemoveRequest, type ProcessApplicationResponse } from '@model/runnerApiTypes';
import { requestResponse } from '@clean/useCaseInterfaces';
import { type Application, type AddAnotherPage } from '@model/formTypes';
import { type ApplicationStore } from '@/usecase/shared/infrastructure/applicationStore';
import { inject, injectable } from 'inversify';

@injectable()
export class MoJRemoveFromAddAnotherUseCase implements requestResponse<MoJRemoveRequest, ProcessApplicationResponse> {
    public request: MoJRemoveRequest;
    public response: ProcessApplicationResponse;

    constructor(@inject(AppTypes.ApplicationStore) public applicationStore: ApplicationStore) {
        this.request = { applicantId: '', pageId: '', itemIndex: 0 };
        this.response = { nextPageId: '', extraData: '' };
    }

    public async execute(request: MoJRemoveRequest): Promise<ProcessApplicationResponse> {
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
            
            if (!page.pageAnswer || request.itemIndex < 0 || request.itemIndex >= page.pageAnswer.length) {
                throw new Error(`Item index ${request.itemIndex} is out of bounds for page ${request.pageId}.`);
            }

            page.numberOfItems = page.numberOfItems - 1;

            // Remove the item at the specified index
            page.pageAnswer = page.pageAnswer.filter((_, index) => index !== request.itemIndex);

            await this.applicationStore.updateApplication(application);

            this.response = { nextPageId: request.pageId, extraData: "" };
            return this.response;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error removing from add another for applicant ${request.applicantId}: ${error.message}`);
            } else {
                throw new Error(`Error removing from add another for applicant ${request.applicantId}: Unknown error occurred.`);
            }
        }
    }
}