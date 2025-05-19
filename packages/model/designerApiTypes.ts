import { type Form } from './formTypes';

export type CreateFormRequest = {
    form: Form;
};

export type UpdateFormRequest = {
    formId: string;
    form: Form;
};

export type DeleteFormRequest = {
    formId: string;
};

export type GetAllFormsResponse = {
    forms: Form[];
}

export type GetFormResponse = {
    form: Form | null;
};