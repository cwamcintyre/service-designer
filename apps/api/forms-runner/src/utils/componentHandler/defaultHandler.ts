import { type Component } from '@model/formTypes';
import { ComponentHandler } from '@/utils/componentHandler/interfaces';
import { evaluateExpression } from '../expressionUtils';

export class DefaultComponentHandler implements ComponentHandler {
    static IsFor(type: string): boolean {
        return type === 'text' ||
            type === 'multilineText' ||
            type === 'fileupload';
    }

    async Validate(component: Component, data: { [key: string]: any }): Promise<string[]> {
        const validationResult: string[] = [];
        
        if (!component.name) {
            throw new Error('Component name is required');
        }   

        const input = data[component.name];

        if (!input && component.optional) {
            return validationResult; // If the field is optional and no input, skip validation
        }

        if (!input && !component.optional) {
            validationResult.push(component.optionalErrorMessage ?? "An answer is required");
        }

        for (const validationRule of component.validationRules ?? []) {
            const isValid = await evaluateExpression(validationRule.expression, data);
            if (!isValid) {
                validationResult.push(validationRule.errorMessage);
            }
        }
        return validationResult;
    }

    Convert(component: Component, data: { [key: string]: any }): any {
        if (!component.name) {
            throw new Error('Component name is required');
        }
        return data[component.name];
    }
}
