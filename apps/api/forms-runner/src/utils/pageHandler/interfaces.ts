import { Application, type Page } from '@model/formTypes';

export interface PageHandler {
    Process(application: Application, pageId: string, data: { [key: string]: any }): Promise<boolean>;
    GetNextPageId(application: Application, pageId: string): Promise<{ nextPageId: string | undefined, nextPageType: string | undefined, extraData: string | undefined }>;
    WalkToNextInvalidOrUnfilledPage(): string;
}