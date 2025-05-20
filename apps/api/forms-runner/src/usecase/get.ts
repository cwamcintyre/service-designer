import { AppTypes } from '@/ioc/appTypes';
import { requestResponse } from '@clean/useCaseInterfaces';
import { type Application } from '@model/formTypes';
import { GetApplicationRequest, GetApplicationResponse } from '@model/runnerApiTypes';
import { type ApplicationStore } from '@/usecase/shared/infrastructure/applicationStore';
import { calculatePreviousPageId } from '@/utils/applicationUtils';
import { inject, injectable } from 'inversify';

@injectable()
export class GetApplicationUseCase implements requestResponse<GetApplicationRequest, GetApplicationResponse> {
    public request: GetApplicationRequest = { applicantId: '', pageId: '', extraData: '' };
    public response: GetApplicationResponse = { application: {} as Application, previousExtraData: '', previousPageId: '' };

    constructor(@inject(AppTypes.ApplicationStore) public applicationStore: ApplicationStore) {
    }

    public async execute(request: GetApplicationRequest): Promise<GetApplicationResponse> {
        try {
            
            const application = await this.applicationStore.getApplication(request.applicantId);
            if (!application) {
                throw new Error(`Application with ID ${request.applicantId} not found.`);
            }

            this.response = { application: {} as Application, previousExtraData: '', previousPageId: '' };
            
            this.response.application = application;

            const previousPageResult = await calculatePreviousPageId(application, request.pageId, request.extraData || "");
            if (previousPageResult) {
                const { pageId, extraData } = previousPageResult;
                if (pageId) {
                    this.response.previousPageId = pageId;
                    this.response.previousExtraData = extraData || "";
                }
            }

            console.log(`Application with ID ${request.applicantId} has been retrieved.`);
            console.log(`previousPageId: ${this.response.previousPageId}`);
            return this.response;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error getting application with ID ${request.applicantId}: ${error.message}`);
            } else {
                throw new Error(`Error getting application with ID ${request.applicantId}: Unknown error occurred.`);
            }
        }
    }
}