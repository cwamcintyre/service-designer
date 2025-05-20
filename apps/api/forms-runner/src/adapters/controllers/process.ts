import { AppTypes } from '@/ioc/appTypes';
import { ProcessApplicationUseCase } from '~/usecase/process';
import { ProcessApplicationRequest, ProcessApplicationResponse } from '@model/runnerApiTypes';
import { type Request, type Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ProcessController {
    private useCase: ProcessApplicationUseCase;
    constructor(@inject(AppTypes.ProcessUseCase) useCase: ProcessApplicationUseCase) {
        this.useCase = useCase; 
    }

    public async post(request: Request, response: Response): Promise<void> {
        const processRequest: ProcessApplicationRequest = {
            ...request.body
        };
        console.log("ProcessController: processing form");
        console.log(`ProcessController: ${JSON.stringify(processRequest)}`);
        const result = await this.useCase.execute(processRequest);
        if (result) {
            console.log(`ProcessController: form processed for applicant ${processRequest.applicantId}`);
            response.status(200).send(result);
        } else {
            console.log(`ProcessController: failed to process form`);
            response.status(400).send();
        }
    }
}