import { type Component } from '@model/formTypes';
import { ComponentHandler } from '@/utils/componentHandler/interfaces';
import { evaluateExpression } from '../expressionUtils';

export class YesNoComponentHandler implements ComponentHandler {
    static IsFor(type: string): boolean {
        return type === 'yesno';
    }

    async Validate(component: Component, data: { [key: string]: any }): Promise<string[]> {
        const validationResult: string[] = [];

        if (!component.name) {
            throw new Error('Component name is required');
        }

        const option = data[component.name];
        
        if (component.optional && !option) {
            return validationResult; // If the field is optional and no input, skip validation
        }

        if (!option && !component.optional) {
            validationResult.push(component.optionalErrorMessage ?? "An answer is required");
        }

        for (const validationRule of component.validationRules ?? []) {
            const isValid = await evaluateExpression(validationRule.expression, data);
            if (!isValid) {
                validationResult.push(validationRule.errorMessage);
            }
        }

        return validationResult;
    }

    Convert(component: Component, data: { [key: string]: any }): any {
        if (!component.name) {
            throw new Error('Component name is required');
        }
        
        // For components with a name, return the matching option from component.options
        const selectedValue = data[component.name];            

        // if no matching option, the field is not optional and there is a value set, throw an error..
        if (!component.optional && data[component.name] && (selectedValue !== "yes" && selectedValue !== "no")) {
            throw new Error(`No matching option found or invalid option type for value: ${selectedValue} in component: ${component.name}`);
        }

        let returnOption;
        if (selectedValue === "yes") {
            returnOption = {
                id: "yes",
                value: "yes",
                label: "Yes"
            }
        }
        else if (selectedValue === "no") {
            returnOption = {
                id: "no",
                value: "no",
                label: "No"
            }
        }

        return returnOption || "";
    }
}