import { type Page } from '@model/formTypes';
import { type GetDataForPageResponse } from '@/services/formServices';

export interface PageHandler {
    HandlePage(page: Page, pageResponseData: GetDataForPageResponse): void;
    GetSubmittedData(page: Page, data: FormData): any;
}