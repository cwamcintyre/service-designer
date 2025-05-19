import { PageHandler } from '@/app/utils/pageHandler/interfaces';
import { DefaultPageHandler } from '@/app/utils/pageHandler/defaultPageHandler';

export class PageHandlerFactory {
    static For(type: string): PageHandler {
        switch (type) {
            case 'default':
                return new DefaultPageHandler();
            default:
                throw new Error(`Unsupported PageHandler type: ${type}`);
        }
    }
}
