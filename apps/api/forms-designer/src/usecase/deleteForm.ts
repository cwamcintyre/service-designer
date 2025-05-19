import { CONTAINER_TYPES } from '@/ioc/appTypes';
import { requestResponse } from '@clean/useCaseInterfaces';
import { type formStore } from '@/usecase/shared/infrastructure/formStore';
import { inject, injectable } from 'inversify';

export interface DeleteFormRequest {
    formId: string;
}

export interface DeleteFormResponse {
    success: boolean;
}

@injectable()
export class DeleteFormUseCase implements requestResponse<string, boolean> {
    public request: string;
    public response: boolean;

    constructor(@inject(CONTAINER_TYPES.FormStore) public formStore: formStore) {
        this.request = "";
        this.response = false;
    }

    public async execute(request: string): Promise<boolean> {
        this.request = request;
        await this.formStore.deleteForm(this.request);
        this.response = true;
        return this.response;
    }
}
