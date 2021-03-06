import { registerDecorator, ValidationOptions } from 'class-validator';
import * as moment from 'moment';

const allowedDateFormats = ['DD-MMM-YYYY', 'DD/MMM/YYYY', 'DD.MMM.YYYY'];

export function IsValidDateFormat(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'IsValidDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return moment(value, allowedDateFormats, true).isValid();
        },
      },
    });
  };
}
