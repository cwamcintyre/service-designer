import { ComponentHandler } from '@/utils/componentHandler/interfaces';
import { DefaultComponentHandler } from '@/utils/componentHandler/defaultHandler';
import { UKAddressComponentHandler } from './ukAddressHandler';
import { PhoneNumberComponentHandler } from './phoneNumberHandler';
import { EmailComponentHandler } from './emailHandler';

export class ComponentHandlerFactory {
    static For(type: string): ComponentHandler | undefined {
        if (DefaultComponentHandler.IsFor(type)) {
            return new DefaultComponentHandler();
        }
        if (UKAddressComponentHandler.IsFor(type)) {
            return new UKAddressComponentHandler();
        }
        if (PhoneNumberComponentHandler.IsFor(type)) {
            return new PhoneNumberComponentHandler();
        }
        if (EmailComponentHandler.IsFor(type)) {
            return new EmailComponentHandler();
        }        
        return undefined;
    }
}
