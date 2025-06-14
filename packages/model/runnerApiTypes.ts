import { type Application } from './formTypes';

export type StartApplicationRequest = {
    applicantId: string;
    formId: string;
};

export type StartApplicationResponse = {
    startPageId: string;
    formTitle?: string;
    extraData?: string;
}

export type GetApplicationRequest = {
    applicantId: string;
    pageId: string;
    extraData?: string;
    onlyCurrentPage?: boolean;
};

export type GetApplicationResponse = {
    application: Application;
    previousExtraData?: string;
    previousPageId?: string;
}

export type ProcessApplicationRequest = {
    applicantId: string;
    pageId: string;
    formData: Record<string, any>;
    extraData?: string;
}

export type ProcessApplicationResponse = {
    nextPageId?: string;
    nextPageType?: string;
    extraData?: string;
}

export type MoJAddAnotherRequest = {
    applicantId: string;
    pageId: string;
    numberOfItems: number;
}

export type MoJRemoveRequest = {
    applicantId: string;
    pageId: string;
    itemIndex: number;
}