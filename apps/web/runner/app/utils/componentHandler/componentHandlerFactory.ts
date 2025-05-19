import { ComponentHandler } from '@/app/utils/componentHandler/interfaces';
import { DefaultComponentHandler } from '@/app/utils/componentHandler/defaultHandler';

export class ComponentHandlerFactory {
    static For(type: string): ComponentHandler | undefined {
        if (DefaultComponentHandler.IsFor(type)) {
            return new DefaultComponentHandler();
        }
        return undefined;
    }
}
