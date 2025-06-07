import { type Component } from '@model/formTypes';
import { ComponentHandler } from '@/utils/componentHandler/interfaces';
import { evaluateExpression } from '../expressionUtils';

export class OptionsComponentHandler implements ComponentHandler {
    static IsFor(type: string): boolean {
        return type === 'select' ||
            type === 'radio' ||
            type === 'checkbox';
    }

    async Validate(component: Component, data: { [key: string]: any }): Promise<string[]> {
        const validationResult: string[] = [];

        if (!component.name) {
            throw new Error('Component name is required for OptionsComponentHandler');
        }

        const option = data[component.name];
        
        console.log(`Validating component: ${component.name}, option: ${option}, optional: ${component.optional}`);

        if (component.optional && !option) {
            return validationResult; // If the field is optional and no input, skip validation
        }

        if (!option && !component.optional) {
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
        if (component.name) {
            // For components with a name, return the matching option from component.options
            const selectedValue = data[component.name];
            const matchingOption = component.options?.find(option => option.value == selectedValue);

            // if no matching option, the field is not optional and there is a value set, throw an error..
            if (!matchingOption && !component.optional && data[component.name]) {
                throw new Error(`No matching option found or invalid option type for value: ${selectedValue} in component: ${component.name}`);
            }
            return matchingOption || "";
        }
        return "";
    }
}
