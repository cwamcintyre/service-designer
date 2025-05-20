import { type Component } from '@model/formTypes';
import { ComponentHandler } from '@/utils/componentHandler/interfaces';
import { evaluateExpression } from '../expressionUtils';

export class PhoneNumberComponentHandler implements ComponentHandler {
    static IsFor(type: string): boolean {
        return type === 'phonenumber';
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

    Convert(component: Component, data: { [key: string]: any }): string | undefined {
        return component.name ? data[component.name] : undefined;
    }
}
