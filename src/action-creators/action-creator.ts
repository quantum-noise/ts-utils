export interface Action<P> {
    type: string;
    payload: P;
}

export interface ActionCreator<P> {
    (payload: P): Action<P>;
    type: string;
}

export const actionCreator = <T>(type: string) => {
    const ac: ActionCreator<T> = (payload: T) => ({ type, payload });
    ac.type = type;
    return ac;
};
