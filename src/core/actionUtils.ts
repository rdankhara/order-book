export const createActionGroup = (group: string) => (type: string) => `${group}/${type}`;

export const createEmptyAction = (type: string) => () => ({type});

export const createAction = <T>(type: string) => (payload: T) => ({type, payload});

export interface EmptyAction {
    type: string;
}

export interface PayloadAction<T> extends EmptyAction{
    payload: T
}