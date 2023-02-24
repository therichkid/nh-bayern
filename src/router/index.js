import Vue from "vue";
import Router from "vue-router";

import Home from "../views/Home";
import News from "../views/News";
import Post from "../views/Post";
import Event from "../views/Event";
import Network from "../views/Network";
import WorkingGroups from "../views/WorkingGroups";
import Group from "../views/Group";
import DataControl from "../views/DataControl";
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
  { path: "/pressemitteilungen", redirect: "/news" },
  { path: "/woche-der-kommunikation", redirect: "/news" },
  { path: "/woche-der-senior-innen", redirect: "/news" },
  {
    path: "/news/page/:page?",
    name: "news",
    component: News,
    meta: {
      title: "Neuigkeiten",
      description: "Neuigkeiten, aktuelle Berichte und Veranstaltungen."
    },
    alias: "/news"
  },
  // News redirects
  {
    path: "/newsbeitrag/*",
    redirect: route =>
      "/news/" +
      route.path
        .split("/")
        .filter(path => path)
        .pop()
        .replace(".html", "")
  },
  {
    path: "/pressebeitrag/*",
    redirect: route =>
      "/news/" +
      route.path
        .split("/")
        .filter(path => path)
        .pop()
        .replace(".html", "")
  },
  {
    path: "/newsbeitrag.25/*",
    redirect: route =>
      "/news/" +
      route.path
        .split("/")
        .filter(path => path)
        .pop()
        .replace(".html", "")
  },
  {
    path: "/newsbeitrag-33/*",
    redirect: route =>
      "/news/" +
      route.path
        .split("/")
        .filter(path => path)
        .pop()
        .replace(".html", "")
  },
  {
    path: "/news/:slug",
    name: "post",
    component: Post,
    meta: {
      title: "Neuigkeiten",
      description: "Hier geht's zum vollständigen Artikel \u201E{slug}\u201C."
    },
    props: true
  },
  { path: "/kalender", redirect: "/events" },
  {
    path: "/events",
    name: "events",
    component: Calendar,
    meta: {
      title: "Veranstaltungen",
      description:
        "Hier geht's zum Kalender des NH Bayerns, der Auskunft über Veranstaltungen des Netzwerks gibt."
    }
  },
  {
    path: "/events/:date/:slug",
    name: "event",
    component: Event,
    meta: {
      title: "Veranstaltungen",
      description: "{slug} am {date}: Alle Infos zur Veranstaltung."
    },
    props: true
  },
  {
    path: "/events/:date/:slug/anmeldung",
    name: "Anmeldung",
    component: Form,
    meta: {
      title: "Anmeldung",
      description: "Anmeldung zur Veranstaltung {slug} am {date}."
    },
    props: route => ({
      date: route.params.date,
      slug: route.params.slug,
      type: "event"
    })
  },
  { path: "/kurzprofil", redirect: "/netzwerk" },
  {
    path: "/netzwerk",
    name: "network",
    component: Network,
    meta: {
      title: "Netzwerk",
      description: "Hier finden Sie alle Mitglieder des Netzwerks Hörbehinderung Bayern."
    }
  },
  {
    path: "/arbeitskreise",
    name: "workingGroups",
    component: WorkingGroups,
    meta: {
      title: "Arbeitskreise",
      description:
        "Arbeitskreise sind Projektteams, die sich aus Mitgliedern der unterschiedlichen Organisationen des Netzwerks Hörbehinderung Bayern zusammensetzen."
    }
  },
  // Group redirects
  {
    path: "/kurzprofil/articles/vereinigung-der-eltern-hoergeschaedigter-in-bayern-e-v",
    redirect: "/netzwerk/ev"
  },
  {
    path: "/kurzprofil/articles/regens-wagner-offene-hilfen-in-der-stadt-augsburg-und-im-regierungsbezirk-schwaben",
    redirect: "/netzwerk/regens-wagner"
  },
  {
    path: "/kurzprofil/articles/schriftdolmetscherverband-bayern-e-v",
    redirect: "/netzwerk/sd-bayern"
  },
  {
    path: "/kurzprofil/articles/arbeitsgemeinschaft-katholische-hoergeschaedigtenseelsorge-in-bayern",
    redirect: "/netzwerk/hoergeschaedigtenseelsorge"
  },
  {
    path: "/kurzprofil/articles/der-paritaetische-bayern-bezirksverband-oberfranken",
    redirect: "/netzwerk/der-paritaetische"
  },
  {
    path: "/kurzprofil/articles/evang-luth-gehoerlosenseelsorge-gebaerdensprachliche-gemeinden-in-bayern",
    redirect: "/netzwerk/egg"
  },
  {
    path: "/kurzprofil/articles/blwg",
    redirect: "/netzwerk/blwg"
  },
  {
    path: "/kurzprofil/articles/gehoerlosenverband-muenchen-und-umland-ev",
    redirect: "/netzwerk/gmu"
  },
  {
    path: "/kurzprofil/articles/kontakte-und-informationen-fuer-morbus-meniere-kimm-e-v",
    redirect: "/netzwerk/kimm"
  },
  {
    path: "/kurzprofil/articles/schwerhoerigenseelsorge-der-evang-luth-kirche-in-bayern",
    redirect: "/netzwerk/shs-elkb"
  },
  {
    path: "/kurzprofil/articles/landesverband-bayern-der-gehoerlosen-e-v",
    redirect: "/netzwerk/lvbygl"
  },
  {
    path: "/kurzprofil/articles/berufsverband-bayerischer-hoergeschaedigtenpaedagogen-bbh-e-v",
    redirect: "/netzwerk/bbh"
  },
  {
    path: "/kurzprofil/articles/landesarbeitsgemeinschaft-hoerbehinderter-studenten-und-absolventen-ev-lhsa-bayern",
    redirect: "/netzwerk/dhsa"
  },
  {
    path: "/kurzprofil/articles/fachdienst-integration-taubblinder-und-hoersehbehinderter-menschen-in-bayern-itm",
    redirect: "/netzwerk/itm"
  },
  {
    path: "/kurzprofil/articles/landesverband-bayern-der-schwerhoerigen-und-ertaubten-ev",
    redirect: "/netzwerk/lvbysh"
  },
  {
    path: "/kurzprofil/articles/power-trotz-handicap",
    redirect: "/netzwerk/pth"
  },
  {
    path: "/kurzprofil/articles/bayerischer-cochlea-implantat-verband-ev",
    redirect: "/netzwerk/bayciv"
  },
  {
    path: "/kurzprofil/articles/gib-blwg",
    redirect: "/netzwerk/gib-blwg"
  },
  {
    path: "/kurzprofil/articles/deutsche-tinnitus-liga",
    redirect: "/netzwerk/dtl"
  },
  {
    path: "/kurzprofil/articles/berufsfachverband-der-bayerischen-gebaerdensprachdolmetscherinnen-bayern-ev-bgsd",
    redirect: "/netzwerk/bgsd"
  },
  {
    path: "/kurzprofil/articles/berufsbildungswerk-muenchen",
    redirect: "/netzwerk/bbw"
  },
  {
    path: "/netzwerk/:groupName/page/:page?",
    name: "netzwerk",
    component: Group,
    meta: {
      title: "Netzwerk",
      description: "Hier finden Sie Infos zum Mitglied {groupName} des Netzwerks."
    },
    props: true,
    alias: "/netzwerk/:groupName"
  },
  {
    path: "/404",
    name: "404",
    component: PageNotFound,
    meta: {
      title: "404"
    }
  },
  {
    path: "/datenkontrolle",
    name: "datenkontrolle",
    component: DataControl,
    meta: {
      title: "Datenkontrolle",
      description: "Zurücksetzen von Cookies."
    }
  },
  {
    path: "/:slug",
    name: "page",
    component: Page,
    meta: {
      description: "Infos zu: {slug}."
    },
    props: true
  },
  { path: "*", redirect: "/404" }
];

const router = new Router({
  routes,
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      // Give the anchor some time to load
      setTimeout(() => {
        const element = document.getElementById(to.hash.replace("#", ""));
        if (element && element.scrollIntoView) {
          element.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      }, 1000);
      return { selector: to.hash };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  let title = "";
  if (to.meta.title) {
    title += `${to.meta.title} - `;
  }
  title += "NH Bayern";
  document.title = title;
  let description = to.meta.description || "Netzwerk Hörbehinderung Bayern";
  description = description.replace(/\{(.+?)\}/g, (_, param) => {
    const key = param.trim();
    if (to.params[key]) {
      return to.params[key]
        .split("-")
        .map(word => {
          word = word.replace(/ae/g, "\u00e4").replace(/oe/g, "\u00f6").replace(/ue/g, "\u00fc");
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    }
    return key;
  });
  document.querySelector('meta[name="description"]').setAttribute("content", description);
  document.querySelector('meta[property="og:description"]').setAttribute("content", description);
  document.querySelector('meta[itemprop="description"]').setAttribute("content", description);
  next();
});

export default router;
