import { ComponentHandler } from '@/app/utils/componentHandler/interfaces';

export class DefaultComponentHandler implements ComponentHandler {
    static IsFor(type: string): boolean {
        return type === 'text' ||
            type === 'select' ||
            type === 'multilineText' ||
            type === 'radio' ||
            type === 'checkbox' ||
            type === 'yesno' ||
            type === 'email' ||
            type === 'phonenumber' ||
            type === 'fileupload';
    }

    GetFromFormData(name: string, data: FormData): any {
        const formData = data.get(name);
        if (formData === undefined) {
            return '';
        }
        if (formData === null) {
            return '';
        }
        return formData;
    }

    GetFromSavedData(name: string, data: { [key: string]: any }): any {
        if (data[name] === undefined) {
            return '';
        }
        if (data[name] === null) {
            return '';
        }
        return data[name];
    }
}
