export default {
  changeFontSize(state, action) {
    if (action && state.fontSize) {
      state.fontSize += action;
    } else {
      state.fontSize = 16;
    }
  },
  changePostsLoading(state, value) {
    state.postsLoading = value;
  },
  changePostsLoadingError(state, value) {
    state.postsLoadingError = value;
  },
  storePosts(state, { posts, page }) {
    state.posts[page] = posts;
  },
  storePostsPerCategory(state, { posts, page, categoryName }) {
    if (!state.postsPerCategory[categoryName]) {
      state.postsPerCategory[categoryName] = {};
    }
    state.postsPerCategory[categoryName][page] = posts;
  },
  incrementFailedRequests(state, num) {
    if (!num) {
      state.failedRequests = 0;
    } else {
      state.failedRequests += 1;
    }
  },
  setPostHeaders(state, headers) {
    state.totalPosts = parseInt(headers["x-wp-total"], 10);
    state.totalPostPages = parseInt(headers["x-wp-totalpages"], 10);
  },
  setPostHeadersPerCategory(state, { headers, categoryName }) {
    state.totalPostPagesPerCategory[categoryName] = parseInt(headers["x-wp-totalpages"], 10);
  },
  changeEventsLoading(state, value) {
    state.eventsLoading = value;
  },
  changeEventsLoadingError(state, value) {
    state.eventsLoadingError = value;
  },
  storeEvents(state, { events, year, month }) {
    if (!state.events[year]) {
      state.events[year] = {};
    }
    state.events[year][month] = [...events];
  },
  storeEventsPerGroup(state, { events, groupName }) {
    if (!state.eventsPerGroup[groupName]) {
      state.eventsPerGroup[groupName] = {};
    }
    state.eventsPerGroup[groupName] = events;
  },
  changePageLoading(state, value) {
    state.pageLoading = value;
  },
  changePageLoadingError(state, value) {
    state.pageLoadingError = value;
  },
  storePage(state, { page, slug }) {
    state.pages[slug] = page;
  },
  changeGroupsLoading(state, value) {
    state.groupsLoading = value;
  },
  changeGroupsLoadingError(state, value) {
    state.groupsLoadingError = value;
  },
  storeGroups(state, groups) {
    state.groups = groups;
  },
  changeCalendarType(state, view) {
    state.calendarView = view;
  },
  changeCalendarFocus(state, focus) {
    state.calendarFocus = focus;
  }
};
