import { CONTAINER_TYPES } from '@/ioc/appTypes';
import { type GetAllFormsResponse } from '@model/designerApiTypes';
import { voidResponse } from '@clean/useCaseInterfaces';
import { type Form } from '@model/formTypes';
import { type formStore } from '@/usecase/shared/infrastructure/formStore';
import { inject, injectable } from 'inversify';


@injectable()
export class GetAllFormsUseCase implements voidResponse<GetAllFormsResponse> {
    public response: GetAllFormsResponse;

    constructor(@inject(CONTAINER_TYPES.FormStore) public formStore: formStore) {
        this.response = { forms: [] };
    }

    public async execute(): Promise<GetAllFormsResponse> {
        const forms = await this.formStore.getForms();
        this.response = { forms };
        return this.response;
    }
}
