import { CONTAINER_TYPES } from '@/ioc/appTypes';
import { UpdateFormUseCase } from '@/usecase/updateForm';
import { type Request, type Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class UpdateFormController {
    private useCase: UpdateFormUseCase;

    constructor(@inject(CONTAINER_TYPES.UpdateFormUseCase) useCase: UpdateFormUseCase) {
        this.useCase = useCase;
    }

    public async post(request: Request, response: Response): Promise<void> {
        try {
            const updateFormRequest = request.body;
            const result = await this.useCase.execute(updateFormRequest);
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