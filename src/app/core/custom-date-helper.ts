import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

export class CustomDateHelper {
  static dateFormat(date: Date, format: string) {
    const separator = format.match(new RegExp(/[^a-zA-Z]+/))[0] || '';
    const index = format.split(separator);

    const dateFormats: {[format: string]: string | number} = {
      dd: CustomDateHelper.padDigits(date.getDate()),
      mm: CustomDateHelper.padDigits(date.getMonth() + 1),
      yyyy: date.getFullYear(),
    };

    const segOne = dateFormats[index[0]] ? `${dateFormats[index[0]]}` : '';
    const segTwo = dateFormats[index[1]] ? `${separator}${dateFormats[index[1]]}` : '';
    const segThree = dateFormats[index[2]] ? `${separator}${dateFormats[index[2]]}` : '';

    return `${segOne}${segTwo}${segThree}`;
  }

  static padDigits(n: number) {
    return n > 9 ? n : `0${n}`;
  }
}

export const dayMonthYearMask = {
  placeholderChar: '\u2000',
  mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /[1-2]/, /\d/, /\d/, /\d/],
  pipe: createAutoCorrectedDatePipe('dd mm yyyy'),
  keepCharPositions: true,
};

export type DateFormat =
  'dd-mm-yyyy'
  | 'mm-dd-yyyy'
  | 'yyyy-mm-dd'
  | 'dd/mm/yyyy'
  | 'mm/dd/yyyy'
  | 'yyyy/mm/dd';

// tslint:disable:next-line max-line-length
export const dayMonthYearRegex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
