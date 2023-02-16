import api from "../services/api";
import formatter from "../services/formatter";

export default {
  fetchPosts(context, { page, categoryName }) {
    context.commit("changePostsLoading", true);
    context.commit("changePostsLoadingError", false);
    const path = "wp/v2/posts";
    const params = {
      _embed: true,
      page,
      per_page: 6
    };
    if (categoryName) {
      Object.assign(params, {
        "filter[category_name]": categoryName
      });
    }
    return new Promise((resolve, reject) => {
      api
        .fetchData(path, params)
        .then(
          response => {
            let { data, headers } = response;
            const posts = formatter.formatPosts(data);
            if (categoryName) {
              context.commit("storePostsPerCategory", {
                posts,
                page,
                categoryName
              });
              context.commit("setPostHeadersPerCategory", {
                headers,
                categoryName
              });
            } else {
              context.commit("storePosts", { posts, page });
              context.commit("setPostHeaders", headers);
            }
            context.commit("incrementFailedRequests", 0);
            resolve(posts);
          },
          error => {
            context.commit("changePostsLoadingError", true);
            context.commit("incrementFailedRequests", 1);
            reject(error);
          }
        )
        .finally(() => {
          context.commit("changePostsLoading", false);
        });
    });
  },
  fetchPostBySlug(context, slug) {
    context.commit("changePostsLoading", true);
    context.commit("changePostsLoadingError", false);
    const path = "wp/v2/posts";
    const params = {
      _embed: true,
      slug
    };
    return new Promise((resolve, reject) => {
      api
        .fetchData(path, params)
        .then(
          response => {
            let { data } = response;
            const posts = formatter.formatPosts(data);
            context.commit("incrementFailedRequests", 0);
            resolve(posts[0]);
          },
          error => {
            context.commit("changePostsLoadingError", true);
            context.commit("incrementFailedRequests", 1);
            reject(error);
          }
        )
        .finally(() => {
          context.commit("changePostsLoading", false);
        });
    });
  },
  fetchPostsBySearchTerm(context, { search, perPage }) {
    const path = "wp/v2/posts";
    const params = {
      search,
      per_page: perPage
    };
    return new Promise((resolve, reject) => {
      api.fetchData(path, params).then(
        response => {
          let { data } = response;
          const posts = data;
          resolve(posts);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  fetchEvents(context, { startDate, endDate, groupName }) {
    context.commit("changeEventsLoading", true);
    context.commit("changeEventsLoadingError", false);
    let year, month;
    const path = "wp/v2/events";
    const params = {
      _embed: true,
      per_page: 100
    };
    if (startDate) {
      Object.assign(params, {
        "filter[meta_query][0][key]": "event_datum",
        "filter[meta_query][0][value]": startDate,
        "filter[meta_query][0][compare]": ">="
      });
      year = parseInt(startDate.slice(0, 4), 10);
      month = parseInt(startDate.slice(4, 6), 10);
    }
    if (endDate) {
      Object.assign(params, {
        "filter[meta_query][1][key]": "event_datum",
        "filter[meta_query][1][value]": endDate,
        "filter[meta_query][1][compare]": "<="
      });
    }
    if (groupName) {
      Object.assign(params, {
        "filter[category_name]": groupName
      });
    }
    return new Promise((resolve, reject) => {
      api
        .fetchData(path, params)
        .then(
          response => {
            let { data } = response;
            const events = formatter.formatEvents(data);
            if (year && month && !groupName) {
              context.commit("storeEvents", { events, year, month });
            } else if (groupName) {
              context.commit("storeEventsPerGroup", { events, groupName });
            }
            context.commit("incrementFailedRequests", 0);
            resolve(events);
          },
          error => {
            context.commit("changeEventsLoadingError", true);
            context.commit("incrementFailedRequests", 1);
            reject(error);
          }
        )
        .finally(() => {
          context.commit("changeEventsLoading", false);
        });
    });
  },
  fetchEventBySlug(context, slug) {
    context.commit("changeEventsLoading", true);
    context.commit("changeEventsLoadingError", false);
    const path = "wp/v2/events";
    const params = {
      _embed: true,
      slug
    };
    return new Promise((resolve, reject) => {
      api
        .fetchData(path, params)
        .then(
          response => {
            const { data } = response;
            const events = formatter.formatEvents(data);
            context.commit("incrementFailedRequests", 0);
            resolve(events[0]);
          },
          error => {
            context.commit("changeEventsLoadingError", true);
            context.commit("incrementFailedRequests", 1);
            reject(error);
          }
        )
        .finally(() => {
          context.commit("changeEventsLoading", false);
        });
    });
  },
  fetchEventsBySearchTerm(context, { search, perPage }) {
    const path = "wp/v2/events";
    const params = {
      search,
      per_page: perPage
    };
    return new Promise((resolve, reject) => {
      api.fetchData(path, params).then(
        response => {
          let { data } = response;
          const posts = data;
          resolve(posts);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  fetchPageBySlug(context, slug) {
    context.commit("changePageLoading", true);
    context.commit("changePageLoadingError", false);
    const path = "wp/v2/pages";
    const params = {
      _embed: true,
      slug
    };
    return new Promise((resolve, reject) => {
      api
        .fetchData(path, params)
        .then(
          response => {
            let { data } = response;
            const page = formatter.formatPage(data);
            context.commit("storePage", { page, slug });
            context.commit("incrementFailedRequests", 0);
            resolve(page);
          },
          error => {
            context.commit("changePageLoadingError", true);
            context.commit("incrementFailedRequests", 1);
            reject(error);
          }
        )
        .finally(() => {
          context.commit("changePageLoading", false);
        });
    });
  },
  fetchGroups(context) {
    context.commit("changeGroupsLoading", true);
    context.commit("changeGroupsLoadingError", false);
    const path = "wp/v2/netzwerk";
    const params = {
      _embed: true,
      per_page: 100
    };
    return new Promise((resolve, reject) => {
      api
        .fetchData(path, params)
        .then(
          response => {
            let { data } = response;
            const groups = formatter.formatGroups(data);
            context.commit("storeGroups", groups);
            context.commit("incrementFailedRequests", 0);
            resolve(groups);
          },
          error => {
            context.commit("changeGroupsLoadingError", true);
            context.commit("incrementFailedRequests", 1);
            reject(error);
          }
        )
        .finally(() => {
          context.commit("changeGroupsLoading", false);
        });
    });
  }
};
