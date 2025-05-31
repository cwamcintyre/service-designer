import { type Component } from '@model/formTypes';
import { ComponentHandler } from '@/utils/componentHandler/interfaces';
import { evaluateExpression } from '../expressionUtils';

export class OptionsComponentHandler implements ComponentHandler {
    static IsFor(type: string): boolean {
        return type === 'select' ||
            type === 'radio' ||
            type === 'checkbox' ||
            type === 'yesno'
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
        if (component.name) {
            // For components with a name, return the matching option from component.options
            const selectedValue = data[component.name];
            const matchingOption = component.options?.find(option => option.value === selectedValue);
            return matchingOption || "";
        }
        return "";
    }
}
