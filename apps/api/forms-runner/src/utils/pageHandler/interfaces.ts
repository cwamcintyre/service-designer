import { Application, type Page } from '@model/formTypes';

export interface PageHandler {
    Process(application: Application, pageId: string, data: { [key: string]: any }, skipValidation?: boolean): Promise<boolean>;
    GetNextPageId(application: Application, pageId: string): Promise<{ nextPageId: string | undefined, nextPageType: string | undefined, extraData: string | undefined }>;
    WalkToNextInvalidOrUnfilledPage(application: Application, currentPageId: string, extraData: string): Promise<{ pageId: string, pageType: string, stop: boolean }>;
}