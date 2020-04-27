import Vue from "vue";
import Router from "vue-router";

import Home from "../views/Home";
import News from "../views/News";
import Posts from "../views/Posts";
import Post from "../views/Post";
import Event from "../views/Event";
import SHG from "../views/SHG";
import Page from "../views/Page";
import PageNotFound from "../views/PageNotFound";

// Chunks
const Calendar = () => import(/* webpackChunkName: "calendar" */ "../views/Calendar");
const Form = () => import(/* webpackChunkName: "form" */ "../views/Form");

Vue.use(Router);

// TODO: use alias array for redirects after updating vue-router to v4

const routes = [
  { path: "/*.html", redirect: "/*" },
  { path: "/home", redirect: "/" },
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      title: "Home"
    }
  },
  { path: "/bayciv", redirect: "/news" },
  { path: "/aktuelle-meldungen", redirect: "/news" },
  { path: "/aktuelle-meldungen-gruppen", redirect: "/news" },
  {
    path: "/news/page/:page?",
    name: "news",
    component: News,
    meta: {
      title: "Neuigkeiten"
    },
    alias: "/news"
  },
  // News redirects
  {
    path: "/aktuelles-lesen/*",
    redirect: route => "/news/" + route.path.split("/").pop().replace(".html", "")
  },
  {
    path: "/pressespiegel/articles/*",
    redirect: route => "/news/" + route.path.split("/").pop().replace(".html", "")
  },
  {
    path: "/erfahrungen/articles/*",
    redirect: route => "/news/" + route.path.split("/").pop().replace(".html", "")
  },
  {
    path: "/videos/articles/*",
    redirect: route => "/news/" + route.path.split("/").pop().replace(".html", "")
  },
  {
    path: "/texte/articles/*",
    redirect: route => "/news/" + route.path.split("/").pop().replace(".html", "")
  },
  {
    path: "/gedichte/articles/*",
    redirect: route => "/news/" + route.path.split("/").pop().replace(".html", "")
  },
  {
    path: "/news/:slug",
    name: "post",
    component: Post,
    meta: {
      title: "Neuigkeiten"
    },
    props: true
  },
  { path: "/anmeldungen", redirect: "/events" },
  { path: "/veranstaltungen", redirect: "/events" },
  { path: "/kalender", redirect: "/events" },
  {
    path: "/events",
    name: "events",
    component: Calendar,
    meta: {
      title: "Veranstaltungen"
    }
  },
  {
    path: "/events/:date/:slug",
    name: "event",
    component: Event,
    meta: {
      title: "Veranstaltungen"
    },
    props: true
  },
  {
    path: "/events/:date/:slug/anmeldung",
    name: "Anmeldung",
    component: Form,
    meta: {
      title: "Anmeldung"
    },
    props: route => ({
      date: route.params.date,
      slug: route.params.slug,
      type: "event"
    })
  },
  // SHG redirects
  { path: "/shg-allgaeu", redirect: "/shgs/ci-shg-allgaeu" },
  {
    path: "/shgs/:groupName/page/:page?",
    name: "shg",
    component: SHG,
    meta: {
      title: "Selbsthilfegruppen"
    },
    props: true,
    alias: "/shgs/:groupName"
  },
  {
    path: "/erfahrungen/page/:page?",
    name: "posts",
    component: Posts,
    meta: {
      title: "Erfahrungen"
    },
    props: route => ({
      routerPage: "erfahrungen",
      page: route.params.page
    }),
    alias: "/erfahrungen"
  },
  {
    path: "/404",
    name: "404",
    component: PageNotFound,
    meta: {
      title: "404"
    }
  },
  // Page redirects
  // TODO
  {
    path: "/:slug",
    name: "page",
    component: Page,
    props: true
  },
  { path: "*", redirect: "/404" }
];

const router = new Router({
  routes,
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  let title = "";
  if (to.meta.title) {
    title += `${to.meta.title} - `;
  }
  title += "NH Bayern";
  document.title = title;
  next();
});

export default router;
