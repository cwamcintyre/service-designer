import { FormStore } from '@/usecase/shared/infrastructure/formStore';
import { Form } from '@model/formTypes';

export class FormStoreTestDouble implements FormStore {
    private forms: Map<string, Form | null> = new Map();

    public withForm(formId: string, form: Form): FormStoreTestDouble {
        this.forms.set(formId, form);
        return this;
    }

    public withNoForm(formId: string): FormStoreTestDouble {
        this.forms.set(formId, null);
        return this;
    }

    public async getForm(formId: string): Promise<Form | null> {
        return this.forms.get(formId) ?? null;
    }
}