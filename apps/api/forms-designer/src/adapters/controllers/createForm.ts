import { CONTAINER_TYPES } from '@/ioc/appTypes';
import { CreateFormUseCase } from '~/usecase/createForm';
import { CreateFormRequest } from '@model/designerApiTypes';
import { type Request, type Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class CreateFormController {
    private useCase: CreateFormUseCase;
    constructor(@inject(CONTAINER_TYPES.CreateFormUseCase) useCase: CreateFormUseCase) {
        this.useCase = useCase; 
    }

    public async put(request: Request, response: Response): Promise<void> {
        const createFormRequest: CreateFormRequest = {
            ...request.body
        };
        const result = await this.useCase.execute(createFormRequest);
        if (result) {
            response.status(201).send();
        } else {
            response.status(400).send();
        }
    }
}