import { CONTAINER_TYPES } from '@/ioc/appTypes';
import { GetAllFormsUseCase } from '@/usecase/getAllForms';
import { type Request, type Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class GetAllFormsController {
    private useCase: GetAllFormsUseCase;

    constructor(@inject(CONTAINER_TYPES.GetAllFormsUseCase) useCase: GetAllFormsUseCase) {
        this.useCase = useCase;
    }

    public async get(request: Request, response: Response): Promise<void> {
        try {
            const result = await this.useCase.execute();
            response.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                response.status(400).json({ error: error.message });
            } else {
                response.status(500).json({ error: 'Unknown error occurred' });
            }
        }
    }
}
