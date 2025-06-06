import { NumberComponentHandler } from '@/utils/componentHandler/numberHandler';
import { Component, ValidationRule } from '@model/formTypes';

describe('NumberComponentHandler', () => {
    describe('IsFor', () => {
        it('should return true for number type', () => {
            expect(NumberComponentHandler.IsFor('number')).toBe(true);
        });

        it('should return false for non-number types', () => {
            expect(NumberComponentHandler.IsFor('text')).toBe(false);
            expect(NumberComponentHandler.IsFor('email')).toBe(false);
        });
    });

    describe('Validate', () => {
        it('should return an error for each invalid number format', async () => {
            const mockComponent: Component = { name: 'numberField', questionId: 'q1', labelIsPageTitle: false };

            const handler = new NumberComponentHandler();

            const invalidNumbers = [
                { value: 'abc', error: 'Enter a number' },
                { value: '123abc', error: 'Enter a number' },
                { value: '12.34.56', error: 'Enter a number' },
                { value: '', error: 'Enter a number' },
                { value: null, error: 'Enter a number' },
                { value: undefined, error: 'Enter a number' }
            ];

            for (const { value, error } of invalidNumbers) {
                const errors = await handler.Validate(mockComponent, { numberField: value });
                expect(errors).toContain(error);
            }
        });

        it('should not return an error if number is empty and field is optional', async () => {
            const mockComponent: Component = { name: 'numberField', questionId: 'q1', labelIsPageTitle: false, optional: true };

            const handler = new NumberComponentHandler();

            const invalidNumbers = [
                { value: '', error: 'Enter a number' },
                { value: null, error: 'Enter a number' },
                { value: undefined, error: 'Enter a number' },
            ];

            for (const { value, error } of invalidNumbers) {
                const errors = await handler.Validate(mockComponent, { numberField: value });
                expect(errors).not.toContain(error);
            }
        });

        it('should ignore validation rules if number is empty and field is optional', async () => {
            const mockComponent: Component = { name: 'numberField', questionId: 'q1', labelIsPageTitle: false, optional: true,
                validationRules: [
                    { id: 'rule1', expression: 'data.numberField > 10', errorMessage: 'Number must be greater than 10' } as ValidationRule,
                ] };

            const handler = new NumberComponentHandler();

            const invalidNumbers = [
                { value: '', error: 'Enter a number' },
                { value: null, error: 'Enter a number' },
                { value: undefined, error: 'Enter a number' },
            ];

            for (const { value, error } of invalidNumbers) {
                const errors = await handler.Validate(mockComponent, { numberField: value });
                expect(errors).not.toContain(error);
            }
        });

        it('should return validation errors for invalid data', async () => {
            const mockComponent: Component = {
                name: 'numberField',
                questionId: 'q1',
                labelIsPageTitle: false,
                validationRules: [
                    { id: 'rule1', expression: 'data.numberField > 10', errorMessage: 'Number must be greater than 10' } as ValidationRule,
                ],
            };

            const handler = new NumberComponentHandler();
            const errors = await handler.Validate(mockComponent, { numberField: 5 });

            expect(errors).toContain('Number must be greater than 10');
        });

        it('should return an empty array if all validation rules pass', async () => {
            const mockComponent: Component = {
                name: 'numberField',
                questionId: 'q1',
                labelIsPageTitle: false,
                validationRules: [
                    { id: 'rule1', expression: 'data.numberField > 10', errorMessage: 'Number must be greater than 10' } as ValidationRule,
                ],
            };

            const handler = new NumberComponentHandler();
            const errors = await handler.Validate(mockComponent, { numberField: 15 });

            expect(errors).toEqual([]);
        });
    });

    describe('Convert', () => {
        it('should return the value from data for a named component', () => {
            const mockComponent: Component = { name: 'numberField', questionId: 'q1', labelIsPageTitle: false };
            const handler = new NumberComponentHandler();

            const result = handler.Convert(mockComponent, { numberField: '123' });

            expect(result).toBe('123');
        });
    });
});