/**
 * All editable copy for skaltaipei.org.tw lives here.
 * Sources: design-brief.md, content/ASSETS.md, the OpenDesign Direction C mockup,
 * and the club's Facebook posts. Edit text here — never inside components.
 */

export const site = {
  name: "Skål International Taipei",
  shortName: "Skål Taipei",
  url: "https://skaltaipei.org.tw",
  title: "Skål International Taipei — Where Taipei's tourism leaders meet",
  description:
    "Skål International Taipei, the Taipei chapter (est. 1970) of Skål International, the world's largest professional network of travel and tourism leaders. Doing Business Among Friends.",
  email: "skalinternationaltaipei@gmail.com",
  facebook: "https://www.facebook.com/SkalInternationalTaipei.Since1970/",
  global: "https://skal.org/",
  clubNo: 347,
  founded: 1970,
  ogImage: "/images/brand/skal-taipei-banner-social.png",
} as const;

export const nav = [
  { href: "#about", label: "About" },
  { href: "#events", label: "Events" },
  { href: "#programmes", label: "What we do" },
  { href: "#why-join", label: "Why join" },
  { href: "#membership", label: "Membership" },
  { href: "#contact", label: "Contact" },
] as const;

export const hero = {
  topLeft: "Taipei chapter · est. 1970 · Skål International",
  topRight: "Club No. 347 · Doing Business Among Friends",
  /** `em` is rendered in italic gold. */
  title: { lead: "Where Taipei's tourism leaders", em: "meet" },
  lead:
    "A monthly lunch table of hotel GMs, airline and travel executives, tourism-board staff and ambassadors — part of the world's largest network of travel professionals.",
  primaryCta: { label: "Join a lunch meeting", href: "#events" },
  secondaryCta: { label: "Become a member", href: "#membership" },
  /**
   * Optional one-liner under the CTAs. Leave empty ("") to hide.
   * Kept manual on purpose: it should only ever show a confirmed date.
   */
  nextLine: "Next: Wed 14 Oct · 12:00 · S-Aura Hotel",
  photo: {
    caption: "General Meeting · Radium Kagaya, Beitou",
    date: "Jan 2026",
    alt: "Members and ambassadors of Skål International Taipei at the January 2026 General Meeting, Radium Kagaya, Beitou",
    mobileAlt: "President Windy Yang, wearing the chain of office, raising a toast with members",
  },
};

export const about = {
  no: "01 — About",
  title: "Every branch of travel, one table, since 1934",
  aside: "Skål · Taipei · Club 347",
  paragraphs: [
    "Skål International is the only professional association that brings together every sector of travel and tourism — hotels, airlines, tour operators, travel agencies, tourism boards, restaurants and events — in one room. Founded in 1934, it counts more than 12,000 members in over 100 countries.",
    "Skål International Taipei, Club No. 347, has been the Taiwan capital's chapter since 1970. Our members run the city's leading hotels and travel companies, sit on tourism boards, and represent embassies; the ambassadors of Saint Lucia, Belize, and Saint Vincent and the Grenadines are among us.",
    "The motto is \u201cDoing Business Among Friends\u201d — and it is taken literally. A Skålleague is a friend first: someone you toast with at a Wednesday lunch, visit in Tokyo or Perth, and call when a deal needs a trusted name on the other side.",
  ],
  stats: [
    { value: "1934", sup: "", label: "Skål International founded" },
    { value: "100", sup: "+", label: "Countries" },
    { value: "12,000", sup: "+", label: "Members worldwide" },
    { value: "1970", sup: "", label: "Taipei chapter founded" },
  ],
};

export const events = {
  no: "02 — Dispatches",
  title: "Current Events",
  rssLabel: "RSS",
  /** How many posts from content/facebook-feed.json to show. Layout is designed for 6. */
  count: 6,
  readMore: "Read on Facebook",
  emptyMark: "Skål!",
};

export const programmes = {
  no: "03 — Programmes",
  title: "What we do",
  aside: "Six standing programmes",
  items: [
    {
      title: "Monthly General Meetings",
      text: "Lunch, usually a Wednesday at noon, hosted at a member's hotel or restaurant — S-Aura Hotel, WINE-derful, Radium Kagaya, Howard Plaza, the Grand Hotel. A keynote, the Skål toast, and club business.",
      when: "Monthly · Wed 12:00–14:00",
    },
    {
      title: "World Tourism Day",
      text: "Added to the club calendar under President Sasaya in 2017: an annual forum with the Taiwan Tourism Bureau and industry partners on where travel in Taiwan goes next.",
      when: "Annual · 27 September",
    },
    {
      title: "Skål Taipei Toastmasters",
      text: "A chartered Toastmasters club sponsored by Skål Taipei — public speaking and leadership practice for members and friends, led by Charter President Mayumi Hu.",
      when: "Chartered club",
    },
    {
      title: "Young Skål",
      text: "Students and early-career professionals in tourism and hospitality join the network early — mentored by GMs and executives who once sat where they sit.",
      when: "Under 30",
    },
    {
      title: "Sustainability",
      text: "210 trees planted so far under the regional reforestation programme — the first atop Hotel Royal-Nikko Taipei — plus the Skål Sustainable Tourism Awards Taiwan selection and Tokyo exhibition.",
      when: "Reforestation · Awards",
      green: true,
    },
    {
      title: "International twinning",
      text: "The first joint agreement linking all Taiwan and Japan chapters — Taipei, Taichung and Kaohsiung with Tokyo, Osaka and Nagoya — and a twin club in Skål Cusco, Peru.",
      when: "Japan · Peru",
    },
  ],
  motto: "\u201cDoing Business Among Friends.\u201d",
  mottoNote: "The Skål motto, spoken at every toast since 1934",
};

export const whyJoin = {
  no: "04 — Why join",
  title: "The room you cannot book, only be invited into",
  aside: "Three reasons",
  benefits: [
    {
      no: "I",
      title: "A global network that answers",
      text: "Your membership is recognised by 12,000+ Skålleagues in 100+ countries. Visit a club abroad and you are hosted, not merely admitted.",
      points: [
        "Twinned with Tokyo, Osaka, Nagoya and Skål Cusco",
        "Skål Asia and World Congress delegations",
        "Members hosted in Perth, Vancouver and Pretoria this year",
      ],
    },
    {
      no: "II",
      title: "Access at the top of the industry",
      text: "Lunch monthly with hotel GMs, airline and agency executives, the Taipei Hotel Association leadership, tourism-board officials and serving ambassadors.",
      points: [
        "Keynotes from artists, diplomats and industry leaders",
        "Venues rotate through member hotels and restaurants",
        "Free for members; guests pay a per-meeting fee",
      ],
    },
    {
      no: "III",
      title: "A platform to give something back",
      text: "Lead a reforestation drive, judge the Sustainable Tourism Awards, mentor Young Skål, or take a board role — and be recognised for it regionally.",
      points: [
        "Skål Asia Personality of the Year awarded to a Taipei member",
        "Charity partnerships including Andrew Charity Association",
        "Board and programme-chair roles open to members",
      ],
    },
  ],
  /**
   * Set `quote` to a real member testimonial to show the pull-quote block.
   * While `quote` is empty the whole block is hidden (no placeholder ships to production).
   */
  testimonial: {
    quote: "",
    by: "",
    photoAlt: "An ambassador signing the Skål International Taipei club pennant at a 2026 meeting",
  },
};

export const membership = {
  no: "05 — Membership",
  title: "Come as a guest. Stay as a Skålleague.",
  aside: "Guest → Apply → Induction",
  whoTitle: "Who qualifies",
  who: "Membership is open to professionals actively working in travel, tourism and hospitality — typically owners, general managers, directors and senior executives. Young Skål welcomes students and professionals under 30.",
  sectors: [
    "Hotels",
    "Airlines",
    "Travel agencies",
    "Tour operators",
    "Tourism boards",
    "F&B",
    "MICE",
    "Education",
    "Diplomatic missions",
  ],
  steps: [
    {
      title: "Attend a lunch meeting as a guest",
      text: "Email us or register through the event form. Meet the members, hear the keynote, join the toast. A guest fee covers lunch; attire is business casual.",
    },
    {
      title: "Apply, with a member as your sponsor",
      text: "Membership Director Doi Yasunori walks you through the application and confirms your eligibility with the board.",
    },
    {
      title: "Be inducted at a General Meeting",
      text: "You receive your certificate and pin in front of the club — as Ambassador Katherine Meighan of Belize did in January 2026.",
    },
  ],
  feeNote: "please contact us for the current annual dues and the guest-lunch fee.",
  cta: {
    label: "Enquire about membership",
    href: `mailto:${site.email}?subject=${encodeURIComponent("Membership enquiry — Skål International Taipei")}`,
  },
};

export const contact = {
  title: { lead: "Skål! We'll save you", em: "a seat." },
  links: [
    { label: "Email", value: site.email, href: `mailto:${site.email}`, external: false },
    { label: "Facebook", value: "Skål International Taipei · Since 1970", href: site.facebook, external: true },
    { label: "Global", value: "skal.org — Skål International", href: site.global, external: true },
  ],
  copyright: `© Skål International Taipei · Club No. ${site.clubNo} · est. ${site.founded}`,
};
