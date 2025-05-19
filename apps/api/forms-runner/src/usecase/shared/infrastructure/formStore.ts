import { type Form } from '@model/formTypes';

export interface FormStore {
    getForm: (formId: string) => Promise<Form | null>;
}