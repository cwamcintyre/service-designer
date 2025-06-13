import { AppTypes } from '@/ioc/appTypes';
import { MoJAddAnotherUseCase } from '~/usecase/mojAddAnother';
import { MoJAddAnotherRequest, ProcessApplicationResponse } from '@model/runnerApiTypes';
import { type Request, type Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class MoJAddAnother {
    private useCase: MoJAddAnotherUseCase;
    constructor(@inject(AppTypes.MojAddAnotherUseCase) useCase: MoJAddAnotherUseCase) {
        this.useCase = useCase; 
    }

    public async post(request: Request, response: Response): Promise<void> {
        const processRequest: MoJAddAnotherRequest = {
            ...request.body
        };
        console.log("MoJAddAnother: processing form");
        console.log(`MoJAddAnother: ${JSON.stringify(processRequest)}`);
        const result = await this.useCase.execute(processRequest);
        if (result) {
            console.log(`MoJAddAnother: succeeded adding another section for applicant ${processRequest.applicantId}`);
            response.status(200).send(result);
        } else {
            console.log(`MoJAddAnother: failed to process`);
            response.status(400).send();
        }
    }
}