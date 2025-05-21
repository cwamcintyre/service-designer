import { AppTypes } from '@/ioc/appTypes';
import { ProcessApplicationChangeUseCase } from '~/usecase/processChange';
import { ProcessApplicationRequest } from '@model/runnerApiTypes';
import { type Request, type Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ProcessChangeController {
    private useCase: ProcessApplicationChangeUseCase;
    constructor(@inject(AppTypes.ProcessChangeUseCase) useCase: ProcessApplicationChangeUseCase) {
        this.useCase = useCase; 
    }

    public async patch(request: Request, response: Response): Promise<void> {
        const processRequest: ProcessApplicationRequest = {
            ...request.body
        };
        console.log("ProcessChangeController: processing form");
        console.log(`ProcessChangeController: ${JSON.stringify(processRequest)}`);
        const result = await this.useCase.execute(processRequest);
        if (result) {
            console.log(`ProcessChangeController: form processed for applicant ${processRequest.applicantId}`);
            response.status(200).send(result);
        } else {
            console.log(`ProcessChangeController: failed to process form`);
            response.status(400).send();
        }
    }
}