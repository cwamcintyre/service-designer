import { type Application } from '@model/formTypes';

export interface ApplicationStore {
    getApplication: (formId: string) => Promise<Application | null>;
    updateApplication: (form: Application) => Promise<void>;
    deleteApplication: (formId: string) => Promise<void>;
}