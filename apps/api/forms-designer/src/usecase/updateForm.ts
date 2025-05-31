import { CONTAINER_TYPES } from '@/ioc/appTypes';
import { type UpdateFormRequest } from '@model/designerApiTypes';
import { requestResponse } from '@clean/useCaseInterfaces';
import { type Form } from '@model/formTypes';
import { type FormStore } from '@/usecase/shared/infrastructure/formStore';
import { inject, injectable } from 'inversify';


@injectable()
export class UpdateFormUseCase implements requestResponse<UpdateFormRequest, boolean> {
    public request: UpdateFormRequest;
    public response: boolean;

    constructor(@inject(CONTAINER_TYPES.FormStore) public formStore: FormStore) {
        this.request = { formId: '', form: {} as Form };
        this.response = false;
    }

    public async execute(request: UpdateFormRequest): Promise<boolean> {
        this.request = request;
        await this.formStore.updateForm(this.request.form.formId, this.request.form);
        this.response = true;
        return this.response;
    }
}
