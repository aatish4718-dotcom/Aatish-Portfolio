/* Design work rendered from add/ — every PDF page is a picture, so a
   brochure reads as a brochure. Multi-page artefacts stay one piece.
   Titles are read off the artwork; edit any `title` here to change the site. */
const DESIGN_DATA = [
  {
    slug: "brochures", name: "Brochures & Publications",
    count: 8, pages: 71,
    items: [
      { title: "Photography Portfolio — Book", n: 38, w: 1132, h: 1600,
        pages: [{t:"design/photography-portfolio-book/01-t.jpg",f:"design/photography-portfolio-book/01.jpg",w:1132,h:1600}, {t:"design/photography-portfolio-book/02-t.jpg",f:"design/photography-portfolio-book/02.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/03-t.jpg",f:"design/photography-portfolio-book/03.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/04-t.jpg",f:"design/photography-portfolio-book/04.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/05-t.jpg",f:"design/photography-portfolio-book/05.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/06-t.jpg",f:"design/photography-portfolio-book/06.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/07-t.jpg",f:"design/photography-portfolio-book/07.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/08-t.jpg",f:"design/photography-portfolio-book/08.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/09-t.jpg",f:"design/photography-portfolio-book/09.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/10-t.jpg",f:"design/photography-portfolio-book/10.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/11-t.jpg",f:"design/photography-portfolio-book/11.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/12-t.jpg",f:"design/photography-portfolio-book/12.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/13-t.jpg",f:"design/photography-portfolio-book/13.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/14-t.jpg",f:"design/photography-portfolio-book/14.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/15-t.jpg",f:"design/photography-portfolio-book/15.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/16-t.jpg",f:"design/photography-portfolio-book/16.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/17-t.jpg",f:"design/photography-portfolio-book/17.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/18-t.jpg",f:"design/photography-portfolio-book/18.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/19-t.jpg",f:"design/photography-portfolio-book/19.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/20-t.jpg",f:"design/photography-portfolio-book/20.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/21-t.jpg",f:"design/photography-portfolio-book/21.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/22-t.jpg",f:"design/photography-portfolio-book/22.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/23-t.jpg",f:"design/photography-portfolio-book/23.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/24-t.jpg",f:"design/photography-portfolio-book/24.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/25-t.jpg",f:"design/photography-portfolio-book/25.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/26-t.jpg",f:"design/photography-portfolio-book/26.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/27-t.jpg",f:"design/photography-portfolio-book/27.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/28-t.jpg",f:"design/photography-portfolio-book/28.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/29-t.jpg",f:"design/photography-portfolio-book/29.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/30-t.jpg",f:"design/photography-portfolio-book/30.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/31-t.jpg",f:"design/photography-portfolio-book/31.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/32-t.jpg",f:"design/photography-portfolio-book/32.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/33-t.jpg",f:"design/photography-portfolio-book/33.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/34-t.jpg",f:"design/photography-portfolio-book/34.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/35-t.jpg",f:"design/photography-portfolio-book/35.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/36-t.jpg",f:"design/photography-portfolio-book/36.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/37-t.jpg",f:"design/photography-portfolio-book/37.jpg",w:1600,h:1132}, {t:"design/photography-portfolio-book/38-t.jpg",f:"design/photography-portfolio-book/38.jpg",w:1132,h:1600}] },
      { title: "Fireman Training — Career Brochure", n: 2, w: 1600, h: 1132,
        pages: [{t:"design/fireman-training-brochure/01-t.jpg",f:"design/fireman-training-brochure/01.jpg",w:1600,h:1132}, {t:"design/fireman-training-brochure/02-t.jpg",f:"design/fireman-training-brochure/02.jpg",w:1600,h:1132}] },
      { title: "NIUA @ WUF11 — Conference Brochure", n: 19, w: 1132, h: 1600,
        pages: [{t:"design/wuf-brochure/01-t.jpg",f:"design/wuf-brochure/01.jpg",w:1132,h:1600}, {t:"design/wuf-brochure/02-t.jpg",f:"design/wuf-brochure/02.jpg",w:1600,h:1132}, {t:"design/wuf-brochure/03-t.jpg",f:"design/wuf-brochure/03.jpg",w:1600,h:1132}, {t:"design/wuf-brochure/04-t.jpg",f:"design/wuf-brochure/04.jpg",w:1600,h:1132}, {t:"design/wuf-brochure/05-t.jpg",f:"design/wuf-brochure/05.jpg",w:1600,h:1132}, {t:"design/wuf-brochure/06-t.jpg",f:"design/wuf-brochure/06.jpg",w:1600,h:1132}, {t:"design/wuf-brochure/07-t.jpg",f:"design/wuf-brochure/07.jpg",w:1600,h:1132}, {t:"design/wuf-brochure/08-t.jpg",f:"design/wuf-brochure/08.jpg",w:1600,h:1132}, {t:"design/wuf-brochure/09-t.jpg",f:"design/wuf-brochure/09.jpg",w:1600,h:1132}, {t:"design/wuf-brochure/10-t.jpg",f:"design/wuf-brochure/10.jpg",w:1600,h:1132}, {t:"design/wuf-brochure/11-t.jpg",f:"design/wuf-brochure/11.jpg",w:1600,h:1132}, {t:"design/wuf-brochure/12-t.jpg",f:"design/wuf-brochure/12.jpg",w:1600,h:1132}, {t:"design/wuf-brochure/13-t.jpg",f:"design/wuf-brochure/13.jpg",w:1600,h:1132}, {t:"design/wuf-brochure/14-t.jpg",f:"design/wuf-brochure/14.jpg",w:1600,h:1132}, {t:"design/wuf-brochure/15-t.jpg",f:"design/wuf-brochure/15.jpg",w:1600,h:1132}, {t:"design/wuf-brochure/16-t.jpg",f:"design/wuf-brochure/16.jpg",w:1600,h:1132}, {t:"design/wuf-brochure/17-t.jpg",f:"design/wuf-brochure/17.jpg",w:1600,h:1132}, {t:"design/wuf-brochure/18-t.jpg",f:"design/wuf-brochure/18.jpg",w:1600,h:1132}, {t:"design/wuf-brochure/19-t.jpg",f:"design/wuf-brochure/19.jpg",w:1132,h:1600}] },
      { title: "AIILSG Rajasthan — 100 Years", n: 8, w: 1131, h: 1600,
        pages: [{t:"design/final-brochure-print/01-t.jpg",f:"design/final-brochure-print/01.jpg",w:1131,h:1600}, {t:"design/final-brochure-print/02-t.jpg",f:"design/final-brochure-print/02.jpg",w:1131,h:1600}, {t:"design/final-brochure-print/03-t.jpg",f:"design/final-brochure-print/03.jpg",w:1131,h:1600}, {t:"design/final-brochure-print/04-t.jpg",f:"design/final-brochure-print/04.jpg",w:1131,h:1600}, {t:"design/final-brochure-print/05-t.jpg",f:"design/final-brochure-print/05.jpg",w:1131,h:1600}, {t:"design/final-brochure-print/06-t.jpg",f:"design/final-brochure-print/06.jpg",w:1131,h:1600}, {t:"design/final-brochure-print/07-t.jpg",f:"design/final-brochure-print/07.jpg",w:1131,h:1600}, {t:"design/final-brochure-print/08-t.jpg",f:"design/final-brochure-print/08.jpg",w:1131,h:1600}] },
      { title: "Sanitary Inspector Diploma — Admissions Open", n: 1, w: 720, h: 1080,
        pages: [{t:"design/pamphlet-01/01-t.jpg",f:"design/pamphlet-01/01.jpg",w:720,h:1080}] },
      { title: "AIILSG Admission Notice 2025–26", n: 1, w: 1236, h: 1600,
        pages: [{t:"design/pamphlet-02/01-t.jpg",f:"design/pamphlet-02/01.jpg",w:1236,h:1600}] },
      { title: "Fireman Course — Admission Notice", n: 1, w: 1236, h: 1600,
        pages: [{t:"design/pamphlet-03/01-t.jpg",f:"design/pamphlet-03/01.jpg",w:1236,h:1600}] },
      { title: "Swachh Bharat Mission 2.0 — Certificate", n: 1, w: 1440, h: 900,
        pages: [{t:"design/pamphlet-04/01-t.jpg",f:"design/pamphlet-04/01.jpg",w:1440,h:900}] },
    ]
  },
  {
    slug: "banners", name: "Banners & Posters",
    count: 13, pages: 13,
    items: [
      { title: "Free Health Check-up Camp — CSR Initiative", n: 1, w: 1600, h: 800,
        pages: [{t:"design/banner-01/01-t.jpg",f:"design/banner-01/01.jpg",w:1600,h:800}] },
      { title: "Fire Safety Pledge & Student Meet", n: 1, w: 1600, h: 800,
        pages: [{t:"design/banner-02/01-t.jpg",f:"design/banner-02/01.jpg",w:1600,h:800}] },
      { title: "Fireman Career Opportunity — Banner", n: 1, w: 1600, h: 800,
        pages: [{t:"design/banner-03/01-t.jpg",f:"design/banner-03/01.jpg",w:1600,h:800}] },
      { title: "Fireman & Sanitary Inspector Courses — Notice", n: 1, w: 1350, h: 903,
        pages: [{t:"design/banners-5/01-t.jpg",f:"design/banners-5/01.jpg",w:1350,h:903}] },
      { title: "Fireman & Sanitary Inspector Courses — 3×2 ft", n: 1, w: 1350, h: 903,
        pages: [{t:"design/banners-6/01-t.jpg",f:"design/banners-6/01.jpg",w:1350,h:903}] },
      { title: "Fireman Training Convocation — Light", n: 1, w: 1440, h: 810,
        pages: [{t:"design/aiilsg-fireman-convocation-banner/01-t.jpg",f:"design/aiilsg-fireman-convocation-banner/01.jpg",w:1440,h:810}] },
      { title: "Fireman Training Convocation — Dark", n: 1, w: 1440, h: 810,
        pages: [{t:"design/aiilsg-jodhpur-fireman-convocation/01-t.jpg",f:"design/aiilsg-jodhpur-fireman-convocation/01.jpg",w:1440,h:810}] },
      { title: "Street Vendor Survey — Enumerator Recruitment", n: 1, w: 900, h: 713,
        pages: [{t:"design/aiilsg-jodhpur-walk-in-bharti/01-t.jpg",f:"design/aiilsg-jodhpur-walk-in-bharti/01.jpg",w:900,h:713}] },
      { title: "Survey Staff — Requirement Notice", n: 1, w: 768, h: 1116,
        pages: [{t:"design/aiilsg-requirement-notice/01-t.jpg",f:"design/aiilsg-requirement-notice/01.jpg",w:768,h:1116}] },
      { title: "AIR 1 — Achievement Poster", n: 1, w: 1131, h: 1600,
        pages: [{t:"design/graduation-poster/01-t.jpg",f:"design/graduation-poster/01.jpg",w:1131,h:1600}] },
      { title: "Street Vendor Survey — Pamphlet", n: 1, w: 900, h: 1275,
        pages: [{t:"design/street-vendor-survey-pamphlet/01-t.jpg",f:"design/street-vendor-survey-pamphlet/01.jpg",w:900,h:1275}] },
      { title: "Business Card — AIILSG", n: 1, w: 788, h: 450,
        pages: [{t:"design/business-card/01-t.jpg",f:"design/business-card/01.jpg",w:788,h:450}] },
    ]
  },
  {
    slug: "social", name: "Social Media",
    count: 18, pages: 18,
    items: [
      { title: "Course Registration — Register Now", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-post-01/01-t.jpg",f:"design/social-post-01/01.jpg",w:1080,h:1350}] },
      { title: "Training Programme — Group Session", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-post-02/01-t.jpg",f:"design/social-post-02/01.jpg",w:1080,h:1350}] },
      { title: "Felicitation Ceremony", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-post-03/01-t.jpg",f:"design/social-post-03/01.jpg",w:1080,h:1350}] },
      { title: "International Yoga Day 2026", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-post-04/01-t.jpg",f:"design/social-post-04/01.jpg",w:1080,h:1350}] },
      { title: "World Population Day 2026", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-post-05/01-t.jpg",f:"design/social-post-05/01.jpg",w:1080,h:1350}] },
      { title: "World Nature Conservation Day 2026", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-post-06/01-t.jpg",f:"design/social-post-06/01.jpg",w:1080,h:1350}] },
      { title: "Swachh Survekshan — Awareness Set", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-post-07/01-t.jpg",f:"design/social-post-07/01.jpg",w:1080,h:1350}] },
      { title: "Adopt Cloth Bags, Save the Environment", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-post-08/01-t.jpg",f:"design/social-post-08/01.jpg",w:1080,h:1350}] },
      { title: "Use the Dustbin — Anti-Littering", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-post-09/01-t.jpg",f:"design/social-post-09/01.jpg",w:1080,h:1350}] },
      { title: "Holika Dahan — Greetings", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-post-10/01-t.jpg",f:"design/social-post-10/01.jpg",w:1080,h:1350}] },
      { title: "What Is Single-Use Plastic?", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-post-11/01-t.jpg",f:"design/social-post-11/01.jpg",w:1080,h:1350}] },
      { title: "New Year Greetings — Save the Environment", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-post-12/01-t.jpg",f:"design/social-post-12/01.jpg",w:1080,h:1350}] },
      { title: "MSK Centre — Reduce, Reuse, Recycle", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-post-13/01-t.jpg",f:"design/social-post-13/01.jpg",w:1080,h:1350}] },
      { title: "Clean Food Stalls, Clean City", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-post-14/01-t.jpg",f:"design/social-post-14/01.jpg",w:1080,h:1350}] },
      { title: "Cloth Bag Distribution Drive", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-post-15/01-t.jpg",f:"design/social-post-15/01.jpg",w:1080,h:1350}] },
      { title: "Refuse Single-Use Plastic — Awareness Drive", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-post-16/01-t.jpg",f:"design/social-post-16/01.jpg",w:1080,h:1350}] },
      { title: "Sanitation Workers — Capacity Building", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-post-17/01-t.jpg",f:"design/social-post-17/01.jpg",w:1080,h:1350}] },
      { title: "पॉलीथीन छोड़ो, पर्यावरण जोड़ो — School Outreach", n: 1, w: 1080, h: 1350,
        pages: [{t:"design/social-18/01-t.jpg",f:"design/social-18/01.jpg",w:1080,h:1350}] },
    ]
  },
  {
    group: "College & Field Documents",
    items: [
    {
      title: "Har Ghar Tiranga \u2014 Activities Report",
      pages: [
        { t:"design/har-ghar-tiranga/01-t.jpg", f:"design/har-ghar-tiranga/01.jpg", w:1600, h:900 },
        { t:"design/har-ghar-tiranga/02-t.jpg", f:"design/har-ghar-tiranga/02.jpg", w:1600, h:900 },
        { t:"design/har-ghar-tiranga/03-t.jpg", f:"design/har-ghar-tiranga/03.jpg", w:1600, h:900 },
        { t:"design/har-ghar-tiranga/04-t.jpg", f:"design/har-ghar-tiranga/04.jpg", w:1600, h:900 },
        { t:"design/har-ghar-tiranga/05-t.jpg", f:"design/har-ghar-tiranga/05.jpg", w:1600, h:900 },
        { t:"design/har-ghar-tiranga/06-t.jpg", f:"design/har-ghar-tiranga/06.jpg", w:1600, h:900 },
        { t:"design/har-ghar-tiranga/07-t.jpg", f:"design/har-ghar-tiranga/07.jpg", w:1600, h:900 },
        { t:"design/har-ghar-tiranga/08-t.jpg", f:"design/har-ghar-tiranga/08.jpg", w:1600, h:900 },
        { t:"design/har-ghar-tiranga/09-t.jpg", f:"design/har-ghar-tiranga/09.jpg", w:1600, h:900 },
        { t:"design/har-ghar-tiranga/10-t.jpg", f:"design/har-ghar-tiranga/10.jpg", w:1600, h:900 },
        { t:"design/har-ghar-tiranga/11-t.jpg", f:"design/har-ghar-tiranga/11.jpg", w:1600, h:900 },
        { t:"design/har-ghar-tiranga/12-t.jpg", f:"design/har-ghar-tiranga/12.jpg", w:1600, h:900 },
        { t:"design/har-ghar-tiranga/13-t.jpg", f:"design/har-ghar-tiranga/13.jpg", w:1600, h:900 },
        { t:"design/har-ghar-tiranga/14-t.jpg", f:"design/har-ghar-tiranga/14.jpg", w:1600, h:900 }
      ]
    },
    {
      title: "Planning for Persons with Disabilities \u2014 Thesis",
      pages: [
        { t:"design/thesis-disability/01-t.jpg", f:"design/thesis-disability/01.jpg", w:1241, h:1754 },
        { t:"design/thesis-disability/02-t.jpg", f:"design/thesis-disability/02.jpg", w:1600, h:1132 },
        { t:"design/thesis-disability/03-t.jpg", f:"design/thesis-disability/03.jpg", w:1241, h:1754 },
        { t:"design/thesis-disability/04-t.jpg", f:"design/thesis-disability/04.jpg", w:1241, h:1754 },
        { t:"design/thesis-disability/05-t.jpg", f:"design/thesis-disability/05.jpg", w:1241, h:1754 },
        { t:"design/thesis-disability/06-t.jpg", f:"design/thesis-disability/06.jpg", w:1600, h:1132 },
        { t:"design/thesis-disability/07-t.jpg", f:"design/thesis-disability/07.jpg", w:1241, h:1754 },
        { t:"design/thesis-disability/08-t.jpg", f:"design/thesis-disability/08.jpg", w:1241, h:1754 },
        { t:"design/thesis-disability/09-t.jpg", f:"design/thesis-disability/09.jpg", w:1241, h:1754 },
        { t:"design/thesis-disability/10-t.jpg", f:"design/thesis-disability/10.jpg", w:1241, h:1754 },
        { t:"design/thesis-disability/11-t.jpg", f:"design/thesis-disability/11.jpg", w:1600, h:1132 },
        { t:"design/thesis-disability/12-t.jpg", f:"design/thesis-disability/12.jpg", w:1600, h:1132 },
        { t:"design/thesis-disability/13-t.jpg", f:"design/thesis-disability/13.jpg", w:1600, h:1132 },
        { t:"design/thesis-disability/14-t.jpg", f:"design/thesis-disability/14.jpg", w:1600, h:1132 }
      ]
    },
    {
      title: "Kathputli Colony \u2014 Draft Report",
      pages: [
        { t:"design/kathputli-report/01-t.jpg", f:"design/kathputli-report/01.jpg", w:1241, h:1755 },
        { t:"design/kathputli-report/02-t.jpg", f:"design/kathputli-report/02.jpg", w:1241, h:1755 }
      ]
    },
    {
      title: "Land Pooling Policy, Zone L \u2014 Studio Sheets",
      pages: [
        { t:"design/land-pooling/01-t.jpg", f:"design/land-pooling/01.jpg", w:1400, h:982 },
        { t:"design/land-pooling/02-t.jpg", f:"design/land-pooling/02.jpg", w:1400, h:982 },
        { t:"design/land-pooling/03-t.jpg", f:"design/land-pooling/03.jpg", w:1400, h:982 },
        { t:"design/land-pooling/04-t.jpg", f:"design/land-pooling/04.jpg", w:1400, h:982 },
        { t:"design/land-pooling/05-t.jpg", f:"design/land-pooling/05.jpg", w:1400, h:982 },
        { t:"design/land-pooling/06-t.jpg", f:"design/land-pooling/06.jpg", w:1400, h:982 },
        { t:"design/land-pooling/07-t.jpg", f:"design/land-pooling/07.jpg", w:1400, h:982 },
        { t:"design/land-pooling/08-t.jpg", f:"design/land-pooling/08.jpg", w:1400, h:982 },
        { t:"design/land-pooling/09-t.jpg", f:"design/land-pooling/09.jpg", w:1400, h:982 },
        { t:"design/land-pooling/10-t.jpg", f:"design/land-pooling/10.jpg", w:1400, h:982 },
        { t:"design/land-pooling/11-t.jpg", f:"design/land-pooling/11.jpg", w:1400, h:982 },
        { t:"design/land-pooling/12-t.jpg", f:"design/land-pooling/12.jpg", w:1400, h:982 },
        { t:"design/land-pooling/13-t.jpg", f:"design/land-pooling/13.jpg", w:1400, h:982 },
        { t:"design/land-pooling/14-t.jpg", f:"design/land-pooling/14.jpg", w:1400, h:982 }
      ]
    },
    {
      title: "The Pandemic in Two Cities \u2014 Study",
      pages: [
        { t:"design/pandemic-study/01-t.jpg", f:"design/pandemic-study/01.jpg", w:1241, h:1754 },
        { t:"design/pandemic-study/02-t.jpg", f:"design/pandemic-study/02.jpg", w:1241, h:1754 },
        { t:"design/pandemic-study/03-t.jpg", f:"design/pandemic-study/03.jpg", w:1241, h:1754 }
      ]
    },
    {
      title: "Sector 21-A, Noida \u2014 Studio Sheets",
      pages: [
        { t:"design/studio-noida/01-t.jpg", f:"design/studio-noida/01.jpg", w:1400, h:959 },
        { t:"design/studio-noida/02-t.jpg", f:"design/studio-noida/02.jpg", w:1400, h:959 },
        { t:"design/studio-noida/03-t.jpg", f:"design/studio-noida/03.jpg", w:1400, h:959 },
        { t:"design/studio-noida/04-t.jpg", f:"design/studio-noida/04.jpg", w:1400, h:959 },
        { t:"design/studio-noida/05-t.jpg", f:"design/studio-noida/05.jpg", w:1400, h:959 },
        { t:"design/studio-noida/06-t.jpg", f:"design/studio-noida/06.jpg", w:1400, h:959 },
        { t:"design/studio-noida/07-t.jpg", f:"design/studio-noida/07.jpg", w:1400, h:959 },
        { t:"design/studio-noida/08-t.jpg", f:"design/studio-noida/08.jpg", w:1400, h:959 },
        { t:"design/studio-noida/09-t.jpg", f:"design/studio-noida/09.jpg", w:1400, h:959 },
        { t:"design/studio-noida/10-t.jpg", f:"design/studio-noida/10.jpg", w:1400, h:959 }
      ]
    },
    {
      title: "Physical Infrastructure & Water \u2014 Studio Sheets",
      pages: [
        { t:"design/studio-water/01-t.jpg", f:"design/studio-water/01.jpg", w:1400, h:983 },
        { t:"design/studio-water/02-t.jpg", f:"design/studio-water/02.jpg", w:1400, h:983 },
        { t:"design/studio-water/03-t.jpg", f:"design/studio-water/03.jpg", w:1400, h:983 },
        { t:"design/studio-water/04-t.jpg", f:"design/studio-water/04.jpg", w:1400, h:983 },
        { t:"design/studio-water/05-t.jpg", f:"design/studio-water/05.jpg", w:1400, h:983 },
        { t:"design/studio-water/06-t.jpg", f:"design/studio-water/06.jpg", w:1400, h:983 },
        { t:"design/studio-water/07-t.jpg", f:"design/studio-water/07.jpg", w:1400, h:983 },
        { t:"design/studio-water/08-t.jpg", f:"design/studio-water/08.jpg", w:1400, h:983 },
        { t:"design/studio-water/09-t.jpg", f:"design/studio-water/09.jpg", w:1400, h:983 }
      ]
    }
    ]
  }
];
const DESIGN_TOTAL = 39;
