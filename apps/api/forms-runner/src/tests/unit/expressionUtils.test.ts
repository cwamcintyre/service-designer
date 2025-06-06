import { evaluateExpression, meetsCondition } from '@/utils/expressionUtils';
import { Page } from '@model/formTypes';

describe('evaluateExpression', () => {
    it('should evaluate a valid expression with data', async () => {
        const expression = 'data.value > 10';
        const data = { value: 15 };

        const result = await evaluateExpression(expression, data);
        expect(result).toBe(true);
    });

    it('should evaluate a valid expression with multiple conditions', async () => {
        const expression = 'data.value > 10 && data.name === "test"';
        const data = { value: 15, name: 'test' };

        const result = await evaluateExpression(expression, data);
        expect(result).toBe(true);
    });

    it('should evaluate a valid expression with nested data', async () => {
        const expression = 'data.user.age > 18';
        const data = { user: { age: 20 } };

        const result = await evaluateExpression(expression, data);
        expect(result).toBe(true);
    });

    it('should evaluate a valid expression with array data', async () => {
        const expression = 'data.items.length > 2';
        const data = { items: [1, 2, 3] };

        const result = await evaluateExpression(expression, data);
        expect(result).toBe(true);
    });

    it('should evaluate a valid expression with string comparison', async () => {
        const expression = 'data.name === "example"';
        const data = { name: 'example' };

        const result = await evaluateExpression(expression, data);
        expect(result).toBe(true);
    });

    it('should evaluate a valid expression with numeric operations', async () => {
        const expression = '(data.value + 5) * 2 === 40';
        const data = { value: 15 };

        const result = await evaluateExpression(expression, data);
        expect(result).toBe(true);
    });

    it('should return default value for invalid expression', async () => {
        const expression = 'data.invalidField';
        const data = { value: 15 };

        const result = await evaluateExpression(expression, data, false);
        expect(result).toBe(false);
    });

    it('should throw an error for unsafe keywords', async () => {
        const expression = 'process.exit(1)';
        const data = {};

        await expect(evaluateExpression(expression, data)).rejects.toThrow('Unsafe keywords detected in expression');
    });

    it('should throw an error for accessing global objects', async () => {
        const expression = 'global.process.exit(1)';
        const data = {};

        await expect(evaluateExpression(expression, data)).rejects.toThrow('Unsafe keywords detected in expression');
    });

    it('should throw an error for using eval', async () => {
        const expression = 'eval("2 + 2")';
        const data = {};

        await expect(evaluateExpression(expression, data)).rejects.toThrow('Unsafe keywords detected in expression');
    });

    it('should throw an error for accessing constructor properties', async () => {
        const expression = 'data.constructor.constructor("return process")()';
        const data = {};

        await expect(evaluateExpression(expression, data)).rejects.toThrow('Unsafe keywords detected in expression');
    });

    it('should throw an error for accessing Function constructor', async () => {
        const expression = 'Function("return global")()';
        const data = {};

        await expect(evaluateExpression(expression, data)).rejects.toThrow('Unsafe keywords detected in expression');
    });

    it('should throw an error for accessing prototype chain', async () => {
        const expression = 'data.__proto__.constructor("return process")()';
        const data = {};

        await expect(evaluateExpression(expression, data)).rejects.toThrow('Unsafe keywords detected in expression');
    });
});

describe('meetsCondition', () => {
    it('should return true and nextPageId if a condition is met', async () => {
        const page: Page = {
            conditions: [
                { expression: 'data.value > 10', nextPageId: 'nextPage' },
            ],
        } as Page;

        const data = { value: 15 };
        const result = await meetsCondition(page, data);

        expect(result).toEqual({ metCondition: true, nextPageId: 'nextPage' });
    });

    it('should return false and undefined if no conditions are met', async () => {
        const page: Page = {
            conditions: [
                { expression: 'data.value < 10', nextPageId: 'nextPage' },
            ],
        } as Page;

        const data = { value: 15 };
        const result = await meetsCondition(page, data);

        expect(result).toEqual({ metCondition: false, nextPageId: undefined });
    });

    it('should return false and empty nextPageId if page has no conditions', async () => {
        const page: Page = {} as Page;
        const data = { value: 15 };

        const result = await meetsCondition(page, data);
        expect(result).toEqual({ metCondition: false, nextPageId: '' });
    });
});