import { type Form } from '@model/formTypes';

export interface formStore {
    getForm: (formId: string) => Promise<Form | null>;
    getForms: () => Promise<Form[]>;
    saveForm: (formId: string, form: Form) => Promise<void>;
    deleteForm: (formId: string) => Promise<void>;
    updateForm: (formId: string, form: Form) => Promise<void>;
}