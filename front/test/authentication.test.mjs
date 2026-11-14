import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

process.env.NEXT_PUBLIC_BACK_URL = 'https://api.example.test';

const [{ configureStore }, { baseApi }, { authApi }, { default: authReducer }, { refreshAuthSession }] =
  await Promise.all([
    import('@reduxjs/toolkit'),
    import('../app/redux/api/baseApi.js'),
    import('../app/redux/features/auth/authApi.js'),
    import('../app/redux/features/auth/authSlice.js'),
    import('../app/utils/authRefresh.js'),
  ]);

const authTestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    protectedProbe: builder.query({
      query: (id) => `/test/protected/${id}`,
    }),
  }),
});

const originalFetch = globalThis.fetch;
const stores = new Set();

afterEach(() => {
  for (const store of stores) {
    store.dispatch(baseApi.util.resetApiState());
  }
  stores.clear();
  globalThis.fetch = originalFetch;
});

const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
  stores.add(store);
  return store;
};

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const requestDetails = (url, options) => ({
  url: url instanceof Request ? url.url : String(url),
  options: options || (url instanceof Request ? url : {}),
});

const waitFor = async (predicate) => {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  assert.fail('Timed out waiting for authentication state');
};

test('restores a valid session during initial load and after a browser refresh', async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push(requestDetails(url, options));
    return jsonResponse({ user: { _id: 'user-1', username: 'restored' } });
  };

  for (const load of ['initial load', 'browser refresh']) {
    const store = makeStore();
    const request = store.dispatch(
      authApi.endpoints.getMe.initiate(undefined, { subscribe: false })
    );
    await request.unwrap();
    await waitFor(() => store.getState().auth.isAuthChecked);

    assert.equal(store.getState().auth.user.username, 'restored', load);
    assert.equal(store.getState().auth.isLogin, true, load);
  }

  assert.equal(calls.length, 2);
  assert.ok(calls.every(({ options }) => options.credentials === 'include'));
});

test('the application remains initializing until the session check finishes', async () => {
  let resolveMe;
  globalThis.fetch = () => new Promise((resolve) => {
    resolveMe = resolve;
  });

  const store = makeStore();
  const request = store.dispatch(
    authApi.endpoints.getMe.initiate(undefined, { subscribe: false })
  );
  await waitFor(() => typeof resolveMe === 'function');

  assert.equal(store.getState().auth.status, 'initializing');
  assert.equal(store.getState().auth.isAuthChecked, false);

  resolveMe(jsonResponse({ user: { _id: 'user-1', username: 'restored' } }));
  await request.unwrap();
  await waitFor(() => store.getState().auth.isAuthChecked);
  assert.equal(store.getState().auth.isLogin, true);
});

test('refreshes an expired access token and retries the current-user request', async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    const request = requestDetails(url, options);
    const requestUrl = request.url;
    calls.push(request);

    if (requestUrl.endsWith('/auth/refresh')) {
      return jsonResponse({ message: 'Session refreshed' });
    }
    if (calls.filter(({ url: calledUrl }) => calledUrl.endsWith('/auth/me')).length === 1) {
      return jsonResponse({ code: 'TOKEN_EXPIRED' }, 401);
    }
    return jsonResponse({ user: { _id: 'user-2', username: 'refreshed' } });
  };

  const store = makeStore();
  await store.dispatch(
    authApi.endpoints.getMe.initiate(undefined, { subscribe: false })
  ).unwrap();
  await waitFor(() => store.getState().auth.isAuthChecked);

  assert.equal(store.getState().auth.user.username, 'refreshed');
  assert.equal(calls.filter(({ url }) => url.endsWith('/auth/refresh')).length, 1);
  assert.equal(calls.filter(({ url }) => url.endsWith('/auth/me')).length, 2);
  assert.ok(calls.every(({ options }) => options.credentials === 'include'));
});

test('a missing refresh cookie initializes as a guest without a retry loop', async () => {
  const calls = [];
  globalThis.fetch = async (url) => {
    const requestUrl = requestDetails(url).url;
    calls.push(requestUrl);
    return jsonResponse(
      { code: requestUrl.endsWith('/auth/refresh') ? 'NO_REFRESH_TOKEN' : 'NO_TOKEN' },
      401
    );
  };

  const store = makeStore();
  await store.dispatch(
    authApi.endpoints.getMe.initiate(undefined, { subscribe: false })
  ).unwrap().catch(() => undefined);
  await waitFor(() => store.getState().auth.isAuthChecked);

  assert.equal(store.getState().auth.isLogin, false);
  assert.equal(store.getState().auth.status, 'unauthenticated');
  assert.equal(calls.filter((url) => url.endsWith('/auth/refresh')).length, 1);
});

test('an expired refresh token initializes as a guest', async () => {
  const calls = [];
  globalThis.fetch = async (url) => {
    const requestUrl = requestDetails(url).url;
    calls.push(requestUrl);
    return requestUrl.endsWith('/auth/refresh')
      ? jsonResponse({ code: 'REFRESH_TOKEN_EXPIRED' }, 401)
      : jsonResponse({ code: 'TOKEN_EXPIRED' }, 401);
  };

  const store = makeStore();
  await store.dispatch(
    authApi.endpoints.getMe.initiate(undefined, { subscribe: false })
  ).unwrap().catch(() => undefined);
  await waitFor(() => store.getState().auth.isAuthChecked);

  assert.equal(store.getState().auth.isLogin, false);
  assert.equal(store.getState().auth.status, 'unauthenticated');
  assert.equal(calls.filter((url) => url.endsWith('/auth/refresh')).length, 1);
});

test('concurrent 401 handlers share one refresh and retry rotation conflicts', async () => {
  let releaseRefresh;
  let refreshCalls = 0;
  globalThis.fetch = async () => {
    refreshCalls += 1;
    return new Promise((resolve) => {
      releaseRefresh = resolve;
    });
  };

  const first = refreshAuthSession();
  const second = refreshAuthSession();
  assert.equal(refreshCalls, 1);
  releaseRefresh(jsonResponse({ message: 'refreshed' }));
  await Promise.all([first, second]);

  let rotationAttempts = 0;
  globalThis.fetch = async () => {
    rotationAttempts += 1;
    return rotationAttempts === 1
      ? jsonResponse({ code: 'TOKEN_ROTATED' }, 409)
      : jsonResponse({ message: 'refreshed' });
  };

  await refreshAuthSession();
  assert.equal(rotationAttempts, 2);
});

test('simultaneous protected requests share one refresh request', async () => {
  const requestCounts = new Map();
  let refreshCalls = 0;
  globalThis.fetch = async (url) => {
    const requestUrl = requestDetails(url).url;
    if (requestUrl.endsWith('/auth/refresh')) {
      refreshCalls += 1;
      await new Promise((resolve) => setTimeout(resolve, 20));
      return jsonResponse({ message: 'refreshed' });
    }

    const requestCount = (requestCounts.get(requestUrl) || 0) + 1;
    requestCounts.set(requestUrl, requestCount);
    return requestCount === 1
      ? jsonResponse({ code: 'TOKEN_EXPIRED' }, 401)
      : jsonResponse({ ok: true });
  };

  const store = makeStore();
  const results = await Promise.all([
    store.dispatch(authTestApi.endpoints.protectedProbe.initiate('one', {
      subscribe: false,
    })).unwrap(),
    store.dispatch(authTestApi.endpoints.protectedProbe.initiate('two', {
      subscribe: false,
    })).unwrap(),
  ]);

  assert.deepEqual(results, [{ ok: true }, { ok: true }]);
  assert.equal(refreshCalls, 1);
});

test('recoverable initialization errors do not become guest state and can be retried', async () => {
  let fail = true;
  globalThis.fetch = async () => {
    if (fail) throw new TypeError('Network unavailable');
    return jsonResponse({ user: { _id: 'user-3', username: 'reconnected' } });
  };

  const store = makeStore();
  await store.dispatch(
    authApi.endpoints.getMe.initiate(undefined, { subscribe: false })
  ).unwrap().catch(() => undefined);
  await waitFor(() => store.getState().auth.status === 'error');

  assert.equal(store.getState().auth.isAuthChecked, false);
  assert.equal(store.getState().auth.isLogin, false);

  fail = false;
  await store.dispatch(
    authApi.endpoints.getMe.initiate(undefined, {
      forceRefetch: true,
      subscribe: false,
    })
  ).unwrap();
  await waitFor(() => store.getState().auth.isAuthChecked);

  assert.equal(store.getState().auth.user.username, 'reconnected');
});

test('an old failed request cannot overwrite a successful login', async () => {
  let rejectOldRequest;
  globalThis.fetch = async (url) => {
    if (requestDetails(url).url.endsWith('/auth/login')) {
      return jsonResponse({ user: { _id: 'new-user', username: 'new-session' } });
    }
    return new Promise((resolve) => {
      rejectOldRequest = resolve;
    });
  };

  const store = makeStore();
  const oldRequest = store.dispatch(
    authApi.endpoints.getMe.initiate(undefined, { subscribe: false })
  );
  await waitFor(() => typeof rejectOldRequest === 'function');

  await store.dispatch(
    authApi.endpoints.login.initiate({ email: 'user@example.test', password: 'pass' })
  ).unwrap();
  rejectOldRequest(jsonResponse({ code: 'TOKEN_EXPIRED' }, 401));
  await oldRequest.unwrap().catch(() => undefined);
  await waitFor(() => store.getState().auth.isLogin);

  assert.equal(store.getState().auth.user.username, 'new-session');
  assert.equal(store.getState().auth.sessionVersion, 1);
});

test('logout followed by a new login keeps the newer session authenticated', async () => {
  globalThis.fetch = async (url) => {
    if (requestDetails(url).url.endsWith('/auth/logout')) {
      return jsonResponse({ message: 'Logged out' });
    }
    return jsonResponse({ user: { _id: 'next-user', username: 'next-session' } });
  };

  const store = makeStore();
  await store.dispatch(authApi.endpoints.logout.initiate()).unwrap();
  assert.equal(store.getState().auth.isLogin, false);

  await store.dispatch(
    authApi.endpoints.login.initiate({ email: 'user@example.test', password: 'pass' })
  ).unwrap();

  assert.equal(store.getState().auth.isLogin, true);
  assert.equal(store.getState().auth.user.username, 'next-session');
});
