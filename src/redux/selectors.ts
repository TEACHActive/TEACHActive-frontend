import { RootState } from "./store";
import { BaseSession } from "api/types";
import { createSelector } from "reselect";

export const getSelectedSession = (store: RootState) =>
  store.session.selectedSession;

const sessionsSelector = (store: RootState) => store.session.sessions;

const keywordFilterSelector = (store: RootState) => store.session.keywordFilter;

export const getKeywordFilter = createSelector(
  keywordFilterSelector,
  (keywordFilter) => keywordFilter
);

export const getSessions = createSelector(
  sessionsSelector,
  keywordFilterSelector,
  (sessions, keywordFilter) => {
    if (keywordFilter)
      return sessions.filter(
        (session: BaseSession) => session.keyword === keywordFilter
      );
    return sessions;
  }
);

export const getAllSessions = createSelector(
  sessionsSelector,
  (sessions) => sessions
);

export const getReflections = (store: RootState) => {
  return store.reflections;
};
