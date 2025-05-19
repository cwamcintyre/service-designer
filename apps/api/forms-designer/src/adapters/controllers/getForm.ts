import { CONTAINER_TYPES } from '@/ioc/appTypes';
import { GetFormUseCase } from '@/usecase/getForm';
import { type Request, type Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class GetFormController {
    private useCase: GetFormUseCase;

    constructor(@inject(CONTAINER_TYPES.GetFormUseCase) useCase: GetFormUseCase) {
        this.useCase = useCase;
    }

    public async get(request: Request, response: Response): Promise<void> {
        try {
            const formId = request.params.id;
            const result = await this.useCase.execute(formId);
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
