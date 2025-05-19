import { AppTypes } from '@/ioc/appTypes';
import { ProcessFormUseCase } from '~/usecase/process';
import { ProcessFormRequest, ProcessFormResponse } from '@model/runnerApiTypes';
import { type Request, type Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ProcessController {
    private useCase: ProcessFormUseCase;
    constructor(@inject(AppTypes.ProcessUseCase) useCase: ProcessFormUseCase) {
        this.useCase = useCase; 
    }

    public async post(request: Request, response: Response): Promise<void> {
        const processRequest: ProcessFormRequest = {
            ...request.body
        };
        const result = await this.useCase.execute(processRequest);
        if (result) {
            response.status(201).send();
        } else {
            response.status(400).send();
        }
    }
}