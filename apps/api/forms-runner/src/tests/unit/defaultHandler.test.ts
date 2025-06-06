import { DefaultComponentHandler } from '@/utils/componentHandler/defaultHandler';
import { Component } from '@model/formTypes';

describe('DefaultComponentHandler', () => {
    describe('IsFor', () => {
        it('should return true for supported types', () => {
            expect(DefaultComponentHandler.IsFor('text')).toBe(true);
            expect(DefaultComponentHandler.IsFor('multilineText')).toBe(true);
            expect(DefaultComponentHandler.IsFor('fileupload')).toBe(true);
        });

        it('should return false for unsupported types', () => {
            expect(DefaultComponentHandler.IsFor('checkbox')).toBe(false);
            expect(DefaultComponentHandler.IsFor('radio')).toBe(false);
        });
    });

    describe('Validate', () => {
        
        it('should return an error if required field is empty', async () => {
            const mockComponent: Component = { name: 'testField', optional: false } as Component;
            const handler = new DefaultComponentHandler();

            const errors = await handler.Validate(mockComponent, {});

            expect(errors).toContain('An answer is required');
        });

        it('should not return an error if optional field is empty', async () => {
            const mockComponent: Component = { name: 'testField', optional: true } as Component;
            const handler = new DefaultComponentHandler();

            const errors = await handler.Validate(mockComponent, {});

            expect(errors).toEqual([]);
        });
        
        it('should ignore validation rules if optional field is empty', async () => {
            const mockComponent: Component = { name: 'testField', optional: true,
                validationRules: [
                    { expression: 'data.value > 10', errorMessage: 'Value must be greater than 10' }
                ] } as Component;
            const handler = new DefaultComponentHandler();

            const errors = await handler.Validate(mockComponent, {});

            expect(errors).toEqual([]);
        });

        it('should return validation errors for invalid data', async () => {
            const mockComponent: Component = {
                name: 'value',
                validationRules: [
                    { expression: 'data.value > 10', errorMessage: 'Value must be greater than 10' },
                    { expression: 'data.value < 20', errorMessage: 'Value must be less than 20' },
                ],
            } as Component;

            const handler = new DefaultComponentHandler();
            const errors = await handler.Validate(mockComponent, { value: 5 });

            expect(errors).toEqual(['Value must be greater than 10']);
        });

        it('should return an empty array if all validation rules pass', async () => {
            const mockComponent: Component = {
                name: 'value',
                validationRules: [
                    { expression: 'data.value > 10', errorMessage: 'Value must be greater than 10' },
                ],
            } as Component;

            const handler = new DefaultComponentHandler();
            const errors = await handler.Validate(mockComponent, { value: 15 });

            expect(errors).toEqual([]);
        });
    });

    describe('Convert', () => {
        it('should return the value from data for a named component', () => {
            const mockComponent: Component = { name: 'testField' } as Component;
            const handler = new DefaultComponentHandler();

            const result = handler.Convert(mockComponent, { testField: 'testValue' });

            expect(result).toBe('testValue');
        });
    });
});