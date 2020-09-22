// https://www.typescriptlang.org/play?ts=4.1.0-dev.20200921#code/C4TwDgpgBA0hJQLxQM7AE4EsB2BzKAPlNgK4C2ARhOgNwBQdokUAShAI4mboQAmbAYwA8AFQB8SKCKgQAHsAjZeKKAHsKAKwgDgdKPqgB+KAG8oAbRhQcUANbxVAM1YcuPXqLEBdAFwvO3HyCQmwB7p6WXhIAvnoGfiL0jODQADKKKCIAhui4EMBCAApZwAAWEsjFZTLyisoWOI7UUAASEFm8XnH6xm0dNQpKKvYgTlAAFI3NAMqlWZAAlN0GPVCz89Byg-Vm5iPW2K3tnYZ+U+hQAGpZADYk0LErTwbGu-s2fSd+13cPy8-6PzYCAAN2o-3ixFB4JWfiqpQGdRU5nORw6ABooAA6HGTbBNC7ZTA3BZdFa9Y6IoZ2BzOPEEqRLAFGKRUnYWd6HT5eU5QdLYTI5PIFIk3GIQ56vDnwA5or58jLZXL5URZYni5mwqFg9ASqBA6G6rXAnVJJjQADi+UK6FUYB+91EbJU6i0OkxNrtFVZWyRCoFSuFQnMnrAURZIhDtrD+qgJCUEEcOD4ZpS-pQ8KKJVKmPEknhzoa+Oa3OWxmkvup-MFyoK5m5Yj1xitwFDDogokxnwklfq8d4ieTvD15KgLbbt0doTcQW0ni7xwkRH7g+Bw81kPH0fbnbljeZfhXSbXyzh2cLKOLF0+mJxWPpzVFpLLPtqVcVQpV9eOt5xoqiTbppmoqYludo7iIC4dGIPZvn2CbHnwI4vEB2aqsSoHWtuk4dpBe6EHGCFDvuG6xtWwFqjcmGtthvy7t2JHPIeREnsahpJHIYCqOgwBQAIqgCrxNwZAWyBFIWcAgOYUTjHeYDZnCCxIBIJjLOa6ZZBQwmSNWgYqoUYj0Cs6nVhB3rkWhhS5oZDArPxglQMJAqSE6vYqNWmnCWI4yugkCx+KZOGeMpph6jwwAkOghzyWUWLuCQAgQOM4xZAIAiYiCOFKYgKnIfo4WRYcqUCIYWLmJlvxeEYxhHkORmkQA9A1MgoDcODAAAtLwmAoJ5EAdcC8gdW1wJQAAAuaKACFgYCdRArXtQ12CqB1nFtQImCdVk2AgHq0SYq6UBZCo20gAs9X6NESR2QJaBQDwAgAJIKBcYmFBJ8DSbmhautowCYpc3kxaUcIHZoCQZTh3z+ayOWhcymB0sDWJObg1QSAAjEpqmkXxt28fsyDA+YAAMVXHTSozOIktmkQVUXw7jBh3q66J5U8TUtSNnXdb1Wn9YNnUjdAE0pFNM1zQt2DAA1FDbR1wAoB1mC4MtPDsysnMTUrKtqxAGsGOYxNk7493aM91DjMjC2JeMWNgxopV7PAXiQ78Cxs7jV17TINwoNAON0-khWM0z2I4qzBv6Eb2ak14psVfcnukd7zKPAY3vLE5KBYv7vFiRWcHuRkfXeYnEABRkZkO35CQhQ9FvoFb2YO279znbT+XBwz2f0N7QA

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
    : Path extends [infer Head, ...(infer Tail)]
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
    : Path extends [infer Head, ...(infer Tail)]
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
