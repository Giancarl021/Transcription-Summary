import { Optional } from '../interfaces/Nullable';

type Validator<T> = (toValidate: Optional<T>) => boolean;

export default function <T>(
    toValidate: Optional<T>,
    validator: Validator<T>,
    defaultValue: T
): T {
    if (validator(toValidate)) {
        return toValidate as T;
    }

    return defaultValue;
}

export function stringToNumberValidator(
    extraCheck: (n: number) => boolean = _ => true
): Validator<string> {
    return n => {
        if (typeof n !== 'string') return false;
        if (isNaN(Number(n))) return false;
        if (!extraCheck(Number(n))) return false;

        return true;
    };
}
