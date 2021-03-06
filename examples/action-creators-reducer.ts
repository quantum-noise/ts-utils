import { actionCreator, composeActionHandlers, handleAction } from '../src/action-creators';

const setLoading = actionCreator<boolean>('SET_IS_LOADING');
const setUserData = actionCreator<{ name: string }>('SET_USER_DATA');

interface Store {
    user: { name: string };
    isLoading: boolean;
}

const initialState: Store = {
    user: {
        name: '',
    },
    isLoading: false,
};

export const reducer = composeActionHandlers<Store>(
    handleAction(setLoading, (store, payload) => ({
        ...store,
        isLoading: payload,
    })),
    handleAction(setUserData, (store, user) => ({
        ...store,
        user,
    })),
)(initialState);
