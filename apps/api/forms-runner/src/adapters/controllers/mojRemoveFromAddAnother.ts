import { AppTypes } from '@/ioc/appTypes';
import { MoJRemoveFromAddAnotherUseCase } from '~/usecase/mojRemoveFromAddAnother';
import { MoJRemoveRequest } from '@model/runnerApiTypes';
import { type Request, type Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class MoJRemoveFromAddAnother {
    private useCase: MoJRemoveFromAddAnotherUseCase;
    constructor(@inject(AppTypes.MojRemoveFromAddAnotherUseCase) useCase: MoJRemoveFromAddAnotherUseCase) {
        this.useCase = useCase; 
    }

    public async post(request: Request, response: Response): Promise<void> {
        const processRequest: MoJRemoveRequest = {
            ...request.body
        };
        console.log("MoJRemoveFromAddAnother: processing form");
        console.log(`MoJRemoveFromAddAnother: ${JSON.stringify(processRequest)}`);
        const result = await this.useCase.execute(processRequest);
        if (result) {
            console.log(`MoJRemoveFromAddAnother: succeeded removing from another section for applicant ${processRequest.applicantId}`);
            response.status(200).send(result);
        } else {
            console.log(`MoJRemoveFromAddAnother: failed to process`);
            response.status(400).send();
        }
    }
}