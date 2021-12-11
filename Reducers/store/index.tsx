import React, {Dispatch} from 'react';
import {mainReducer, StateType} from '../mainReducer';
import Map from '../../Models/MapModels/Map';
import User from '../../Models/UserModels/User';

const initialState: StateType = {
  cart: [],
  items: [],
  map: {} as Map,
  recipes: [],
  total: 0,
  user: {} as User,
  showLogin: false,
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
