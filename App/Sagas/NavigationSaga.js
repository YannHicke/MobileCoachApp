import { put, takeEvery } from 'redux-saga/effects';
import { NavigationActions, StackActions } from 'react-navigation';
// import GUIRedux, {GUIActions} from '../Redux/GUIRedux'

// import processRoute from '../Redux/navigation/routing'

export function* navigationWatcherSaga(action) {
  yield takeEvery('NAVIGATE', navigate);
  yield takeEvery('BACK', back);
  // yield takeEvery('RESET', reset)
  yield takeEvery('REPLACE', replace);
}

export function* navigate(action) {
  const { routeName, params, route } = action;

  const result = yield process({ routeName, params, route });

  yield put(NavigationActions.navigate(createRoute(result, 'navigate')));
}

export function* back() {
  yield put(NavigationActions.back());
}

export function* reset(action) {
  // const {
  //   payload: { routeName, params, route }
  // } = action
  // const updatedRouteInfo = yield call(processRoute({ routeName, params, route }))
  // yield put(
  //   StackActions.reset({
  //     index: 0,
  //     key: null,
  //     actions: [
  //       NavigationActions.navigate(createRoute(updatedRouteInfo, 'replace'))
  //     ]
  //   })
  // )
}

export function* replace(action) {
  // const {
  //   payload: { routeName, params, route }
  // } = action
  // const updatedRouteInfo = yield call(processRoute({ routeName, params, route }))
  // yield put(StackActions.replace(createRoute(updatedRouteInfo, 'replace')))
}

function* iterateRoutes(routes) {
  const { stack } = routes;
  if (routes.routeName) {
    stack.push({
      routeName: routes.routeName,
      params: routes.params,
    });
  }

  if (routes.hasOwnProperty('route') && typeof routes.route === 'object') {
    iterateRoutes(routes.route);
  }
}

export function* process({ routeName, params, route }) {
  const stack = [];
  const resultStack = [];

  yield iterateRoutes({ routeName, stack, params, route });

  for (let i = 0; i < stack.length; i++) {
    // const { routeName, params } = stack[i]

    // if (routesProcessors[routeName]) {
    //     return Promise.resolve(
    //       dispatch(routesProcessors[routeName](routeName, params))
    //     ).then(updatedRouteInfo => {
    //       resultStack.push(updatedRouteInfo)

    //       return resultStack || stack
    //     })
    //   } else {
    //     resultStack.push(stack[i])
    //   }
    resultStack.push(stack[i]);
  }

  // return Promise.resolve(resultStack)
  return resultStack;
}

// const routesProcessors = {

// }

function createRoute(routeInfo, action) {
  let routes = null;

  routeInfo.forEach((item) => {
    const { routeName, params } = item;

    if (routes) {
      switch (action) {
        case 'navigate':
          routes.action = NavigationActions.navigate({
            routeName,
            params,
          });
          break;

        case 'replace':
          routes.action = StackActions.replace({ routeName, params });
          break;
      }
    } else {
      routes = {
        routeName,
        params,
      };
    }
  });

  return routes;
}
