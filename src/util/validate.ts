import { Optional } from '../interfaces/Nullable';

type Validator<T> = (toValidate: Optional<T>) => boolean;

export default function <T, TCast = T>(
    toValidate: Optional<T>,
    validator: Validator<T>,
    defaultValue: TCast
): TCast {
    if (validator(toValidate)) {
        return toValidate as TCast;
    }

    return defaultValue;
}

const stringToNumberValidator = (
    extraCheck: (n: number) => boolean = _ => true
): Validator<string> => {
    return n => {
        if (typeof n !== 'string') return false;
        if (isNaN(Number(n))) return false;
        if (!extraCheck(Number(n))) return false;

        return true;
    };
};
stringToNumberValidator.positives = stringToNumberValidator(n => n > 0);
stringToNumberValidator.negatives = stringToNumberValidator(n => n < 0);
stringToNumberValidator.nonNegatives = stringToNumberValidator(n => n >= 0);
stringToNumberValidator.nonPositives = stringToNumberValidator(n => n <= 0);

function required(toValidate: Optional<string>, fieldName: string): string {
    if (typeof toValidate !== 'string' || !toValidate.trim().length)
        throw new Error(
            `Required environment variables ${fieldName} is missing or empty`
        );

    return toValidate;
}

export { stringToNumberValidator, required };
