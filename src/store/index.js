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
    postsPerGroup: {},
    postsLoading: false,
    postsLoadingError: false,
    failedRequests: 0,
    totalPosts: 0,
    totalPostPages: 0,
    totalPostPagesPerGroup: {},
    events: {},
    eventsPerGroup: {},
    eventsLoading: false,
    eventsLoadingError: false,
    mainEvents: [],
    mainEventsLoading: false,
    mainEventsLoadingError: false,
    pages: {},
    pageLoading: false,
    pageLoadingError: false,
    groups: [],
    groupsLoading: false,
    groupsLoadingError: false,
    facilities: [],
    facilitiesLoading: false,
    facilitiesLoadingError: false,
    calendarView: "",
    calendarFocus: "",
    region: ""
  },

  getters,
  mutations,
  actions
});
