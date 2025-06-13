import { PageTypes } from '@model/formTypes';
import { PageHandler } from '@/utils/pageHandler/interfaces';
import { DefaultPageHandler } from '@/utils/pageHandler/defaultPageHandler';
import { MoJAddAnotherHandler } from '@/utils/pageHandler/mojAddAnotherHandler';

export class PageHandlerFactory {
    static For(type: string): PageHandler {
        switch (type) {
            case PageTypes.Default:
                return new DefaultPageHandler();
            case PageTypes.MoJAddAnother:
                return new MoJAddAnotherHandler();
            default:
                throw new Error(`Unsupported PageHandler type: ${type}`);
        }
    }
}
