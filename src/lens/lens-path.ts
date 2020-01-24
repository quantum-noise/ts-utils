type UnboxAtLevel<T, L> = T extends object
    ? L extends 1
        ? { [K in keyof Required<T>]: Required<T>[K] }
        : L extends 2
        ? { [K in keyof Required<T>]: UnboxAtLevel<Required<T>[K], 1> }
        : L extends 3
        ? { [K in keyof Required<T>]: UnboxAtLevel<Required<T>[K], 2> }
        : L extends 4
        ? { [K in keyof Required<T>]: UnboxAtLevel<Required<T>[K], 3> }
        : L extends 5
        ? { [K in keyof Required<T>]: UnboxAtLevel<Required<T>[K], 4> }
        : L extends 6
        ? { [K in keyof Required<T>]: UnboxAtLevel<Required<T>[K], 5> }
        : L extends 7
        ? { [K in keyof Required<T>]: UnboxAtLevel<Required<T>[K], 6> }
        : never
    : never;

type Key = string | number;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LensPath1<T extends object, U1> = T extends LensTarget1<U1> ? T[U1] : undefined;

type LensPath2<T extends object, U1, U2> = U2 extends keyof LensPath1<T, U1>
    ? LensPath1<T, U1>[U2]
    : undefined;

type LensPath3<T extends object, U1, U2, U3> = U3 extends keyof LensPath2<T, U1, U2>
    ? LensPath2<T, U1, U2>[U3]
    : undefined;

type LensPath4<T extends object, U1, U2, U3, U4> = U4 extends keyof LensPath3<T, U1, U2, U3>
    ? LensPath3<T, U1, U2, U3>[U4]
    : undefined;

type LensPath5<T extends object, U1, U2, U3, U4, U5> = U5 extends keyof LensPath4<T, U1, U2, U3, U4>
    ? LensPath4<T, U1, U2, U3, U4>[U5]
    : undefined;

type LensPath6<T extends object, U1, U2, U3, U4, U5, U6> = U6 extends keyof LensPath5<
    T,
    U1,
    U2,
    U3,
    U4,
    U5
>
    ? LensPath5<T, U1, U2, U3, U4, U5>[U6]
    : undefined;

type LensPath7<T extends object, U1, U2, U3, U4, U5, U6, U7> = U7 extends keyof LensPath6<
    T,
    U1,
    U2,
    U3,
    U4,
    U5,
    U6
>
    ? LensPath6<T, U1, U2, U3, U4, U5, U6>[U7]
    : undefined;

type LensTarget1<U> = U extends keyof (infer T)
    ? T extends { [key in U]?: infer V }
        ? { [key in U]?: V }
        : never
    : never;

type LensTarget<P> = P extends [infer U]
    ? LensTarget1<U>
    : P extends [infer U1, infer U2]
    ? U1 extends keyof (infer T)
        ? T extends { [key in U1]?: LensTarget<[U2]> }
            ? { [key in U1]?: LensTarget<[U2]> }
            : never
        : never
    : P extends [infer U1, infer U2, infer U3]
    ? U1 extends keyof (infer T)
        ? T extends { [key in U1]?: LensTarget<[U2, U3]> }
            ? { [key in U1]?: LensTarget<[U2, U3]> }
            : never
        : never
    : P extends [infer U1, infer U2, infer U3, infer U4]
    ? U1 extends keyof (infer T)
        ? T extends { [key in U1]?: LensTarget<[U2, U3, U4]> }
            ? { [key in U1]?: LensTarget<[U2, U3, U4]> }
            : never
        : never
    : P extends [infer U1, infer U2, infer U3, infer U4, infer U5]
    ? U1 extends keyof (infer T)
        ? T extends { [key in U1]?: LensTarget<[U2, U3, U4, U5]> }
            ? { [key in U1]?: LensTarget<[U2, U3, U4, U5]> }
            : never
        : never
    : P extends [infer U1, infer U2, infer U3, infer U4, infer U5, infer U6]
    ? U1 extends keyof (infer T)
        ? T extends { [key in U1]?: LensTarget<[U2, U3, U4, U5, U6]> }
            ? { [key in U1]?: LensTarget<[U2, U3, U4, U5, U6]> }
            : never
        : never
    : P extends [infer U1, infer U2, infer U3, infer U4, infer U5, infer U6, infer U7]
    ? U1 extends keyof (infer T)
        ? T extends { [key in U1]?: LensTarget<[U2, U3, U4, U5, U6, U7]> }
            ? { [key in U1]?: LensTarget<[U2, U3, U4, U5, U6, U7]> }
            : never
        : never
    : never;

type LensPath<P, T> = P extends [infer U1]
    ? T extends LensTarget<[U1]>
        ? LensPath1<T, U1> extends undefined
            ? LensPath1<UnboxAtLevel<T, 1>, U1> | undefined
            : LensPath1<T, U1>
        : never
    : P extends [infer U1, infer U2]
    ? T extends LensTarget<[U1, U2]>
        ? LensPath2<T, U1, U2> extends undefined
            ? LensPath2<UnboxAtLevel<T, 2>, U1, U2> | undefined
            : LensPath2<T, U1, U2>
        : never
    : P extends [infer U1, infer U2, infer U3]
    ? T extends LensTarget<[U1, U2, U3]>
        ? LensPath3<T, U1, U2, U3> extends undefined
            ? LensPath3<UnboxAtLevel<T, 3>, U1, U2, U3> | undefined
            : LensPath3<T, U1, U2, U3>
        : never
    : P extends [infer U1, infer U2, infer U3, infer U4]
    ? T extends LensTarget<[U1, U2, U3, U4]>
        ? LensPath4<T, U1, U2, U3, U4> extends undefined
            ? LensPath4<UnboxAtLevel<T, 4>, U1, U2, U3, U4> | undefined
            : LensPath4<T, U1, U2, U3, U4>
        : never
    : P extends [infer U1, infer U2, infer U3, infer U4, infer U5]
    ? T extends LensTarget<[U1, U2, U3, U4, U5]>
        ? LensPath5<T, U1, U2, U3, U4, U5> extends undefined
            ? LensPath5<UnboxAtLevel<T, 5>, U1, U2, U3, U4, U5> | undefined
            : LensPath5<T, U1, U2, U3, U4, U5>
        : never
    : P extends [infer U1, infer U2, infer U3, infer U4, infer U5, infer U6]
    ? T extends LensTarget<[U1, U2, U3, U4, U5, U6]>
        ? LensPath6<T, U1, U2, U3, U4, U5, U6> extends undefined
            ? LensPath6<UnboxAtLevel<T, 6>, U1, U2, U3, U4, U5, U6> | undefined
            : LensPath6<T, U1, U2, U3, U4, U5, U6>
        : never
    : P extends [infer U1, infer U2, infer U3, infer U4, infer U5, infer U6, infer U7]
    ? T extends LensTarget<[U1, U2, U3, U4, U5, U6, U7]>
        ? LensPath7<T, U1, U2, U3, U4, U5, U6, U7> extends undefined
            ? LensPath7<UnboxAtLevel<T, 7>, U1, U2, U3, U4, U5, U6, U7> | undefined
            : LensPath7<T, U1, U2, U3, U4, U5, U6, U7>
        : never
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
