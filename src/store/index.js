import Vuex from "vuex";
import Vue from "vue";

import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fontSize: 16,
    posts: {},
    postsPerCategory: {},
    postsLoading: false,
    postsLoadingError: false,
    failedRequests: 0,
    totalPosts: 0,
    totalPostPages: 0,
    totalPostPagesPerCategory: {},
    events: {},
    eventsPerGroup: {},
    eventsLoading: false,
    eventsLoadingError: false,
    pages: {},
    pageLoading: false,
    pageLoadingError: false,
    groups: [],
    groupsLoading: false,
    groupsLoadingError: false,
    calendarView: "",
    calendarFocus: ""
  },

  getters,
  mutations,
  actions
});
