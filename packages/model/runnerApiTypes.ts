import { type Application } from './formTypes';

export type StartApplicationRequest = {
    applicantId: string;
    formId: string;
};

export type ProcessFormRequest = {
    applicantId: string;
    pageId: string;
    formData: Record<string, any>;
}

export type ProcessFormResponse = {
    nextPageId: string;
    extraData: string;
}