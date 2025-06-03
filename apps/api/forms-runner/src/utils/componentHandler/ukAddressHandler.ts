import { type Component } from '@model/formTypes';
import { ComponentHandler } from '@/utils/componentHandler/interfaces';
import { evaluateExpression } from '../expressionUtils';
import { isValid } from 'postcode';
import { type UKAddress } from '@model/formTypes';

export class UKAddressComponentHandler implements ComponentHandler {
    static IsFor(type: string): boolean {
        return type === 'ukaddress';
    }

    async Validate(component: Component, data: { [key: string]: any }): Promise<string[]> {
        const validationResult: string[] = [];

        const addressLine1 = component.name ? data[component.name]?.addressLine1 : undefined;
        if (!addressLine1 || addressLine1.trim() === '') {
            validationResult.push('[addressLine1]-Enter address line 1, typically the building and street');
        }

        const town = component.name ? data[component.name]?.town : undefined;
        if (!town || town.trim() === '') {
            validationResult.push('[addressTown]-Enter town or city');
        }

        const postcode = component.name ? data[component.name]?.postcode : undefined;
        if (!postcode || postcode.trim() === '') {
            validationResult.push('[addressPostcode]-Enter postcode');
        }
        else if (!isValid(postcode)) {
            validationResult.push('[addressPostcode]-Enter a full UK postcode');
        }

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
