import { type Component } from '@model/formTypes';
import { ComponentHandler } from '@/utils/componentHandler/interfaces';
import { evaluateExpression } from '../expressionUtils';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export class PhoneNumberComponentHandler implements ComponentHandler {

    static IsFor(type: string): boolean {
        return type === 'phonenumber';
    }

    async Validate(component: Component, data: { [key: string]: any }): Promise<string[]> {

        const validationResult: string[] = [];
        const phoneNumber = this.Convert(component, data);
        
        if (phoneNumber) {
            const phoneNumberObj = parsePhoneNumberFromString(phoneNumber, 'GB');
            if (!phoneNumberObj || !phoneNumberObj.isValid()) {
                validationResult.push("Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192");
            }
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
        return component.name ? data[component.name] : undefined;
    }
}