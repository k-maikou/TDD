import React from 'react';
import { AppContext } from './App';

const withContext = (Component) => {
  return ( props, actions ) => (
    <AppContext.Consumer>
      {({ state }) => {
        return <Component {...props} data={state} action={actions} />
      }}
    </AppContext.Consumer>
  )
}

export default withContext;
