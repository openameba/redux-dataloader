# Redux Data Loader

[![Build Status](https://travis-ci.org/kouhin/redux-dataloader.svg?branch=master)](https://travis-ci.org/kouhin/redux-dataloader)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm](https://img.shields.io/npm/v/redux-dataloader.svg)](https://npmjs.org/package/redux-dataloader)

Loads async data for Redux apps focusing on preventing duplicated requests and dealing with async dependencies.

Deeply inspired by [alt Data Souces API](http://alt.js.org/docs/async), also inspired by [redux-saga](https://github.com/yelouafi/redux-saga).

Instead of using redux-thunk, it handles wrapped actions and sideload async data from local or remote data sources.
It also caches data requests for a while in order to prevent duplicated requests.

## TODOs

- [ ] complete test
- [ ] add real-world example with redux, redux-router, async data loading, async dependencies

## Installation

```
npm install redux-dataloader --save
```

## Usage

### 1. Define actions and update the request action with load()

#### `userActions.js`
```javascript
import { load } from 'redux-dataloader'

export const FETCH_USER_REQUEST = 'myapp/user/FETCH_USER/REQUEST'
export const FETCH_USER_SUCCESS = 'myapp/user/FETCH_USER/SUCCESS'
export const FETCH_USER_FAILURE = 'myapp/user/FETCH_USER/SUCCESS'

export function fetchUserRequest (userId) {
  // use `load` to wrap a request action, load() returns a Promise
  return load({
    type: FETCH_USER_REQUEST,
    payload: {
      userId,
    }
  })
}

export function fetchUserSuccess (userId, data) {
  // ...
}

export function fetchUserFailure (userId, error) {
  // ...
}

```

### 2. Create a data loader

#### `dataloaders.js`

```javascript
import { createLoader } from 'redux-dataloader'

import * as userActions from './userActions'

const userLoader = createLoader (userActions.FETCH_USER_REQUEST, {
  /*
   * (required) Handle fetched data, return a success action
   */
  success: (context, result) => {
    // you can get original request action from context
    const action = context.action
    const userId = action.payload.userId
    return userActions.fetchUserSuccess(userId, result)
  },
  /*
   * (required) Handle error, return a failure action
   */
  error: (context, error) => {
    const action = context.action
    const userId = action.payload.userId
    return userActions.fetchUserFailure(userId, error);
  },
  /*
   * (optional) By default, original request action will be dispatched. But you can still modify this process.
   */
  // loading: ({ action }) => {}
  /*
   * (optional) Checks in local cache (e.g. localstoreage) first.
   * if the value is present it'll use that instead.
   */
  local: (context) => {
    // Load data
  },
  /*
   * (required) Fetch data remotely.
   * We use yahoo/fetchr as an example.
   */
  remote: (context) => {
    const action = context.action
    const userId = action.payload.userId

    const fetchr = context.fetchr
    return fetchr.read('userService')
      .params({
        userId
      }).end()
  },
  /*
   * (optional) !!! Different from alt API.
   * When shouldFetch returns false, it will prevent both local and remote request.
   */
  shouldFetch: (context) => {
    const action = context.action
    const userId = action.payload.userId
    const getState = context.getState
    return !getState().user.users[userId]
  }
})

export default [userLoader];
```

### 3. Register middleware

#### `configureStore.js`

```javascript
import { createStore, applyMiddleware } from 'redux'
import { createDataLoaderMiddleware } from `redux-dataloader`
import { Fetchr } from 'fetchr'
import reducer from './reducers'
import loaders from './dataloaders'

const fetcher = new Fetcher({
  xhrPath: '/api',
});

// create middleware, you can add extra arguments to data loader context
const dataLoaderMiddleware = createDataLoaderMiddleware(loaders, { fetchr })

const store = createStore(
  reducer,
  applyMiddleware(dataLoaderMiddleware)
)

// ...
```

### 4. Use it for your application

Then, just use it in your application.
The following is an example that combined with [redial](https://github.com/markdalgleish/redial) for isomorphic use.

```javascript
import { provideHooks } from 'redial'
import { fetchUserRequest } from 'userActions'
import { fetchArticleRequest } from 'articleAction'
import { fetchArticleSkinRequest } from 'articleSkinAction'
import { getUserByUsername } from 'userReducer'
import { getArticle } from 'articleReducer'
import { getArticleSkin } from 'articleSkinReducer'

// the router location is: /:username/:articleId
// Data dependency: user <= article <= articleSkin
async function fetchData({param, dispatch, getState}) {
  try {
    // 1. Fetch user
    const username = params.username
    await dispatch(fetchUserRequest(username)) // wait for response

    // 2. Fetch article by userId and articleId, you may use useId for authentication
    const user = getUserByUsername(username)
    const articleId = params.articleId
    await dispatch(fetchArticleRequest(user.id, articleId))

    // 3. Fetch article skin by articleId
    const article = getArticle(articleId)
    await dispatch(fetchArticleSkinRequest(article.skinId))
  } catch (err) {
    // ...
  }
}

function mapStateToProps(state, owndProps) {
  // ...
}

@connect(mapStateToProps)
@provideHooks({
  fetch: fetchData
})
export default class ArticleContainer extends React.Component {
  // ...
}
```

You can also write `fetchData()` with Promise:

```javascript
function fetchData({param, dispatch, getState}) {
  return Promise.resolve().then(() => {
    // 1. Fetch user
    const username = params.username
    return dispatch(fetchUserRequest(username))
  }).then(() => {
    // 2. Fetch article by userId and articleId, you may use useId for authentication
    const user = getUserByUsername(username) // get User from state
    const articleId = params.articleId
    return dispatch(fetchArticleRequest(user.id, articleId))
  }).then(() => {
    // 3. Fetch article skin by articleId
    const article = getArticle(articleId) // get Article from state
    return dispatch(fetchArticleSkinRequest(article.skinId))
  }).catch((err) => {
    // error handler
    // ...
  })
}
```

## Documentation

- [API](/API.md)

## License

MIT
