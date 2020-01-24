import { ActionCreator, Action } from './action-creator';

type StoreUpdater<S extends object, P> = (store: S, payload: P) => S;

export type ActionHandler<S extends object, P> = (store: S, action: Action<P>) => S;

export const handleAction = <S extends object, P>(
    actionCreator: ActionCreator<P>,
    updater: StoreUpdater<S, P>,
): ActionHandler<S, P> => (store: S, action: Action<P>) => {
    if (actionCreator.type === action.type) {
        return updater(store, action.payload);
    }
    return store;
};
