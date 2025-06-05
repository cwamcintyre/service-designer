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
        const number = this.Convert(component, data);
        
        if (number) {
            console.log(`Validating number component: ${component.name}, value: ${number}`);
            const numberCheck = isNaN(Number(number));
            console.log(`Number check for component ${component.name}:`, numberCheck);
            if (numberCheck) {
                validationResult.push("Enter a valid number.");
            }
        }
        else if (!component.optional) {
            validationResult.push("Enter a valid number.");
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