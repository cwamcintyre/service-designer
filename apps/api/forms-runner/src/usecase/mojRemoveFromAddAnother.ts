import { AppTypes } from '@/ioc/appTypes';
import { MoJRemoveRequest, type ProcessApplicationResponse } from '@model/runnerApiTypes';
import { requestResponse } from '@clean/useCaseInterfaces';
import { type Application, type AddAnotherPage } from '@model/formTypes';
import { type ApplicationStore } from '@/usecase/shared/infrastructure/applicationStore';
import { PageHandlerFactory } from '@/utils/pageHandler/pageHandlerFactory';
import { inject, injectable } from 'inversify';

@injectable()
export class MoJRemoveFromAddAnotherUseCase implements requestResponse<MoJRemoveRequest, ProcessApplicationResponse> {
    public request: MoJRemoveRequest;
    public response: ProcessApplicationResponse;

    constructor(@inject(AppTypes.ApplicationStore) public applicationStore: ApplicationStore) {
        this.request = { applicantId: '', pageId: '', itemIndex: 0, formData: {} };
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

            if (!page.pageType) {
                throw new Error(`Page type is undefined for page ID ${request.pageId} in application ${request.applicantId}.`);
            }

            page.numberOfItems = page.numberOfItems - 1;

            // Remove the item at the specified index
            page.pageAnswer = page.pageAnswer.filter((_, index) => index !== request.itemIndex);

            // Update the page errors if they exist so they are on the right page controls..
            if (page.pageErrors) {
                for (const component of page.components) {
                    if (component.name) {
                        const itemKey = `${request.itemIndex}-${component.name}`;
                        delete page.pageErrors[itemKey];
                    
                        // Re-index the errors to maintain consistency
                        for (let i = request.itemIndex; i < page.pageAnswer.length; i++) {
                            const newKey = `${i}-${component.name}`;
                            if (page.pageErrors[`${i + 1}-${component.name}`]) {
                                page.pageErrors[newKey] = page.pageErrors[`${i + 1}-${component.name}`];
                                delete page.pageErrors[`${i + 1}-${component.name}`];
                            }
                        }
                    }
                } 
            }

            // re-order the form data keys to match the new page answer structure
            const reorderedFormData: { [key: string]: any } = JSON.parse(JSON.stringify(request.formData));
            Object.keys(reorderedFormData).forEach((key) => {
                const match = key.match(/^(\d+)-(.+)$/);
                if (match) {
                    const index = parseInt(match[1], 10);
                    const suffix = match[2];
                    if (index > (request.itemIndex + 1)) {
                        const newKey = `${index - 1}-${suffix}`;
                        reorderedFormData[newKey] = reorderedFormData[key];
                        delete reorderedFormData[key];
                    }
                }
            });

            console.log("Reordered Form Data:", reorderedFormData);

            const pageHandler = PageHandlerFactory.For(page.pageType);
            // process the page so that we don't lose any input but skip validation..
            const processErrors = await pageHandler.Process(application, request.pageId, reorderedFormData, true);

            await this.applicationStore.updateApplication(application);

            // response always has this page ID as we don't want to navigate away when removing and item.
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