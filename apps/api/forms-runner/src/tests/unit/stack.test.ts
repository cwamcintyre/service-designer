import { Stack } from '@/utils/applicationUtils';

describe('Stack', () => {
    let stack: Stack;

    beforeEach(() => {
        stack = new Stack();
    });

    describe('push', () => {
        it('should add an element to the stack', () => {
            stack.push(1);
            expect(stack.size()).toBe(1);
            expect(stack.peek()).toBe(1);
        });
    });

    describe('pop', () => {
        it('should remove and return the top element of the stack', () => {
            stack.push(1);
            stack.push(2);
            const popped = stack.pop();
            expect(popped).toBe(2);
            expect(stack.size()).toBe(1);
        });

        it('should throw an error if the stack is empty', () => {
            expect(() => stack.pop()).toThrowError('Stack is empty');
        });
    });

    describe('peek', () => {
        it('should return the top element of the stack without removing it', () => {
            stack.push(1);
            stack.push(2);
            const top = stack.peek();
            expect(top).toBe(2);
            expect(stack.size()).toBe(2);
        });

        it('should throw an error if the stack is empty', () => {
            expect(() => stack.peek()).toThrow('Stack is empty');
        });
    });

    describe('isEmpty', () => {
        it('should return true if the stack is empty', () => {
            expect(stack.isEmpty()).toBe(true);
        });

        it('should return false if the stack is not empty', () => {
            stack.push(1);
            expect(stack.isEmpty()).toBe(false);
        });
    });

    describe('size', () => {
        it('should return the size of the stack', () => {
            expect(stack.size()).toBe(0);
            stack.push(1);
            stack.push(2);
            expect(stack.size()).toBe(2);
        });
    });

    describe('clear', () => {
        it('should clear the stack', () => {
            stack.push(1);
            stack.push(2);
            stack.clear();
            expect(stack.size()).toBe(0);
            expect(stack.isEmpty()).toBe(true);
        });
    });
});