import { AppTypes } from '@/ioc/appTypes';
import { StartApplicationUseCase } from '~/usecase/start';
import { StartApplicationRequest } from '@model/runnerApiTypes';
import { type Request, type Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class StartApplicationController {
    private useCase: StartApplicationUseCase;
    constructor(@inject(AppTypes.StartApplicationUseCase) useCase: StartApplicationUseCase) {
        this.useCase = useCase; 
    }

    public async put(request: Request, response: Response): Promise<void> {
        const startApplicationRequest: StartApplicationRequest = {
            ...request.body
        };
        const result = await this.useCase.execute(startApplicationRequest);
        if (result) {
            response.status(201).send();
        } else {
            response.status(400).send();
        }
    }
}