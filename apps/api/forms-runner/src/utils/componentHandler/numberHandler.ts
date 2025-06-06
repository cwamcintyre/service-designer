import { type Component } from '@model/formTypes';
import { ComponentHandler } from '@/utils/componentHandler/interfaces';
import { evaluateExpression } from '../expressionUtils';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export class NumberComponentHandler implements ComponentHandler {

    static IsFor(type: string): boolean {
        return type === 'number';
    }

    async Validate(component: Component, data: { [key: string]: any }): Promise<string[]> {

        const validationResult: string[] = [];

        if (!component.name) {
            throw new Error('Component name is required for NumberComponentHandler');
        }

        const number = data[component.name];
        
        if (!number && component.optional) {
            return validationResult; // If the field is optional and no input, skip validation
        }

        if (number) {
            const numberCheck = isNaN(Number(number));
            if (numberCheck) {
                validationResult.push("Enter a number");
            }
        }
        else if (!component.optional) {
            validationResult.push(component.optionalErrorMessage ?? "Enter a number");
        }

        // check that the number is valid..
        for (const validationRule of component.validationRules ?? []) {
            const isValid = await evaluateExpression(validationRule.expression, data);
            if (!isValid) {
                validationResult.push(validationRule.errorMessage);
            }
        }
        return validationResult;
    }

    Convert(component: Component, data: { [key: string]: any }): string | undefined{
        if (component.name) {
            // For components with a name, return the value from data
            return data[component.name] || "";
        }
        return "";
    }
}