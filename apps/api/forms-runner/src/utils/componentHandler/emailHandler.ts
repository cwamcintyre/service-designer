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

        const email = this.Convert(component, data);

        // Validate email format
        if (email && !validator.isEmail(email)) {
            validationResult.push('Enter an email address in the correct format, like name@example.com');
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
        return component.name ? data[component.name] : undefined;
    }
}
