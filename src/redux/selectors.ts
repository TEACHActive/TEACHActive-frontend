export const getSelectedSession = (store: any) => store.session.selectedSession;

export const getSessions = (store: any) => {
  return store.session.sessions;
};

export const getUser = (store: any) => {
  if (process.env.REACT_APP_TEST_USER_UID !== "")
    return process.env.REACT_APP_TEST_USER_UID;
  else return store.user.currentUser;
};
