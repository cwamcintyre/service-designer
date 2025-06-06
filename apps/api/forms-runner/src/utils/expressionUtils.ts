import { Page } from "@model/formTypes";
import ivm from 'isolated-vm';

export async function evaluateExpression(
    expression: string,
    data: { [key: string]: any },
    defaultValue: any = null
): Promise<any> {
    const unsafeKeywords = /\b(eval|require|process|global|window|import|function|prototype|module)\b/;
    if (unsafeKeywords.test(expression)) {
        throw new Error('Unsafe keywords detected in expression');
    }

    const isolate = new ivm.Isolate();
    const context = await isolate.createContext();
    const jail = context.global;

    await jail.set('data', new ivm.ExternalCopy(data).copyInto());        
    await jail.set('result', undefined);

    const script = `
        const func = new Function("data", \`return ${expression}\`);
        result = func(data);
    `;

    await context.eval(script, { timeout: 1000 });
    const result = await jail.get('result');

    isolate.dispose();
    
    return result || defaultValue;
}

export async function meetsCondition(page: Page, data: { [key: string]: any }): Promise<{ metCondition: boolean; nextPageId: string | undefined}> {

    if (!page.conditions) {
        return { metCondition: false, nextPageId: '' };
    }

    for (const condition of page.conditions) {
        const { expression, nextPageId } = condition;
        const evaluatedValue = await evaluateExpression(expression, data);
        console.log(`Evaluating condition: ${expression} with data:`, data, `Result:`, evaluatedValue);
        if (evaluatedValue) {
            return { metCondition: true, nextPageId };
        }
    }
    return { metCondition: false, nextPageId: undefined };
}