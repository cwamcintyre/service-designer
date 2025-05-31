import { CONTAINER_TYPES } from '@/ioc/appTypes';
import { requestResponse } from '@clean/useCaseInterfaces';
import { type GetFormResponse } from '@model/designerApiTypes';
import { type Form } from '@model/formTypes';
import { type FormStore } from '@/usecase/shared/infrastructure/formStore';
import { inject, injectable } from 'inversify';

@injectable()
export class GetFormUseCase implements requestResponse<string, GetFormResponse> {
    public request: string;
    public response: GetFormResponse;

    constructor(@inject(CONTAINER_TYPES.FormStore) public formStore: FormStore) {
        this.request = "";
        this.response = { form: {} as Form };
    }

    public async execute(formId: string): Promise<GetFormResponse> {
        this.request = formId;
        const form = await this.formStore.getForm(this.request);
        if (!form) {
            throw new Error(`Form with ID ${this.request} not found`);
        }
        this.response = { form };
        return this.response;
    }
}
