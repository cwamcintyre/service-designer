import { CONTAINER_TYPES } from '@/ioc/appTypes';
import { requestResponse } from '@clean/useCaseInterfaces';
import { type Form } from '@model/formTypes';
import { type CreateFormRequest } from '@model/designerApiTypes';
import { type formStore } from '@/usecase/shared/infrastructure/formStore';
import { inject, injectable } from 'inversify';

@injectable()
export class CreateFormUseCase implements requestResponse<CreateFormRequest, boolean> {
    public request: CreateFormRequest;
    public response: boolean;

    constructor(@inject(CONTAINER_TYPES.FormStore) public formStore: formStore) {
        this.request = { form: {} as Form };
        this.response = false;
    }

    public async execute(request: CreateFormRequest): Promise<boolean> {
        this.request = request;
        await this.formStore.saveForm(this.request.form.formId, this.request.form);
        this.response = true;
        return this.response;
    }
}