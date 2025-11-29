import { OptionsComponentHandler } from '@/utils/componentHandler/optionsHandler';
import { Component, ValidationRule } from '@model/formTypes';

describe('OptionsComponentHandler', () => {
    describe('IsFor', () => {
        it('should return true for supported types', () => {
            expect(OptionsComponentHandler.IsFor('select')).toBe(true);
            expect(OptionsComponentHandler.IsFor('radio')).toBe(true);
            expect(OptionsComponentHandler.IsFor('checkbox')).toBe(true);
        });

        it('should return false for unsupported types', () => {
            expect(OptionsComponentHandler.IsFor('yesno')).toBe(false);
            expect(OptionsComponentHandler.IsFor('text')).toBe(false);
            expect(OptionsComponentHandler.IsFor('number')).toBe(false);
        });
    });

    describe('Validate', () => {

        it('should throw an error if the component name is not provided', async () => {
            const mockComponent: Component = {
                questionId: 'q1',
                labelIsPageTitle: false
            };
            const handler = new OptionsComponentHandler();
            await expect(handler.Validate(mockComponent, {})).rejects.toThrow('Component name is required');
        });

        it('should return an error if no option is selected and field is not optional', async () => {
            const mockComponent: Component = {
                name: 'optionField',
                questionId: 'q1',
                labelIsPageTitle: false,
                optional: false,
                optionalErrorMessage: 'Select an option',
                options: [
                    { id: 'opt1', value: 'option1', label: 'Option 1' },
                    { id: 'opt2', value: 'option2', label: 'Option 2' },
                ],
                validationRules: [
                    { id: 'rule1', expression: 'data.optionField.value === "option1" || data.optionField.value === "option2"', errorMessage: 'Invalid option selected' } as ValidationRule,
                ]                
            };

            const handler = new OptionsComponentHandler();
            const errors = await handler.Validate(mockComponent, { optionField: '' });

            expect(errors).toContain('Select an option');
        });

        it('should not return an error if no option is selected and field is optional', async () => {
            const mockComponent: Component = {
                name: 'optionField',
                questionId: 'q1',
                labelIsPageTitle: false,
                optional: true,
                options: [
                    { id: 'opt1', value: 'option1', label: 'Option 1' },
                    { id: 'opt2', value: 'option2', label: 'Option 2' },
                ]
            };

            const handler = new OptionsComponentHandler();
            const errors = await handler.Validate(mockComponent, { optionField: '' });

            expect(errors).toEqual([]);
        });       

        it('should return an empty array if all validation rules pass', async () => {
            const mockComponent: Component = {
                name: 'optionField',
                questionId: 'q1',
                labelIsPageTitle: false,
                options: [
                    { id: 'opt1', value: 'validOption', label: 'Valid option' },
                    { id: 'opt2', value: 'option2', label: 'Option 2' },
                ],
                validationRules: [
                    { id: 'rule1', expression: 'data.optionField.value === "validOption"', errorMessage: 'Invalid option selected' } as ValidationRule,
                ],
            };

            const handler = new OptionsComponentHandler();
            const errors = await handler.Validate(mockComponent, { optionField: { id: 'opt1', value: 'validOption', label: 'Valid option' } });

            expect(errors).toEqual([]);
        });
    });

    describe('Convert', () => {
        it('should return the matching option from component options', () => {
            const mockComponent: Component = {
                name: 'optionField',
                questionId: 'q1',
                labelIsPageTitle: false,
                options: [
                    { id: 'opt1', value: 'option1', label: 'Option 1' },
                    { id: 'opt2', value: 'option2', label: 'Option 2' },
                ]
            };

            const handler = new OptionsComponentHandler();
            const result = handler.Convert(mockComponent, { optionField: 'option1' });

            expect(result).toEqual({ id: 'opt1', value: 'option1', label: 'Option 1' });
        });

        it('should return an empty string if no matching option is found and the field is optional', () => {
            const mockComponent: Component = {
                name: 'optionField',
                questionId: 'q1',
                labelIsPageTitle: false,
                optional: true,
                options: [
                    { id: 'opt1', value: 'option1', label: 'Option 1' },
                    { id: 'opt2', value: 'option2', label: 'Option 2' },
                ],
            };

            const handler = new OptionsComponentHandler();
            const result = handler.Convert(mockComponent, { optionField: 'option3' });

            expect(result).toEqual("");
        });

        it('should throw an error if no matching option is found and the field is not optional', () => {
            const mockComponent: Component = {
                name: 'optionField',
                questionId: 'q1',
                labelIsPageTitle: false,
                options: [
                    { id: 'opt1', value: 'option1', label: 'Option 1' },
                    { id: 'opt2', value: 'option2', label: 'Option 2' },
                ],
            };

            const handler = new OptionsComponentHandler();
            expect(() => handler.Convert(mockComponent, { optionField: 'option3' })).toThrow(`No matching option found or invalid option type for value: option3 in component: optionField`);
        });

        it('should throw an error if the component name is not provided', () => {
            const mockComponent: Component = {
                questionId: 'q1',
                labelIsPageTitle: false
            };
            const handler = new OptionsComponentHandler();
            expect(() => handler.Convert(mockComponent, {})).toThrow('Component name is required');
        });        
    });
});