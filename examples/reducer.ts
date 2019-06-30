import { actionCreator, composeActionHandlers, handleAction } from '../src';

const setLoading = actionCreator<boolean>('SET_IS_LOADING');
const setUserData = actionCreator<{ name: string }>('SET_USER_DATA');

interface Domain {
    user: { name: string };
    isLoading: boolean;
}

const initialState: Domain = {
    user: {
        name: '',
    },
    isLoading: false,
};

export const reducer = composeActionHandlers<Domain>(
    handleAction(setLoading, (store, payload) => ({
        ...store,
        isLoading: payload,
    })),
    handleAction(setUserData, (store, user) => ({
        ...store,
        user,
    })),
)(initialState);
