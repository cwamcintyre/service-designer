import { type Component } from '@model/formTypes';
import { ComponentHandler } from '@/utils/componentHandler/interfaces';
import { evaluateExpression } from '../expressionUtils';

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

    async Validate(component: Component, data: { [key: string]: any }): Promise<string[]> {
        const validationResult: string[] = [];
        for (const validationRule of component.validationRules ?? []) {
            const isValid = await evaluateExpression(validationRule.expression, data);
            if (!isValid) {
                validationResult.push(validationRule.errorMessage);
            }
        }
        return validationResult;
    }

    Convert(component: Component, data: { [key: string]: any }): any {
        return component.name ? data[component.name] : undefined;
    }
}
