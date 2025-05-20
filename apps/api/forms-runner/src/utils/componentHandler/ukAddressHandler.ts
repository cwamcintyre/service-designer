import { type Component } from '@model/formTypes';
import { ComponentHandler } from '@/utils/componentHandler/interfaces';
import { evaluateExpression } from '../expressionUtils';
import { type UKAddress } from '@model/formTypes';

export class UKAddressComponentHandler implements ComponentHandler {
    static IsFor(type: string): boolean {
        return type === 'ukaddress';
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

    Convert(component: Component, data: { [key: string]: any }): UKAddress {
        const ukAddress: UKAddress = {
            addressLine1: data[`${component.name}-addressLine1`],
            addressLine2: data[`${component.name}-addressLine2`],
            town: data[`${component.name}-addressTown`],
            county: data[`${component.name}-addressCounty`],
            postcode: data[`${component.name}-addressPostcode`],
        };
        return ukAddress;
    }
}
