import { ComponentHandler } from '@/utils/componentHandler/interfaces';
import { DefaultComponentHandler } from '@/utils/componentHandler/defaultHandler';

export class ComponentHandlerFactory {
    static For(type: string): ComponentHandler | undefined {
        if (DefaultComponentHandler.IsFor(type)) {
            return new DefaultComponentHandler();
        }
        return undefined;
    }
}
