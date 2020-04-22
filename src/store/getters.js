export default {
  getFetchedPosts: state => (page, groupName) => {
    let posts;
    if (groupName) {
      posts = state.postsPerGroup[groupName] ? state.postsPerGroup[groupName][page] : null;
    } else {
      posts = state.posts[page];
    }
    return posts ? [true, posts] : [false, null];
  },
  getFetchedPostBySlug: state => slug => {
    for (const page in state.posts) {
      for (const post of state.posts[page]) {
        if (post.slug === slug) {
          return [true, post];
        }
      }
    }
    for (const groupName in state.postsPerGroup) {
      const postsPerGroup = state.postsPerGroup[groupName];
      for (const page in postsPerGroup) {
        for (const post of postsPerGroup[page]) {
          if (post.slug === slug) {
            return [true, post];
          }
        }
      }
    }
    return [false, null];
  },
  getFetchedEvents: state => (year, month) => {
    if (state.events[year] && state.events[year][month]) {
      const events = [...state.events[year][month]];
      return [true, events];
    }
    return [false, null];
  },
  getFetchedMainEvents: state => () => {
    if (state.mainEvents.length) {
      const events = [...state.mainEvents];
      return [true, events];
    }
    return [false, null];
  },
  getFetchedEventsPerGroup: state => groupName => {
    if (state.eventsPerGroup[groupName] && state.eventsPerGroup[groupName].length) {
      const events = [...state.eventsPerGroup[groupName]];
      return [true, events];
    }
    return [false, null];
  },
  getFetchedEventBySlug: state => (slug, year, month) => {
    if (state.events[year] && state.events[year][month]) {
      for (const event of state.events[year][month]) {
        if (event.slug === slug) {
          return [true, event];
        }
      }
    }
    for (const event of state.mainEvents) {
      if (event.slug === slug) {
        return [true, event];
      }
    }
    for (const groupName in state.eventsPerGroup) {
      const eventsPerGroup = state.eventsPerGroup[groupName];
      for (const event of eventsPerGroup) {
        if (event.slug === slug) {
          return [true, event];
        }
      }
    }
    return [false, null];
  },
  getFetchedPageBySlug: state => slug => {
    const page = state.pages[slug];
    if (page) {
      return [true, page];
    }
    return [false, null];
  },
  getFetchedGroups: state => () => {
    const groups = state.groups;
    return groups && groups.length ? [true, groups] : [false, null];
  },
  getFetchedFacilities: state => () => {
    const facilities = state.facilities;
    return facilities && facilities.length ? [true, facilities] : [false, null];
  }
};
