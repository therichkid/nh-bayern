export default {
  // * Posts
  formatPosts: input => {
    if (!Array.isArray(input)) {
      input = [input];
    }
    const posts = [];
    for (const orig of input) {
      const article = {
        id: orig.id,
        slug: orig.slug,
        title: decodeHtml(orig.title.rendered),
        author: orig.acf.abweichender_autor || orig._embedded.author[0].name,
        excerpt: orig.excerpt.rendered,
        content: parseContent(orig.content.rendered),
        dateOrig: orig.date.slice(0, 10),
        date: formatDate(null, orig.date),
        categories: addCategories(orig, false),
        featuredImage: addFeaturedImage(orig)
      };
      const { color, image } = addCategoryProps(article.categories, true);
      article.color = color;
      if (!article.featuredImage.source) {
        article.featuredImage = image;
      }
      posts.push(article);
    }
    return posts;
  },

  // * Events
  formatEvents: input => {
    const events = [];
    for (const orig of input) {
      const event = {
        id: orig.id,
        slug: orig.slug,
        title: decodeHtml(orig.title.rendered),
        content: parseContent(orig.content.rendered),
        startDate: orig.acf.event_datum,
        endDate:
          orig.acf.event_datum !== orig.acf.event_datum_ende ? orig.acf.event_datum_ende : null,
        startTime: orig.acf.zeit_von,
        endTime: orig.acf.zeit_bis,
        registration: !!orig.acf.anmeldung,
        address: addAddress(orig),
        groups: addCategories(orig, true)
      };
      // Format the date
      [event.dateFormatted, event.dayFormatted, event.monthFormatted] = formatDate(
        "event",
        event.startDate,
        event.endDate
      );
      // Props for the Vuetify calendar
      Object.assign(event, {
        name: event.title,
        start: event.startDate + " " + event.startTime
      });
      // Add the event end date
      if (event.endDate && !event.endTime) {
        event.end = event.endDate;
      } else if (event.endDate && event.endTime) {
        event.end = event.endDate + " " + event.endTime;
      } else if (!event.endDate && event.endTime) {
        event.end = event.startDate + " " + event.endTime;
      }
      // Add form data
      Object.assign(event, {
        formId: parseInt(orig.acf.formular_id, 10),
        formData: orig.acf.formular_code
      });
      const { color } = addCategoryProps(event.groups, false);
      event.color = color;
      event.groups = removeParentCategories(event.groups);
      events.push(event);
    }
    // Sort events by date
    events.sort((a, b) => {
      return parseInt(a.startDate.replace(/-/g, "")) - parseInt(b.startDate.replace(/-/g, ""));
    });
    return events;
  },

  // * Page
  formatPage: input => {
    if (!input.length) {
      return null;
    }
    const orig = input[0];
    const page = {
      id: orig.id,
      slug: orig.slug,
      title: decodeHtml(orig.title.rendered),
      author: orig.acf.abweichender_autor || orig._embedded.author[0].name,
      content: parseContent(orig.content.rendered),
      dateOrig: orig.date.slice(0, 10),
      date: formatDate(null, orig.date),
      featuredImage: addFeaturedImage(orig)
    };
    // Add form data
    Object.assign(page, {
      formId: parseInt(orig.acf.formular_id, 10),
      formData: orig.acf.formular_code
    });
    // Add info message specific fields
    if (page.slug === "info-meldung") {
      const typeRemap = {
        Primär: "primary",
        Sekundär: "secondary",
        Erfolg: "success",
        Info: "info"
      };
      Object.assign(page, {
        type: typeRemap[orig.acf.typ] || "primary",
        teaser: orig.acf.teaser,
        link: orig.acf.link,
        buttonText: orig.acf["button-text"]
      });
    }
    return page;
  },

  // * Groups
  formatGroups: input => {
    const groups = [];
    for (const orig of input) {
      const group = {
        id: orig.id,
        slug: orig.slug,
        name: decodeHtml(orig.title.rendered),
        content: orig.content ? parseContent(orig.content.rendered) : null,
        address: addAddress(orig),
        address2: addAddress2(orig),
        email: orig.acf.email,
        phone: orig.acf.telefon,
        mobile: orig.acf.mobil,
        fax: orig.acf.fax,
        homepage: orig.acf.homepage,
        email2: orig.acf.email_2,
        phone2: orig.acf.telefon_2,
        mobile2: orig.acf.mobil_2,
        fax2: orig.acf.fax_2,
        homepage2: orig.acf.homepage_2,
        categories: addCategories(orig, true),
        featuredImage: addFeaturedImage(orig)
      };
      const { color } = addCategoryProps(group.categories, false);
      group.color = color;
      groups.push(group);
    }
    return groups;
  }
};

// * Helper functions
// Date
const formatDate = (type, date1, date2) => {
  const daysOfWeek = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const monthsOfYear = [
    { short: "Jan.", long: "Januar" },
    { short: "Feb", long: "Februar" },
    { short: "Mär.", long: "März" },
    { short: "Apr.", long: "April" },
    { short: "Mai", long: "Mai" },
    { short: "Jun.", long: "Juni" },
    { short: "Jul.", long: "Juli" },
    { short: "Aug.", long: "August" },
    { short: "Sep.", long: "September" },
    { short: "Okt", long: "Oktober" },
    { short: "Nov.", long: "November" },
    { short: "Dez.", long: "Dezember" }
  ];
  // Expects date format as String as it comes from WordPress DB: YYYY-mm-dd
  const YYYY = parseInt(date1.slice(0, 4), 10);
  const mm1 = parseInt(date1.slice(5, 7), 10) - 1;
  const dd1 = parseInt(date1.slice(8, 10), 10);
  if (!checkDateFormat("split", YYYY, mm1, dd1)) {
    throw "Invalid Date Format detected!";
  }
  let mm2;
  let dd2;
  const parsedDate1 = new Date(YYYY, mm1, dd1);
  let day = daysOfWeek[parsedDate1.getDay()];
  let month = monthsOfYear[mm1].short;
  const formattedDate = `${dd1.toString()}. ${month} ${YYYY}`;
  if (type === "event") {
    if (date2) {
      mm2 = parseInt(date2.slice(5, 7), 10) - 1;
      dd2 = parseInt(date2.slice(8, 10), 10);
      if (!checkDateFormat("split", YYYY, mm2, dd2)) {
        throw "Invalid Date Format detected!";
      }
      const parsedDate2 = new Date(YYYY, mm2, dd2);
      if (parsedDate2 !== parsedDate1) {
        day += ` bis ${daysOfWeek[parsedDate2.getDay()]}`;
        if (mm2 !== mm1) {
          month += ` bis ${monthsOfYear[mm2].short}`;
        }
      }
    }
    if (YYYY !== new Date().getFullYear()) {
      month += ` ${YYYY}`;
    }
    return [formattedDate, dd2 ? `${dd1} - ${dd2}` : dd1.toString(), `${month}, ${day}`];
  } else {
    return formattedDate;
  }
};

// To check if the input is valid (YYYY-mm-dd)
const checkDateFormat = (type, ...input) => {
  let YYYY, mm, dd;
  if (type === "raw") {
    YYYY = parseInt(input[0].slice(0, 4), 10);
    mm = parseInt(input[0].slice(5, 7), 10) - 1;
    dd = parseInt(input[0].slice(8, 10), 10);
  } else if (type === "split") {
    [YYYY, mm, dd] = input;
  }
  if ([YYYY, mm, dd].includes(NaN)) {
    return false;
  } else {
    return true;
  }
};

// Add the address to an event or a group
const addAddress = input => {
  let str = "";
  if (input.acf.adressname) {
    str += input.acf.adressname + (input.acf.adresse ? ", " : "");
  }
  if (input.acf.adresse) {
    if (input.acf.adresse.address.includes("Deutschland")) {
      str += input.acf.adresse.address.split(",").slice(0, -1).join(",");
    } else {
      str += input.acf.adresse.address;
    }
  }
  return str;
};

// Add the 2nd address to a group
const addAddress2 = input => {
  let str = "";
  if (input.acf.adressname_2) {
    str += input.acf.adressname_2 + (input.acf.adresse_2 ? ", " : "");
  }
  if (input.acf.adresse_2) {
    if (input.acf.adresse_2.address.includes("Deutschland")) {
      str += input.acf.adresse_2.address.split(",").slice(0, -1).join(",");
    } else {
      str += input.acf.adresse_2.address;
    }
  }
  return str;
};

// Add a featured image to an article or a group
const addFeaturedImage = input => {
  const obj = {};
  if (
    input._embedded &&
    input._embedded["wp:featuredmedia"] &&
    input._embedded["wp:featuredmedia"][0] &&
    input._embedded["wp:featuredmedia"][0].code !== "rest_forbidden" &&
    input._embedded["wp:featuredmedia"][0].code !== "rest_post_invalid_id"
  ) {
    const featuredImage = input._embedded["wp:featuredmedia"][0];
    obj.title = featuredImage.title.rendered;
    // Pick medium large size if it exists
    if (featuredImage.media_details.sizes && featuredImage.media_details.sizes.medium_large) {
      obj.source = featuredImage.media_details.sizes.medium_large.source_url;
    } else {
      obj.source = featuredImage.source_url;
    }
  }
  return obj;
};

// Add categories to an event, article or group
const addCategories = (input, onlyGroups) => {
  const categories = [];
  if (input._embedded && input._embedded["wp:term"] && input._embedded["wp:term"][0]) {
    const taxonomies = input._embedded["wp:term"][0];
    for (const taxonomy of taxonomies) {
      if (
        taxonomy.taxonomy === "category" &&
        !["uncategorized", "neutral"].includes(taxonomy.slug)
      ) {
        if ((onlyGroups && isGroupTaxonomy(taxonomy)) || !onlyGroups) {
          categories.push({
            name: taxonomy.name,
            slug: taxonomy.slug,
            type:
              isGroupTaxonomy(taxonomy) && !["neutral", "dgs", "ls"].includes(taxonomy.slug)
                ? "group"
                : "",
            link: taxonomy.link
          });
        }
      }
    }
  }
  return categories;
};

const isGroupTaxonomy = taxonomy => {
  const paths = ["/neutral/", "/dgs/", "/ls/"];
  for (const path of paths) {
    if (taxonomy.link.includes(path)) {
      return true;
    }
  }
  return false;
};

const addCategoryProps = (categories, addImage) => {
  let color;
  const colorMap = {
    DGS: "#512da8",
    LS: "#4dd0e1"
  };
  let image;
  const imageMap = {
    default: {
      title: "Frau neigt ihren Kopf nach rechts",
      source: require("../assets/placeholder/default.jpg")
    },
    DGS: {
      title: "Zwei Hände mit Gebärdezeichen",
      source: require("../assets/placeholder/dgs.jpg")
    },
    LS: {
      title: "Kind singt in ein Mikrofon",
      source: require("../assets/placeholder/ls.jpg")
    },
    News: {
      title: "Zeitungen",
      source: require("../assets/placeholder/news.jpg")
    },
    Presse: {
      title: "Buchstaben zum Bedrucken einer Zeitung",
      source: require("../assets/placeholder/presse.jpg")
    },
    "Woche der Kommunikation": {
      title: "Orangenes Mikrofon an einer orangenen Wand",
      source: require("../assets/placeholder/woche_der_kommunikation.jpg")
    },
    "Woche der Senior*innen": {
      title: "Zwei Hände umgreifen einen Gehstock",
      source: require("../assets/placeholder/woche_der_seniorinnen.jpg")
    }
  };
  for (const category of categories) {
    if (colorMap[category.name]) {
      color = colorMap[category.name];
    }
    if (addImage && imageMap[category.name]) {
      image = imageMap[category.name];
    }
  }
  if (!image) {
    image = imageMap.default;
  }
  return { color, image };
};

const removeParentCategories = categories => {
  for (let i = categories.length - 1; i >= 0; i--) {
    const category = categories[i];
    if (["DGS", "LS"].includes(category.name)) {
      categories.splice(i, 1);
    }
  }
  return categories;
};

const decodeHtml = str => {
  return str.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  });
};

const parseContent = str => {
  str = removeEmptyLines(str);
  str = parseEmbeds(str);
  return str;
};

const removeEmptyLines = str => {
  if (!str) {
    return "";
  }
  return str.replace(/<p>&nbsp;<\/p>/g, "");
};

const parseEmbeds = str => {
  const iframeRegExp = /<iframe[^>]+>[\s\S]*?<\/iframe>/g;
  const srcRegExp = /src=["'](.+?)["']/;
  const origs = [];
  const replacements = [];
  let orig;
  while ((orig = iframeRegExp.exec(str)) !== null) {
    let replacement = "";
    const src = orig[0].match(srcRegExp);
    if (src) {
      const url = src[1];
      if (url.includes("youtube") || url.includes("youtu.be")) {
        const id = getYtId(url);
        if (id) {
          replacement = createYtElement(id);
        }
      }
      if (!replacement && localStorage.getItem("cookiesAccepted") !== "all") {
        replacement = createLinkElement(url);
      }
    }
    origs.push(orig);
    replacements.push(replacement);
  }
  origs.forEach((orig, i) => {
    str = str.replace(orig, replacements[i]);
  });
  return str;
};
const getYtId = url => {
  const regExp = /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#&?]*).*/;
  const id = url.match(regExp);
  return (id && id[1]) || null;
};
const createYtElement = id => {
  return `<a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer" class="yt-wrapper">
  <img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" alt="YouTube Video" />
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 721"  xmlns:v="https://vecta.io/nano"><path fill="#fff" d="M407,493l276-143L407,206V493z"/><path opacity=".12" fill="#420000" d="M407,206l242,161.6l34-17.6L407,206z"/><linearGradient id="A" gradientUnits="userSpaceOnUse" x1="512.5" y1="1.3" x2="512.5" y2="719.8"><stop offset="0" stop-color="#e52d27"/><stop offset="1" stop-color="#bf171d"/></linearGradient><path fill="url(#A)" d="M1013 156.3s-10-70.4-40.6-101.4C933.6 14.2 890 14 870.1 11.6 727.1 1.3 512.7 1.3 512.7 1.3h-.4s-214.4 0-357.4 10.3C135 14 91.4 14.2 52.6 54.9 22 85.9 12 156.3 12 156.3S1.8 238.9 1.8 321.6v77.5C1.8 481.8 12 564.4 12 564.4s10 70.4 40.6 101.4c38.9 40.7 89.9 39.4 112.6 43.7 81.7 7.8 347.3 10.3 347.3 10.3s214.6-.3 357.6-10.7c20-2.4 63.5-2.6 102.3-43.3 30.6-31 40.6-101.4 40.6-101.4s10.2-82.7 10.2-165.3v-77.5c0-82.7-10.2-165.3-10.2-165.3zM407 493V206l276 144-276 143z"/></svg>
</a>`;
};
const createLinkElement = url => {
  return `<a href="${url}" target="_blank" rel="noopener noreferrer">
  Hier geht es zum externen Inhalt.
</a>`;
};
