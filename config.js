/* ============================================================
   CLASSIC TEMPLATE — CLIENT CONFIG
   ------------------------------------------------------------
   Everything a client personalises lives in this one object.
   Fill it in, save, deploy. No other file needs editing.
   ============================================================ */

const INVITE_CONFIG = {
  /* ---------- Couple ---------- */
  couple: {
    name1: "Ayesha Rahman",
    name2: "Rayhan Chowdhury",
    initials: "A&R",            // shown in the gold seal
    hashtag: "#AyeshaAndRayhan",
  },

  /* ---------- Ceremony / occasion ---------- */
  // Wedding datetime — local time. Countdown, calendar links and the
  // displayed date all derive from this one value.
  weddingDateTime: "2027-01-24T17:00:00+06:00",
  dateDisplay: "Sunday, 24 January 2027",
  city: "Dhaka, Bangladesh",

  /* ---------- Opening blessing ---------- */
  // Any one-line blessing, or replace with a quote. Leave "" to hide.
  blessing: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",

  /* ---------- Families / welcome ---------- */
  welcome: {
    eyebrow: "Together with their families",
    parents1: "Daughter of Mr. Anwar Rahman & Mrs. Shirin Rahman",
    parents2: "Son of Mr. Kamal Chowdhury & Mrs. Nadia Chowdhury",
    inviteLine:
      "request the honour of your presence at their wedding celebration, as they begin a beautiful new chapter together.",
  },

  /* ---------- Countdown ---------- */
  countdownNote: "until we say \u201CYes\u201D \u2014 In Shaa Allah",

  /* ---------- Events ---------- */
  // Each event becomes one card. Add or remove entries freely.
  // "mapQuery" is what gets searched on Google Maps (name or lat,lng).
  // For the calendar button to work, each event needs date (YYYY-MM-DD),
  // start/end (HH:MM, 24h, venue local time) and a timezone.
  events: [
    {
      tag: "Wedding Ceremony",
      name: "Akd & Reception",
      tagline: "followed by dinner & blessings",
      date: "Sunday, 24 January 2027",
      time: "5:00 PM onwards",
      venue: "The Grand Ballroom, Le Méridien Dhaka",
      address: "79/B Road No. 7, Banani, Dhaka 1213",
      mapQuery: "Le Méridien Dhaka",
      calDate: "2027-01-24",
      calStart: "17:00",
      calEnd: "22:00",
      calTz: "Asia/Dhaka",
    },
  ],

  /* ---------- Venue / map ---------- */
  // Shown in the map section (usually your main event).
  venue: {
    name: "The Grand Ballroom, Le Méridien Dhaka",
    address: "79/B Road No. 7, Banani, Dhaka 1213",
    mapQuery: "Le Méridien Dhaka",
    mapZoom: 15,
  },

  /* ---------- Closing ---------- */
  closing: "We can\u2019t wait to celebrate with you",
  credit: "Crafted with \u2665 \u2014 Your Studio Name",
};

/* Export for reuse; safe to ignore in the browser. */
if (typeof module !== "undefined") {
  module.exports = INVITE_CONFIG;
}
