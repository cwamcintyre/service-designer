import { type Component } from '@model/formTypes';
import { ComponentHandler } from '@/utils/componentHandler/interfaces';
import { evaluateExpression } from '../expressionUtils';
import validator from 'validator';

export class EmailComponentHandler implements ComponentHandler {
    static IsFor(type: string): boolean {
        return type === 'email';
    }

    async Validate(component: Component, data: { [key: string]: any }): Promise<string[]> {
        const validationResult: string[] = [];

        if (!component.name) {
            throw new Error('Component name is required for EmailComponentHandler');
        }

        const email = data[component.name];

        if (!email && component.optional) {
            return validationResult; // If the field is optional and no input, skip validation
        }

        // Validate email format
        if (email && !validator.isEmail(email)) {
            validationResult.push('Enter an email address in the correct format, like name@example.com');
        }
        else if (!component.optional && !email) {
            validationResult.push(component.optionalErrorMessage ??'Enter an email address in the correct format, like name@example.com');
        }

        for (const validationRule of component.validationRules ?? []) {
            const isValid = await evaluateExpression(validationRule.expression, data);
            if (!isValid) {
                validationResult.push(validationRule.errorMessage);
            }
        }
        return validationResult;
    }

    Convert(component: Component, data: { [key: string]: any }): string | undefined {
        if (component.name) {
            // For components with a name, return the value from data
            return data[component.name] || "";
        }
        return "";
    }
}
