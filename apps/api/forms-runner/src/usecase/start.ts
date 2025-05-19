import { AppTypes } from '@/ioc/appTypes';
import { requestResponse } from '@clean/useCaseInterfaces';
import { type Application } from '@model/formTypes';
import { type StartApplicationRequest } from '@model/runnerApiTypes';
import { type FormStore } from '@/usecase/shared/infrastructure/formStore';
import { type ApplicationStore } from '@/usecase/shared/infrastructure/applicationStore';
import { inject, injectable } from 'inversify';

@injectable()
export class StartApplicationUseCase implements requestResponse<StartApplicationRequest, boolean> {
    public request: StartApplicationRequest = { applicantId: '', formId: '' };
    public response: boolean;

    constructor(@inject(AppTypes.FormStore) public formStore: FormStore, 
                @inject(AppTypes.ApplicationStore) public applicationStore: ApplicationStore) {
        this.response = false;
    }

    public async execute(request: StartApplicationRequest): Promise<boolean> {
        try {
            const form = await this.formStore.getForm(request.formId);
            if (!form) {
                throw new Error(`Form with ID ${request.formId} not found.`);
            }

            // Update the application with the applicantId and mark it as started
            const application: Application = {
                applicantId: request.applicantId,
                status: "Started",
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
                ...form
            };

            await this.applicationStore.updateApplication(application);

            console.log(`Application with ID ${request.formId} has been started for applicant ${request.applicantId}.`);
            return true;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error starting application with ID ${request.formId}: ${error.message}`);
            } else {
                throw new Error(`Error starting application with ID ${request.formId}: Unknown error occurred.`);
            }
        }
    }
}