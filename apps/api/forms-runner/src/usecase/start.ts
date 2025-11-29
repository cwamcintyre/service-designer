import { AppTypes } from '@/ioc/appTypes';
import { requestResponse } from '@clean/useCaseInterfaces';
import { type Application } from '@model/formTypes';
import { StartApplicationResponse, type StartApplicationRequest } from '@model/runnerApiTypes';
import { type FormStore } from '@/usecase/shared/infrastructure/formStore';
import { type ApplicationStore } from '@/usecase/shared/infrastructure/applicationStore';
import { inject, injectable } from 'inversify';

@injectable()
export class StartApplicationUseCase implements requestResponse<StartApplicationRequest, StartApplicationResponse> {
    public request: StartApplicationRequest = { applicantId: '', formId: '' };
    public response: StartApplicationResponse = { startPageId: '', extraData: '' };

    constructor(@inject(AppTypes.FormStore) public formStore: FormStore, 
                @inject(AppTypes.ApplicationStore) public applicationStore: ApplicationStore) {
    }

    public async execute(request: StartApplicationRequest): Promise<StartApplicationResponse> {
        try {
            const form = await this.formStore.getForm(request.formId);
            if (!form) {
                throw new Error(`Form with ID ${request.formId} not found.`);
            }

            this.response = { startPageId: '', extraData: '' };
            
            // Update the application with the applicantId and mark it as started
            const application: Application = {
                ...form,
                id: request.applicantId,
                applicantId: request.applicantId,
                status: "Started",
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),                
            };

            await this.applicationStore.updateApplication(application);

            console.log(`Application with ID ${request.formId} has been started for applicant ${request.applicantId}.`);
            return { startPageId: application.startPage, extraData: "", formTitle: form.title };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error starting application with ID ${request.formId}: ${error.message}`);
            } else {
                throw new Error(`Error starting application with ID ${request.formId}: Unknown error occurred.`);
            }
        }
    }
}