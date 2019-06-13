import AppNavigation from '../Navigation/AppNavigation'

export const reducer = (state, action) => {
  const newState = AppNavigation.router.getStateForAction(action, state)

  if (action.type.startsWith('Navigation/')) {
    if (state.lastRouteName === action.routeName) {
      return state
    } else return { ...newState, lastRouteName: action.routeName }
  }

  return newState || state
}
