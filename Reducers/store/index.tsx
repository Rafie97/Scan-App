import React, {Dispatch} from 'react';
import {mainReducer, StateType} from '../mainReducer';

const initialState: StateType = {
  cart: [],
  items: [],
  recipes: [],
  total: 0,
  user: '',
};

export const StateContext = React.createContext<StateType>(initialState);
export const DispatchContext = React.createContext<Dispatch<any>>(() => {});

export const useStore = () => React.useContext(StateContext);
export const useDispatch = () => React.useContext(DispatchContext);

export default function StoreProvider({children}) {
  const [state, dispatch] = React.useReducer(mainReducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
