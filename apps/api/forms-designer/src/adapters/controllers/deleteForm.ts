import { CONTAINER_TYPES } from '@/ioc/appTypes';
import { DeleteFormUseCase } from '@/usecase/deleteForm';
import { type Request, type Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class DeleteFormController {
    private useCase: DeleteFormUseCase;

    constructor(@inject(CONTAINER_TYPES.DeleteFormUseCase) useCase: DeleteFormUseCase) {
        this.useCase = useCase;
    }

    public async delete(request: Request, response: Response): Promise<void> {
        try {
            const formId = request.params.id;
            const result = await this.useCase.execute(formId);
            response.status(200).json({ success: result });
        } catch (error) {
            if (error instanceof Error) {
                response.status(400).json({ error: error.message });
            } else {
                response.status(500).json({ error: 'Unknown error occurred' });
            }
        }
    }
}
