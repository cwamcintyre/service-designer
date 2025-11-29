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

        if (!component.name) {
            throw new Error('Component name is required');
        }

        const ukAddress: UKAddress = data[component.name];

        // if the field is optional and no fields have been filled out, ignore..
        if (component.optional && !ukAddress.addressLine1 && !ukAddress.town && !ukAddress.postcode && !ukAddress.addressLine2 && !ukAddress.county) {
            console.log('UKAddressComponentHandler Validate - optional and empty, skipping validation');
            return validationResult;
        }

        if ((!ukAddress.addressLine1 || ukAddress.addressLine1.trim() === '')) {
            validationResult.push('[addressLine1]-Enter address line 1, typically the building and street');
        }

        if ((!ukAddress.town || ukAddress.town.trim() === '')) {
            validationResult.push('[addressTown]-Enter town or city');
        }

        if ((!ukAddress.postcode || ukAddress.postcode.trim() === '')) {
            validationResult.push('[addressPostcode]-Enter postcode');
        }
        else if (ukAddress.postcode && !isValid(ukAddress.postcode)) {
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
        if (!component.name) {
            throw new Error('Component name is required');
        }

        const ukAddress: UKAddress = {
            addressLine1: data[`${component.name}-addressLine1`]?.trim(),
            addressLine2: data[`${component.name}-addressLine2`]?.trim(),
            town: data[`${component.name}-addressTown`]?.trim(),
            county: data[`${component.name}-addressCounty`]?.trim(),
            postcode: data[`${component.name}-addressPostcode`]?.trim()
        };
        
        return ukAddress;
    }
}
