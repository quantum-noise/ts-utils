import { ActionHandler } from './handle-action';
import { Action } from './action-creator';

export const composeActionHandlers = <S extends object>(
    ...handlers: ActionHandler<S, unknown>[]
) => (initialStore: S) => (store: S = initialStore, action: Action<unknown>) =>
    handlers.reduce((store, handler) => handler(store, action), store);
