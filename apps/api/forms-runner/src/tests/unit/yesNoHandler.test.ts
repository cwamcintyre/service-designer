import { YesNoComponentHandler } from '@/utils/componentHandler/yesNoHandler';
import { Component, ValidationRule } from '@model/formTypes';

describe('YesNoComponentHandler', () => {
    describe('IsFor', () => {
        it('should return true for supported types', () => {
            expect(YesNoComponentHandler.IsFor('yesno')).toBe(true);
        });

        it('should return false for unsupported types', () => {
            expect(YesNoComponentHandler.IsFor('select')).toBe(false);
            expect(YesNoComponentHandler.IsFor('text')).toBe(false);
            expect(YesNoComponentHandler.IsFor('number')).toBe(false);
        });
    });

    describe('Validate', () => {
        it('should return an error if no option is selected and field is not optional', async () => {
            const mockComponent: Component = {
                name: 'optionField',
                questionId: 'q1',
                labelIsPageTitle: false,
                optional: false,
                optionalErrorMessage: 'Select an option'
            };

            const handler = new YesNoComponentHandler();
            const errors = await handler.Validate(mockComponent, { optionField: '' });

            expect(errors).toContain('Select an option');
        });

        it('should not return an error if no option is selected and field is optional', async () => {
            const mockComponent: Component = {
                name: 'optionField',
                questionId: 'q1',
                labelIsPageTitle: false,
                optional: true
            };

            const handler = new YesNoComponentHandler();
            const errors = await handler.Validate(mockComponent, { optionField: '' });

            expect(errors).toEqual([]);
        });       

        it('should return an empty array if all validation rules pass', async () => {
            const mockComponent: Component = {
                name: 'optionField',
                questionId: 'q1',
                labelIsPageTitle: false,
                validationRules: [
                    { id: 'rule1', expression: 'data.optionField.value === "yes"', errorMessage: 'Invalid option selected' } as ValidationRule,
                ],
            };

            const handler = new YesNoComponentHandler();
            const errors = await handler.Validate(mockComponent, { optionField: { id: 'yes', value: 'yes', label: "yes" } });

            expect(errors).toEqual([]);
        });
    });

    describe('Convert', () => {
        it('should return the matching option from component options', () => {
            const mockComponent: Component = {
                name: 'optionField',
                questionId: 'q1',
                labelIsPageTitle: false
            };

            const handler = new YesNoComponentHandler();
            const result = handler.Convert(mockComponent, { optionField: 'yes' });

            expect(result).toEqual({ id: 'yes', value: 'yes', label: 'Yes' });
        });

        it('should return an empty string if no matching option is found and the field is optional', () => {
            const mockComponent: Component = {
                name: 'optionField',
                questionId: 'q1',
                labelIsPageTitle: false,
                optional: true
            };

            const handler = new YesNoComponentHandler();
            const result = handler.Convert(mockComponent, { optionField: 'option3' });

            expect(result).toEqual("");
        });

        it('should throw an error if no matching option is found and the field is not optional', () => {
            const mockComponent: Component = {
                name: 'optionField',
                questionId: 'q1',
                labelIsPageTitle: false
            };

            const handler = new YesNoComponentHandler();
            expect(() => handler.Convert(mockComponent, { optionField: 'option3' })).toThrow(`No matching option found or invalid option type for value: option3 in component: optionField`);
        });
    });
});