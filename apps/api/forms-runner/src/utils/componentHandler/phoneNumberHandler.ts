import { type Component } from '@model/formTypes';
import { ComponentHandler } from '@/utils/componentHandler/interfaces';
import { evaluateExpression } from '../expressionUtils';
import { parsePhoneNumberWithError, parsePhoneNumberFromString } from 'libphonenumber-js';

export class PhoneNumberComponentHandler implements ComponentHandler {

    static IsFor(type: string): boolean {
        return type === 'phonenumber';
    }

    async Validate(component: Component, data: { [key: string]: any }): Promise<string[]> {

        const validationResult: string[] = [];

        if (!component.name) {
            throw new Error('Component name is required for PhoneNumberComponentHandler');
        }

        const phoneNumber = data[component.name];

        if (!phoneNumber && component.optional) {
            return validationResult; // If the field is optional and no input, skip validation
        }

        if (phoneNumber) {
            const phoneNumberObj = parsePhoneNumberFromString(phoneNumber, 'GB');
            if (!phoneNumberObj || !phoneNumberObj.isValid()) {
                validationResult.push("Enter a phone number, like 02010 960 001, 07729 900 982 or +44 808 157 0192");
            }
        }
        else if (!component.optional) {
            validationResult.push(component.optionalErrorMessage ?? "Enter a phone number, like 02010 960 001, 07729 900 982 or +44 808 157 0192");
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