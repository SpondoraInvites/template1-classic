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

  /* ---------- Bangla (বাংলা) ----------
     Mirror of the client-visible content, shown when the visitor switches
     to Bangla via the EN/বাং toggle (top-right). Objects merge over the
     English values above key by key — any field you omit falls back to its
     English value. Arrays (events) replace wholesale. Delete this whole
     block to hide the toggle and ship an English-only invite.
     Tip: write numerals (dates, times, addresses) in Bangla digits here —
     generated numerals (countdown, footer date) convert automatically. */
  bn: {
    couple: {
      name1: "আয়েশা রহমান",
      name2: "রায়হান চৌধুরী",
    },
    dateDisplay: "রবিবার, ২৪ জানুয়ারি ২০২৭",
    city: "ঢাকা, বাংলাদেশ",

    welcome: {
      eyebrow: "উভয় পরিবারের আন্তরিক আমন্ত্রণে",
      parents1: "কন্যা — জনাব আনোয়ার রহমান ও মিসেস শিরিন রহমান",
      parents2: "পুত্র — জনাব কামাল চৌধুরী ও মিসেস নাদিয়া চৌধুরী",
      inviteLine:
        "আপনাদের সৌভাগ্য ও আশীর্বাদে তাঁরা শুরু করতে যাচ্ছে জীবনের নতুন অধ্যায় — সেই আয়োজনে আপনাদের আন্তরিক আমন্ত্রণ।",
    },

    countdownNote: "একসাথে “হ্যাঁ” বলার সেই মুহূর্ত পর্যন্ত — ইনশাআল্লাহ",

    events: [
      {
        tag: "বিবাহ অনুষ্ঠান",
        name: "আকদ ও রিসেপশন",
        tagline: "এরপর ডিনার ও দোয়া",
        date: "রবিবার, ২৪ জানুয়ারি ২০২৭",
        time: "বিকাল ৫টা থেকে",
        venue: "দ্য গ্র্যান্ড বলরুম, লে মেরিডিয়েন ঢাকা",
        address: "৭৯/বি রোড নং ৭, বনানী, ঢাকা ১২১৩",
        mapQuery: "Le Méridien Dhaka",
        calDate: "2027-01-24",
        calStart: "17:00",
        calEnd: "22:00",
        calTz: "Asia/Dhaka",
      },
    ],

    venue: {
      name: "দ্য গ্র্যান্ড বলরুম, লে মেরিডিয়েন ঢাকা",
      address: "৭৯/বি রোড নং ৭, বনানী, ঢাকা ১২১৩",
    },

    closing: "আপনাদের সঙ্গে উদ্‌যাপনে অধীর আগ্রহে অপেক্ষায় আছি",
    credit: "\u2665 দিয়ে নির্মিত — Your Studio Name",
  },
};

/* Export for reuse; safe to ignore in the browser. */
if (typeof module !== "undefined") {
  module.exports = INVITE_CONFIG;
}
