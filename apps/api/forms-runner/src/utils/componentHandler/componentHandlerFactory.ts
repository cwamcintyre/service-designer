/* istanbul ignore file */

/* the functionality for the component handler files is covered by their respective unit tests. A test here is only checking that the
   factory is calling all the handlers which does not feel necessary */

import { ComponentHandler } from '@/utils/componentHandler/interfaces';
import { DefaultComponentHandler } from '@/utils/componentHandler/defaultHandler';
import { UKAddressComponentHandler } from '@/utils/componentHandler/ukAddressHandler';
import { PhoneNumberComponentHandler } from '@/utils/componentHandler/phoneNumberHandler';
import { EmailComponentHandler } from '@/utils/componentHandler/emailHandler';
import { NumberComponentHandler } from '@/utils/componentHandler/numberHandler';
import { OptionsComponentHandler } from '@/utils/componentHandler/optionsHandler';
import { YesNoComponentHandler } from '@/utils/componentHandler/yesNoHandler';
import { DatePartsComponentHandler } from '@/utils/componentHandler/datePartsHandler';

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
        if (NumberComponentHandler.IsFor(type)) {
            return new NumberComponentHandler();
        }
        if (OptionsComponentHandler.IsFor(type)) {
            return new OptionsComponentHandler();
        }
        if (YesNoComponentHandler.IsFor(type)) {
            return new YesNoComponentHandler();
        }
        if (DatePartsComponentHandler.IsFor(type)) {
            return new DatePartsComponentHandler();
        }
        return undefined;
    }
}
