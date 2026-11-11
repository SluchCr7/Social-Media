let authSessionVersion = 0;

export const getAuthSessionVersion = () => authSessionVersion;

export const advanceAuthSessionVersion = () => {
  authSessionVersion += 1;
};
