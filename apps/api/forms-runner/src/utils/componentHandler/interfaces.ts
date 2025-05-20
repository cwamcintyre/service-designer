import { type Component } from '@model/formTypes';

export interface ComponentHandler {
    Validate(component: Component, data: { [key: string]: any }): any;
    Convert(component: Component, data: { [key: string]: any }): any;
}