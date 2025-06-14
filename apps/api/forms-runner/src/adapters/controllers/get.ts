import { AppTypes } from '@/ioc/appTypes';
import { GetApplicationUseCase } from '~/usecase/get';
import { GetApplicationRequest, GetApplicationResponse } from '@model/runnerApiTypes';
import { type Request, type Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class GetApplicationController {
    private useCase: GetApplicationUseCase;
    constructor(@inject(AppTypes.GetApplicationUseCase) useCase: GetApplicationUseCase) {
        this.useCase = useCase; 
    }

    public async get(request: Request, response: Response): Promise<void> {
        try {
            const getApplicationRequest: GetApplicationRequest = {
                applicantId: request.params.applicantId,
                pageId: request.params.pageId,
                extraData: request.params.extraData,
                onlyCurrentPage: request.params.onlyCurrentPage ? request.params.onlyCurrentPage === 'true' : undefined,
            };
            console.log("GetApplicationController: getting application");
            console.log(`GetApplicationController: ${JSON.stringify(getApplicationRequest)}`);

            const result = await this.useCase.execute(getApplicationRequest);
            if (result) {
                console.log(`GetApplicationController: application retrieved with ID ${getApplicationRequest.applicantId}`);
                response.status(200).send(result);
            } else {
                console.log(`GetApplicationController: failed to get application`);
                response.status(400).send();
            }
        } catch (error) {
            console.error(`GetApplicationController: ${error}`);
            response.status(500).send({ error: 'Internal Server Error' });
        }
    }
}