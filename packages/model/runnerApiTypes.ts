import { type Application } from './formTypes';

export type StartApplicationRequest = {
    applicantId: string;
    formId: string;
};

export type StartApplicationResponse = {
    startPageId: string;
    extraData?: string;
}

export type GetApplicationRequest = {
    applicantId: string;
    pageId: string;
    extraData?: string;
};

export type GetApplicationResponse = {
    application: Application;
    previousExtraData?: string;
    previousPageId?: string;
}

export type ProcessFormRequest = {
    applicantId: string;
    pageId: string;
    formData: Record<string, any>;
    extraData?: string;
}

export type ProcessFormResponse = {
    nextPageId?: string;
    nextPageType?: string;
    extraData?: string;
}