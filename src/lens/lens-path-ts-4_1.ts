// https://www.typescriptlang.org/play?ts=4.1.0-dev.20200921#code/C4TwDgpgBA0hJQLxQM7AE4EsB2BzKAPlNgK4C2ARhOgNwBQdokUAShAI4mboQAmbAYwA8AFQB8SKCKgQAHsAjZeKKAHsKAKwgDgdKPqgB+KAG8oAbRhQcUANbxVAM1YcuPXqLEBdAFwvO3HyCQmwB7p6WXhIAvnoGfiL0jODQADKKKCIAhui4EMBCAApZwAAWEsjFZTLyisoWOI7UUAASEFm8XnH6xm0dNQpKKvYgTlAAFI3NAMqlWZAAlN0GPVCz89Byg-Vm5iPW2K3tnYZ+U+hQAGpZADYk0LErTwbGu-s2fSd+13cPy8-6PzYCAAN2o-3ixFB4JWfiqpQGdRU5nORw6ABooAA6HGo7KYG5dFa9Y6IoZ2BzOSbYJoXERLAFGKRknYWd6HT5eU5QdLYTI5PIFfE3GIQ56vNnwA5or48jLZXL5URZAmixmwqFg9BiqBA6HajXArVJJjQADi+UK6FUYB+91ELJU6i0OkxVptFWZWyRcr5CsFQnM7rAUSZIiD1pDuqgJCUEEcOD4JpSvpQ8KKJVKmPEknhjoaNOanOWxmk3vJvP5ioK5k5Yh1xgtwGDdogokxnwk5fqsd48cTvB1xKgTZbt3toTcQW0ng7xwkRF7-eBg-VkNHkdb7Zl9cZfiXCZXyzhmfzKMLF0+mJxWLxKsJJa9tQr8oFStrx2vOOFUQbqfTwqYhuNpbiIc4dGIXbPj2caHnwQ4vP+mbKgSQGWpu45tmBO6EDGsEDrua7RpWAH3mhzYYb826doRzz7vhR6GvqSRyGAqjoMAUACKofKcTcGR5sgRT5nAIDmFE4w3mAmZwgsSASCYyymqmWQUPxkiVv6SqFGI9ArMplagZ6JHIYU2a6QwKzcbxUD8XykgOt2KiVqp-FiOMzoJAsfiGZhnjyaYOo8MAJDoIc0llFi7gkAIEDjOMWQCAImIgphcmIApCH6MFoWHIlAiGFi5ipb8XhGMYB4DnpREAPQ1TIKA3DgwAALS8JgKCuRALXAvILVNcCUAAAKmigAhYGArUQI1zU1dgqgtaxTUCJgrVZNgIA6tEmLOlAWQqOtIALNV+jREkVk8WgUA8AIACSCgXEJhQifA4nZvmzraMAmKXO5EWlHCO2aAkKWYd83nMhlgWMpgVL-Vidm4NUEgAIxyYpRFcZdnH7Mg-3mAADGV+0UqMziJJZRE5WF0OYwYN7OuiWVPHVDUDa17WdWp3W9a1A3QCNKRjRNU0zdgwA1RQ60tcAKAtZguDzTwzMrKzI1ywrSsQCrBjmPjRO+Nd2j3dQ4zwzNsXjGjQMaIVezwF4oO-AsTOY2dW0yDcKDQBjVP5LltN09iOKMzr+h65mhNeIbJX3K7RHu4yjwGO7yx2SgWLe5xQlltBzkZF17mxxAPkZEZNteQkAU3Sb6Bm5mNtO-cx2U9l-s0+n9BnUAA

type Key = string | number;

type RequiredRec<T> = T extends object
    ? { [K in keyof Required<T>]: RequiredRec<Required<T>[K]> }
    : T;

type LensTarget<Path> = Path extends [infer Head]
    ? Head extends keyof (infer Shape)
        ? Shape extends { [key in Head]?: infer Value }
            ? { [key in Head]?: Value }
            : never
        : never
    : Path extends [infer Head, ...infer Tail]
    ? Head extends keyof (infer T)
        ? T extends { [key in Head]?: LensTarget<Tail> }
            ? { [key in Head]?: LensTarget<Tail> }
            : never
        : never
    : never;

type GetPropValue<T extends object, Prop> = T extends LensTarget<[Prop]> ? T[Prop] : undefined;

type LensPath<Path, T> = Path extends [infer Head]
    ? T extends LensTarget<[Head]>
        ? GetPropValue<T, Head> extends undefined
            ? GetPropValue<RequiredRec<T>, Head> | undefined
            : GetPropValue<T, Head>
        : undefined
    : Path extends [infer Head, ...infer Tail]
    ? T extends LensTarget<[Head, ...Tail]>
        ? LensPath<Tail, GetPropValue<T, Head>> extends undefined
            ? LensPath<Tail, GetPropValue<T, Head> | undefined>
            : LensPath<Tail, GetPropValue<T, Head>>
        : undefined
    : never;

export const lensPath = <P extends Key[]>(...path: P) => {
    type Lensable = LensTarget<P>;
    type LensValue<T> = LensPath<P, T>;

    const lens = <T extends Lensable>(obj: T): LensValue<T> => {
        return path.reduce((acc, value) => {
            return acc?.[value] ?? undefined;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }, obj as any);
    };

    const recIter = <P extends Key[], T extends object, V>(path: P, obj: T, value: V): T => {
        if (path.length > 1) {
            const key = path[0] as keyof T;

            return {
                ...obj,
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                [path[0]]: recIter(path.slice(1), obj?.[key], value),
            };
        } else {
            return {
                ...obj,
                [path[0]]: value,
            };
        }
    };

    lens.set = <T extends Lensable>(value: LensValue<T>, obj: T): T => recIter(path, obj, value);

    return lens;
};
