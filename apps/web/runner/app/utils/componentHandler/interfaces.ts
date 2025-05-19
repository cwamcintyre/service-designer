export interface ComponentHandler {
    GetFromFormData(name: string, data: FormData): any;
    GetFromSavedData(name: string, data: { [key: string]: any }): any;
}