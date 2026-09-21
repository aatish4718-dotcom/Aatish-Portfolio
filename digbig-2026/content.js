/* ============================================================================
   CONTENT MODEL — DIGBIG STUDIO
   ----------------------------------------------------------------------------
   Everything the site says lives here. Two hard rules were followed while
   writing it:

   1. Nothing is invented. Every client, place, date, role and institution
      below is taken from the CV, from the artwork itself, or from the film
      titles already published on the channel. Where a date or a location is
      not known it is simply absent — no placeholder years, no guessed cities.

   2. Curation is editorial, not factual. The photography story titles and the
      short descriptions are written by reading the 166 photographs; they group
      and name real frames, they do not claim anything about them that the
      picture does not show.
   ========================================================================== */

const SITE = {
  name: 'DIGBIG STUDIO',
  person: 'Aatish Kumar',
  role: ['Urban Planner', 'Visual Storyteller'],
  base: 'Jodhpur, Rajasthan',
  coords: ['26°14′ N', '73°01′ E'],
  email: 'aatish4718@gmail.com',
  /* The telephone number is deliberately not published. Email, Instagram,
     LinkedIn and the CV are the contact routes. */
  instagram: 'https://www.instagram.com/mad_zombie_/',
  linkedin: 'https://www.linkedin.com/in/aatish4718/',
  cv: 'images/Aatish_Kumar_CV_2026.pdf',
  lede: 'I work between maps, cities, images and moving stories.',
  intro: 'Urban planning, visual communication, photography and film — connected through one way of seeing.'
};

/* ---------------------------------------------------------------------------
   PHOTOGRAPHY — 13 stories cut from the 166-frame archive.
   `refs` are "<category-slug>/<1-based frame number>" into PORTFOLIO_DATA.
   `weight` drives the asymmetric index: 'lg' gets a large preview, 'sm' small.
   ------------------------------------------------------------------------ */
const PHOTO_STORIES = [
  {
    slug: 'the-blue-city', title: 'THE BLUE CITY', weight: 'lg',
    sub: 'Jodhpur', tags: 'City / Rooftops / Ramparts',
    place: 'Jodhpur, Rajasthan',
    note: 'A city read from above. Indigo house-blocks packed to the wall line, the fort holding the high ground, a clock tower standing in for a centre. The same skyline photographed until it stopped being a view and became a plan.',
    refs: ['heritage/2', 'cityscape/3', 'cityscape/4', 'heritage/9', 'cityscape/1', 'heritage/5']
  },
  {
    slug: 'stone-and-shadow', title: 'STONE AND SHADOW', weight: 'sm',
    sub: 'Monument', tags: 'Architecture / Sandstone / Symmetry',
    note: 'Domes, arcades and fluted columns, photographed for the geometry rather than the guidebook. Bodies enter the frame at the scale the architecture intended: very small.',
    refs: ['heritage/1', 'heritage/4', 'heritage/7', 'heritage/8', 'reflection/2', 'heritage/10', 'heritage/12', 'heritage/3', 'heritage/6', 'heritage/11']
  },
  {
    slug: 'lines', title: 'LINES', weight: 'lg',
    sub: 'Structure', tags: 'Stair / Geometry / Section',
    note: 'Staircases as drawings. Spiral, switchback, escalator, ladder — each one a section cut through a building, exposed and photographed flat.',
    refs: ['staircase/2', 'staircase/3', 'staircase/6', 'staircase/1', 'staircase/5', 'staircase/8', 'staircase/4', 'staircase/7']
  },
  {
    slug: 'between-streets', title: 'BETWEEN STREETS', weight: 'sm',
    sub: 'People', tags: 'Portrait / Everyday life',
    note: 'Faces met at working distance — a boy against a painted wall, two children over one notebook, hands, turbans, weather. Mostly monochrome, because the light was already doing the work.',
    refs: ['portraiture/11', 'portraiture/12', 'portraiture/5', 'portraiture/7', 'portraiture/8', 'portraiture/16', 'portraiture/10', 'portraiture/14', 'portraiture/6', 'portraiture/15', 'portraiture/9', 'portraiture/17']
  },
  {
    slug: 'set-and-subject', title: 'SET AND SUBJECT', weight: 'lg',
    sub: 'Directed', tags: 'Fashion / Stage / Portrait',
    note: 'Work made with intent: a classical dancer held mid-turn in red, garments built from salvaged cloth, a single hard key light against black. The only frames here where the photographer decided everything.',
    refs: ['fashion/2', 'portraiture/3', 'fashion/4', 'fashion/11', 'fashion/1', 'fashion/7', 'fashion/8', 'fashion/10', 'fashion/6', 'fashion/5', 'fashion/9', 'fashion/12', 'fashion/3', 'portraiture/1', 'portraiture/2']
  },
  {
    slug: 'after-dark', title: 'AFTER DARK', weight: 'sm',
    /* The cover is the 8th frame of the sequence, not the 1st. `cover` only
       changes the preview shown in indexes; the story itself still opens on
       refs[0] and runs in its intended order. */
    cover: 'music-artists/1',
    sub: 'Night', tags: 'Long exposure / Stage light',
    note: 'What the city does once the sun has stopped lighting it: sodium trails on a carriageway, a grill throwing flame, wet asphalt turning neon into paint, and a stage where the only subject left is a silhouette against a par can.',
    refs: ['long-exposure/1', 'reflection/1', 'long-exposure/2', 'cityscape/2', 'long-exposure/3', 'long-exposure/4', 'music-artists/4', 'music-artists/1', 'music-artists/3', 'music-artists/2', 'music-artists/5', 'music-artists/6']
  },
  {
    slug: 'the-night-sky', title: 'THE NIGHT SKY', weight: 'lg',
    sub: 'Astronomy', tags: 'Star trail / Lunar / Eclipse',
    note: 'Long nights on a fixed mount. Circumpolar trails, the Milky Way over a ridge, a crescent, and a partial eclipse followed frame by frame until the bite closed.',
    refs: ['astrophotography/1', 'astrophotography/2', 'astrophotography/5', 'astrophotography/6', 'astrophotography/3', 'astrophotography/4', 'astrophotography/7', 'astrophotography/8', 'astrophotography/9', 'astrophotography/10', 'astrophotography/11', 'astrophotography/12', 'astrophotography/13']
  },
  {
    slug: 'high-ground', title: 'HIGH GROUND', weight: 'sm',
    sub: 'Mountain', tags: 'Snow / Altitude / Ridge',
    note: 'Above the tree line. Cable cars, ski slopes crowded with day visitors, a yak handler on packed snow, and the moment the last ridge turns copper.',
    refs: ['landscape/9', 'landscape/12', 'landscape/7', 'landscape/4', 'landscape/11', 'landscape/13', 'landscape/24', 'landscape/20', 'landscape/18', 'landscape/21', 'landscape/14', 'landscape/10', 'landscape/19', 'landscape/8', 'landscape/22', 'landscape/25']
  },
  {
    slug: 'the-river-at-dawn', title: 'THE RIVER AT DAWN', weight: 'lg',
    sub: 'Water', tags: 'Birds / Boats / First light',
    note: 'One hour, repeated. Migratory birds lifting off a river at sunrise, boatmen working through them, an oar held still long enough for the water to go flat.',
    refs: ['landscape/28', 'landscape/26', 'landscape/31', 'landscape/29', 'landscape/34', 'landscape/30', 'landscape/33', 'landscape/27']
  },
  {
    slug: 'quiet-ground', title: 'QUIET GROUND', weight: 'sm',
    sub: 'Landscape', tags: 'Desert / Plain / Coast',
    note: 'Ground with nothing on it. Dunes with a camel train reduced to a line, flooded scrub, a single figure on a green horizon, and a coastline that gives up two-thirds of the frame to sky.',
    refs: ['landscape/15', 'landscape/17', 'reflection/3', 'landscape/16', 'reflection/4', 'landscape/23', 'landscape/1', 'landscape/5', 'landscape/32', 'landscape/3', 'landscape/6', 'landscape/2', 'landscape/37', 'landscape/36', 'landscape/35']
  },
  {
    slug: 'close-range', title: 'CLOSE RANGE', weight: 'lg',
    sub: 'Detail', tags: 'Macro / Eye / Texture',
    note: 'Worked at the minimum focusing distance. An iris carrying a whole reflected scene, a web strung and lit from behind, an insect in metallic green — scale collapsed until surface is the subject.',
    refs: ['eye/3', 'macro/1', 'eye/1', 'macro/2', 'eye/2', 'portraiture/4', 'portraiture/13', 'macro/5', 'macro/3', 'macro/4']
  },
  {
    slug: 'small-lives', title: 'SMALL LIVES', weight: 'sm',
    sub: 'Animal', tags: 'Street / Field / Companion',
    note: 'The animals that share the same streets and yards — strays, working horses, geese, a litter on a stair landing. Photographed at their eye level, not ours.',
    refs: ['wildlife/16', 'wildlife/6', 'wildlife/7', 'wildlife/8', 'wildlife/2', 'wildlife/14', 'wildlife/10', 'wildlife/5', 'wildlife/1', 'wildlife/11', 'wildlife/3', 'wildlife/12', 'wildlife/15', 'wildlife/4', 'wildlife/9', 'wildlife/13']
  },
  {
    slug: 'the-campaign-on-the-ground', title: 'THE CAMPAIGN ON THE GROUND', weight: 'lg',
    sub: 'Chittorgarh', tags: 'Documentary / Sanitation / Civic',
    place: 'Chittorgarh, Rajasthan',
    note: 'The other half of a communication campaign: not the posters, but the mornings they were made for. Sanitation workers before a shift, a lotus drawn in rangoli on a road, cloth bags handed out across a vegetable market, schoolchildren with the posters they painted. Documentation from the wards of Chittorgarh.',
    refs: [
           'iec-field/1', 'iec-field/2', 'iec-field/3', 'iec-field/4', 'iec-field/5', 'iec-field/6', 'iec-field/7', 'iec-field/8', 'iec-field/9', 'iec-field/10', 'iec-field/11', 'iec-field/12', 'iec-field/13', 'iec-field/14', 'iec-field/15', 'iec-field/16', 'iec-field/17', 'iec-field/18', 'iec-field/19', 'iec-field/20', 'iec-field/21', 'iec-field/22', 'iec-field/23', 'iec-field/24', 'iec-field/25']
  }
];

/* ---------------------------------------------------------------------------
   PLAN — urban planning and research. Every entry is drawn from the CV.
   Dates are given only where the CV gives them.
   ------------------------------------------------------------------------ */
const PLAN_PROJECTS = [
  {
    slug: 'wuf11', title: 'NIUA @ WUF11', invert: true,
    year: '2022', place: 'Katowice, Poland',
    category: 'Research / Communication / Publication',
    org: 'National Institute of Urban Affairs',
    roleLine: 'Research Fellow',
    lede: 'A nineteen-page conference publication on the National Institute of Urban Affairs at the eleventh session of the World Urban Forum, 26–30 June 2022.',
    cover: 'design/wuf-brochure/01.jpg',
    designSlug: 'wuf11',
    context: 'The World Urban Forum is UN-Habitat’s global conference on cities. NIUA carried India’s presence at the eleventh session in Katowice — a pavilion, an exhibit, a run of networking events and a set of knowledge products. The institute needed one document that could hold all of it together after the fact.',
    role: 'Contributed to the design and communication process for World Urban Forum 11 within a team of three at global level. Collaborated on the official video script for NIUA, setting out the institute’s involvement and contributions. Drafted comprehensive reports synthesising research findings and key insights from the Forum.',
    process: 'The report is built as a survey: overview, presence, exhibit, knowledge sharing, networking events, event gallery. Editorial spreads alternate a solid teal field carrying the section name with a white field carrying dense text and evidence — so the eye can find a section at a flick and still read closely once it lands.',
    outputLabel: 'Selected spreads',
    facts: [
      ['Session', 'World Urban Forum 11'],
      ['Host', 'Katowice, Poland'],
      ['Dates', '26–30 June 2022'],
      ['Institute', 'NIUA, New Delhi'],
      ['Team', 'Three, global level']
    ]
  },
  {
    slug: 'citiis-2',
    title: 'CITIIS 2.0 — Partners Consultation',
    year: '2022', place: 'New Delhi',
    category: 'Audio-visual / Documentation',
    org: 'National Institute of Urban Affairs',
    roleLine: 'Research Fellow',
    lede: 'Testimonial capture for the CITIIS 2.0 partners consultation.',
    /* No cover. The output was recorded footage, and none of the artwork in
       this archive belongs to this project — a WUF11 spread standing in for it
       would say something untrue about what the work was. */
    context: 'CITIIS is a national urban programme delivered through NIUA. The partners consultation brought contributing organisations into one room; the value of that room disappears unless somebody records what was said in it.',
    role: 'Recorded and edited audio-visual testimonials for the CITIIS 2.0 Partners Consultation, holding a high production standard throughout. Worked closely with project partners to capture authentic and impactful experience and feedback, and played a key part in shaping the narrative that carried the project’s work outward.',
    facts: [
      ['Programme', 'CITIIS 2.0'],
      ['Institute', 'NIUA, New Delhi'],
      ['Period', 'May – September 2022'],
      ['Output', 'Recorded and edited testimonials']
    ]
  },
  {
    slug: 'c-cube',
    title: 'C-CUBE — Training & Capacity Building',
    year: '2022', place: 'New Delhi',
    category: 'Research / Motion / Knowledge products',
    org: 'National Institute of Urban Affairs',
    roleLine: 'Research Fellow',
    lede: 'Turning a shelf of knowledge products into something a room full of officials will actually watch.',
    cover: 'design/wuf-brochure/11.jpg',
    context: 'Capacity building programmes accumulate reports, decks and toolkits faster than anyone can read them. C-CUBE needed those findings moved into a format that survives a training session.',
    role: 'Conducted extensive research to extract key insights from knowledge products and presentations for the C-CUBE Training & Capacity Building initiative. Transformed those findings into visually engaging videos, communicating complex material for educational use, and contributed to the wider multimedia resource set behind the programme.',
    facts: [
      ['Initiative', 'C-CUBE'],
      ['Institute', 'NIUA, New Delhi'],
      ['Period', 'May – September 2022'],
      ['Output', 'Research, video, multimedia resources']
    ]
  },
  {
    slug: 'chittorgarh-iec', cat: 'sbm',
    tags: ['IEC / BCC', 'Swachh Bharat Mission', 'Har Ghar Tiranga', 'Har Ghar Swachhata'], title: 'Chittorgarh IEC / BCC', invert: true,
    year: '2025–', place: 'Chittorgarh',
    category: 'IEC / BCC / Urban Local Bodies',
    org: 'All India Institute of Local Self-Government',
    roleLine: 'BD Associate — Urban Planner · IEC Expert, SBM',
    lede: 'Information, Education and Communication for Nagar Parishad Chittorgarh under Swachh Bharat Mission 2.0.',
    cover: 'design/social-18/01.jpg',
    designSlug: 'swachh-survekshan',
    context: 'Swachh Bharat Mission is delivered at the level of the Nagar Parishad and the Nagar Palika. Sanitation targets are set nationally; they are met, or missed, by households on a particular street in a particular ward. IEC is the instrument that connects the two.',
    role: 'Worked on Information, Education and Communication (IEC/BCC) activities for Nagar Parishad Chittorgarh — awareness campaigns and citizen outreach on sanitation and public participation. Handled the council’s social media communication, and produced the creative set: single-use plastic explainers, cloth-bag drives, anti-littering instruction, food-stall hygiene, sanitation worker capacity building and school outreach.',
    process: 'The work runs on a fixed civic system — the Swachh Survekshan lockup, the ULB mark, a Hindi headline set large enough to read from a distance — and varies only the argument underneath it. Photographs of the actual drive sit next to the illustrated instruction, so the message is never abstract.',
    facts: [
      ['Mission', 'Swachh Bharat Mission (Urban) 2.0'],
      ['Bodies', 'Balotra · Siwana · Chittorgarh'],
      ['Employer', 'AIILSG'],
      ['From', 'January 2025'],
      ['Role', 'IEC Expert']
    ]
  },
  {
    slug: 'kathputli-colony', cat: 'research',
    title: 'Kathputli Colony',
    year: '2021', place: 'New Delhi',
    category: 'Documentation / Field research / Film',
    org: 'School of Planning and Architecture, New Delhi',
    roleLine: 'Research Intern — Prof. Poonam Prakash, Ms. Ankita Mandal',
    lede: 'A planning case documented on the ground: how a settlement of performers was redeveloped, and what that did to the people inside it.',
    /* No cover: the only image that exists for this project is a frame lifted
       out of the film, subtitles and all. The film itself is below. */
    film: 'tHCIrt1CYdA',
    gallery: ['kathputli-report'],
    galleryTitle: 'From the report',
    doc: { href: 'docs/Aatish_Kumar_Kathputli_Colony_Report.pdf', label: 'Read the full draft report (PDF)' },
    context: 'Kathputli Colony housed generations of puppeteers, magicians and street performers in west Delhi and became one of the country’s most-cited in-situ redevelopment cases. Cited, but rarely recorded from inside.',
    role: 'Documented the planning case, capturing its evolution, challenges and successes. Conducted on-site visits to gather firsthand information, interviewing community members and stakeholders. Compiled comprehensive reports detailing the planning strategies, community engagement processes and project outcomes, and used visual and multimedia material to carry the documentation.',
    facts: [
      ['Period', 'June – August 2021'],
      ['Institution', 'SPA, New Delhi'],
      ['Method', 'Site visits, interviews, reporting'],
      ['Output', 'Report and documentary']
    ]
  },
  {
    slug: 'pandemic-urban', cat: 'research',
    title: 'The Pandemic in Two Cities',
    year: '2020', place: 'Mumbai / Bhopal',
    category: 'Urban research / Data / Reporting',
    org: 'School of Planning and Architecture, New Delhi',
    roleLine: 'Research Intern — Prof. Dr. Mahavir',
    lede: 'Wave one and wave two, read through the socio-economic, healthcare and infrastructural record of Mumbai and Bhopal.',
    context: 'Two cities of very different size and density went through the same two waves. Setting them side by side turns a national event into a question about urban form.',
    gallery: ['pandemic-study'],
    galleryTitle: 'From the study',
    /* One report per city. The Bhopal study is in hand; the Mumbai one is not
       in the material supplied, so it is listed without a link rather than
       pointed at the wrong document. */
    cityReports: [
      { city: 'Bhopal', href: 'docs/internship_assin.pdf', pages: 13 },
      { city: 'Mumbai', href: null, note: 'Report not yet located' }
    ],
    role: 'Conducted research assessing the impact of the pandemic on urban areas, focusing on Wave 1 and Wave 2 in Mumbai and Bhopal. Collected and analysed data on the socio-economic, healthcare and infrastructural aspects of the two cities across the respective waves. Assisted in preparing comprehensive reports highlighting the vulnerabilities, challenges and resilience measures adopted by urban areas in response.',
    facts: [
      ['Period', 'June – August 2020'],
      ['Cities', 'Mumbai · Bhopal'],
      ['Scope', 'Wave 1 and Wave 2'],
      ['Output', 'Data analysis and reports']
    ]
  },
  {
    slug: 'universal-access', cat: 'thesis',
    title: 'Planning for Persons with Disabilities',
    year: '2022', place: 'Delhi',
    category: 'Thesis / Accessibility / Film',
    org: 'School of Planning and Architecture, New Delhi',
    roleLine: 'Bachelor of Planning — thesis',
    lede: 'The undergraduate thesis: what it takes for a city to be usable by everyone in it.',
    /* No cover — see the note on the Kathputli case. The film is below. */
    film: 'FCwKJSpvIOw',
    gallery: ['thesis-disability'],
    galleryTitle: 'From the thesis',
    doc: { href: 'docs/Aatish_Kumar_Thesis_Planning_for_Persons_with_Disabilities.pdf', label: 'Read the full thesis, 112 pages (PDF)' },
    context: 'Accessibility is written into standards and almost never into streets. The thesis took Delhi as its ground and asked where the gap actually opens — at the kerb, at the crossing, at the door, at the counter.',
    role: 'Bachelor of Planning thesis, completed with First Class at the School of Planning and Architecture, New Delhi. The research was carried into a documentary on universal accessibility.',
    facts: [
      ['Degree', 'Bachelor of Planning'],
      ['School', 'SPA, New Delhi'],
      ['Years', '2017 – 2022'],
      ['Result', 'First Class'],
      ['Topic', 'Planning for persons with disabilities, Delhi']
    ]
  },
  {
    slug: 'land-pooling', cat: 'sem7',
    title: 'Land Pooling Policy, Zone L',
    year: '2021', place: 'Delhi',
    category: 'Policy analysis / Zonal plan / GIS',
    org: 'School of Planning and Architecture, New Delhi',
    roleLine: 'Planning studio — group of twelve',
    lede: 'What the Delhi land pooling policy actually does to a zone when you draw it out sector by sector.',
    gallery: ['land-pooling'],
    galleryTitle: 'Studio sheets',
    context: 'Land pooling replaces acquisition with assembly: owners contribute land, the agency services it, and everyone takes a share back. Zone L, on Delhi’s south-west edge, is where the policy meets actual villages, actual holdings and an actual water table.',
    role: 'Worked within the studio group on the zonal-level analysis — demographic projection, land use, transport network, physical infrastructure, and the sector-by-sector test of which land actually qualifies for pooling.',
    process: 'The sheets run the same argument at three scales: the policy in the abstract, the zone as mapped, and the sector as drawn. Each analysis sheet carries its inference in the margin, so the reasoning stays legible without the presentation.',
    facts: [
      ['Studio', 'Zonal level plan'],
      ['Zone', 'Zone L, Delhi'],
      ['Methods', 'Policy analysis, projection, GIS mapping'],
      ['Output', '64-sheet studio document']
    ]
  },
  {
    slug: 'studio-noida', cat: 'sem2',
    title: 'Sector 21-A, Noida',
    year: '2019', place: 'Noida',
    category: 'Site planning / Land use / Urban design',
    org: 'School of Planning and Architecture, New Delhi',
    roleLine: 'Planning studio — second semester',
    lede: 'A stadium sector read and redrawn: land use, circulation, open space, and the block as a unit of design.',
    gallery: ['studio-noida'],
    galleryTitle: 'Studio sheets',
    context: 'Sector 21-A is organised around a stadium — a large single-use plate dropped into a residential grid. The studio asked what that does to the sector around it.',
    role: 'Site documentation, land use mapping, and the proposal sheets for circulation and open space.',
    facts: [
      ['Studio', 'Site planning'],
      ['Semester', 'II, January 2019'],
      ['Output', '40-sheet studio document']
    ]
  },
  {
    slug: 'walkability-audit', cat: 'sem3',
    title: 'Walkability Audit — Taimoor Nagar & New Friends Colony',
    year: '2019', place: 'Delhi',
    category: 'Transport / Street audit / Walkability index',
    org: 'School of Planning and Architecture, New Delhi',
    roleLine: 'Planning studio — third semester, with Trisha and Samreen',
    lede: 'A walkability index built from scratch for two neighbouring Delhi colonies, then used to score every street in them.',
    cover: 'images/work/walkability-jury.jpg',
    doc: { href: 'docs/WALKABILITY_FINAL_INTERNAL_JURY_make_sheet_size.pdf', label: 'Read the internal jury sheets, 10 pages (PDF)' },
    vizSlug: 'walkability-taimoor-nagar',
    context: 'Part of the semester’s transport improvement plan for Taimoor Nagar and New Friends Colony. The point was not to borrow a walkability score but to build one that fitted the place, and then to test it against the other transport surveys run the same semester.',
    role: 'Group studio with Trisha and Samreen: the literature study, the reconnaissance and delineation of the study area, the street-by-street survey, the scoring and the analysis.',
    process: 'The factors were grouped into six sections — adequacy of infrastructure, quality of infrastructure, crossings and intersections, driver behaviour and safety, comfort and aesthetics, and behaviour of people and vendors. Each street was scored factor by factor, the sections summed to a total out of sixty and converted to ten, and the final table graded from red to green so the pattern reads at a glance: comfort and crossings fail almost everywhere, and the villages score lowest of all.',
    facts: [
      ['Studio', 'Transport improvement plan'],
      ['Semester', 'III, August–December 2019'],
      ['Area', 'Taimoor Nagar & New Friends Colony'],
      ['Group', 'Trisha, Samreen, Aatish'],
      ['Output', '10 jury sheets']
    ]
  },
  {
    slug: 'environment-shamli', cat: 'sem6',
    title: 'Environment — Master Plan Shamli 2041',
    year: '2021', place: 'Shamli, Uttar Pradesh',
    category: 'Master plan / Environment / Regional',
    org: 'School of Planning and Architecture, New Delhi',
    roleLine: 'Planning studio — sixth semester, in a group of three',
    lede: 'The environment aspect of a master plan — what the air, water, soil and green cover of a district town are actually doing, and what to propose about it.',
    cover: 'images/work/env-shamli-2041.jpg',
    doc: { href: 'docs/Environment_Final_Proposals_pptx_edited.pdf', label: 'Read the proposals, 16 pages (PDF)' },
    context: 'A master plan has to say something about the environment, and the temptation is to say it in general. This aspect was worked through six headings instead — climate, soil, land surface and vegetation, water, air quality, and greens and open spaces — each taken from observation to the issue it raises.',
    role: 'Group studio with Harshit Panchal and V Purna Venkata Manikanta. The proposals for air quality management, for green buffers and for green areas in the Shamli notified planning area are mine, and carry my name on the sheets.',
    process: 'The findings are uncomfortable and specific, which is the point: seven per cent of groundwater samples unfit for drinking, no effluent treatment plant anywhere in the area, no ambient air quality monitoring station in a town whose index reads severe, and two per cent of the planning area as parks and open space. The proposals answer those directly — a green belt, a twenty to twenty-five metre buffer along the new roads, and a common effluent treatment plant.',
    facts: [
      ['Studio', 'Master plan — environment aspect'],
      ['Semester', 'VI, January–May 2021'],
      ['Town', 'Shamli, Uttar Pradesh'],
      ['Horizon', '2041'],
      ['Output', '16-sheet proposal deck']
    ]
  },
  {
    slug: 'studio-water', cat: 'sem7',
    title: 'Water & Physical Infrastructure',
    year: '2021', place: 'Muzaffarnagar / Kandhla',
    category: 'Infrastructure / Data / Regional',
    org: 'School of Planning and Architecture, New Delhi',
    roleLine: 'Planning studio — seventh semester',
    lede: 'Where the drinking water actually comes from, counted rather than assumed.',
    gallery: ['studio-water'],
    galleryTitle: 'Studio sheets',
    context: 'Physical infrastructure planning starts with a census table and ends with a network. This set works through drinking water supply for Kandhla and its rural surroundings — from source, through coverage, to gap.',
    role: 'Compiled and analysed the water supply data, and drew the supply, coverage and deficit sheets.',
    facts: [
      ['Studio', 'Physical infrastructure'],
      ['Source', 'District Census Handbook, Muzaffarnagar, 2011'],
      ['Output', 'Analysis and proposal sheets']
    ]
  },
  {
    slug: 'ajmer-storm-water', title: 'Ajmer Integrated Urban Storm Water Drainage Master Plan & DPR',
    org: 'All India Institute of Local Self-Government', cat: 'infra',
    category: 'Physical Infrastructure / GIS / DPR',
    tags: ['GIS', 'DPR', 'Storm Water', 'Urban Planning'],
    roleLine: 'Business Development Associate, AIILSG',
    archived: true
  },
  {
    slug: 'hindaun-storm-water', title: 'Hindaun Storm Water Drainage Master Plan / DPR',
    org: 'All India Institute of Local Self-Government', cat: 'infra',
    category: 'Physical Infrastructure / GIS / DPR',
    tags: ['GIS', 'DPR', 'Storm Water'],
    roleLine: 'Business Development Associate, AIILSG',
    archived: true
  },
  {
    slug: 'barmer-drainage', title: 'Barmer Drainage DPR',
    org: 'All India Institute of Local Self-Government', cat: 'infra',
    category: 'Physical Infrastructure / DPR',
    tags: ['DPR', 'Drainage'],
    roleLine: 'Business Development Associate, AIILSG',
    archived: true
  },
  {
    slug: 'balotra-waste-to-wealth', title: 'Balotra Waste to Wealth Theme Park',
    org: 'All India Institute of Local Self-Government', cat: 'waste',
    category: 'Waste Management / Waste to Wealth',
    tags: ['Waste Management', 'Urban Environment'],
    roleLine: 'Business Development Associate, AIILSG',
    archived: true
  },
  {
    slug: 'namaste-udaipur', title: 'NAMASTE Scheme — Waste Picker Profiling, Udaipur',
    org: 'All India Institute of Local Self-Government', cat: 'waste',
    category: 'Waste Management / Urban Sanitation',
    tags: ['NAMASTE', 'Profiling', 'Field Survey', 'Urban Sanitation'],
    roleLine: 'Business Development Associate, AIILSG',
    archived: true
  },
  {
    slug: 'jodhpur-street-vendor-survey', title: 'Jodhpur Street Vendor Survey — NULM',
    org: 'All India Institute of Local Self-Government', cat: 'nulm',
    category: 'NULM / Urban Livelihoods',
    tags: ['NULM', 'Street Vendor Survey', 'Field Survey', 'Urban Livelihoods'],
    place: 'Jodhpur',
    roleLine: 'Business Development Associate, AIILSG',
    lede: 'A street vendor survey under the National Urban Livelihoods Mission, and the enumerators hired to walk it.',
    context: 'A vendor survey is only as good as the people carrying the forms. Before any data exists there is a hiring problem and a public-notice problem, both of which are printed and both of which have to be unambiguous on a wall.',
    role: 'Produced the survey and recruitment material: the street vendor survey pamphlet, the walk-in enumerator recruitment notice, and the survey staff requirement notice, each set in Hindi with the eligibility and contact block carried at fixed position.',
    gallery: ['street-vendor-survey-pamphlet', 'aiilsg-jodhpur-walk-in-bharti', 'aiilsg-requirement-notice'],
    galleryTitle: 'Survey and recruitment material',
    /* Vendor-level survey returns are not published here: the returns carry
       names, household detail and identity numbers. */
    facts: [
      ['Programme', 'National Urban Livelihoods Mission'],
      ['Place', 'Jodhpur'],
      ['Output', 'Survey pamphlet, recruitment and requirement notices']
    ]
  },
  {
    slug: 'chittorgarh-riverfront', title: 'Chittorgarh Riverfront Development',
    org: 'All India Institute of Local Self-Government', cat: 'riverfront',
    category: 'Urban Development / Riverfront',
    tags: ['Urban Development', 'Public Realm'],
    place: 'Chittorgarh',
    roleLine: 'Business Development Associate, AIILSG',
    archived: true
  },
  {
    slug: 'galta-ji', title: 'Galta Ji Temple',
    org: 'All India Institute of Local Self-Government', cat: 'heritage',
    category: 'Heritage / Beautification / Architectural Development',
    tags: ['Heritage', 'Site Development'],
    roleLine: 'Business Development Associate, AIILSG',
    archived: true
  },
  {
    slug: 'ruda-ngo-empanelment', title: 'RUDA NGO Empanelment',
    org: 'All India Institute of Local Self-Government', cat: 'governance',
    category: 'Urban Governance / Institutional Work',
    tags: ['Urban Governance', 'Institutional'],
    roleLine: 'Business Development Associate, AIILSG',
    archived: true
  },
  {
    slug: 'balotra-tiranga', title: 'Balotra IEC \u2014 Har Ghar Tiranga',
    org: 'All India Institute of Local Self-Government', cat: 'sbm',
    category: 'Swachh Bharat Mission / IEC / BCC',
    tags: ['IEC / BCC', 'Campaign', 'Har Ghar Tiranga', 'Har Ghar Swachhata'],
    year: '2025', place: 'Balotra',
    roleLine: 'Business Development Associate, AIILSG',
    lede: 'A national flag campaign run through a municipal council, with sanitation carried in on the back of it.',
    context: 'Har Ghar Tiranga asks every household to raise the national flag. Run alongside Har Ghar Swachhata Abhiyan through Municipal Council Balotra, it becomes a fortnight of scheduled activity reaching schools, self-help groups, markets and streets.',
    role: 'Contributed to the campaign\u2019s visual communication and outreach, and produced the activities report \u2014 nineteen activities, each recorded with what it involved and where it ran.',
    gallery: ['har-ghar-tiranga'],
    galleryTitle: 'Activities report',
    designSlug: 'har-ghar-tiranga',
    doc: { href: 'docs/Har_Ghar_Tiranga_Report.pdf', label: 'Read the full activities report (PDF)' },
    facts: [
      ['Programme', 'Har Ghar Tiranga \u00b7 Har Ghar Swachhata Abhiyan'],
      ['Place', 'Balotra'],
      ['With', 'Municipal Council Balotra'],
      ['Output', 'Activities report, campaign communication']
    ]
  },
  {
    slug: 'samdhari-iec', title: 'IEC \u2014 Samdhari',
    org: 'All India Institute of Local Self-Government', cat: 'sbm',
    category: 'Swachh Bharat Mission / IEC / BCC',
    tags: ['IEC / BCC', 'Urban Local Body'],
    place: 'Samdhari',
    roleLine: 'Business Development Associate, AIILSG',
    archived: true
  },
  {
    slug: 'siwana-iec', title: 'IEC \u2014 Siwana',
    org: 'All India Institute of Local Self-Government', cat: 'sbm',
    category: 'Swachh Bharat Mission / IEC / BCC',
    tags: ['IEC / BCC', 'Urban Local Body'],
    place: 'Siwana',
    roleLine: 'Business Development Associate, AIILSG',
    archived: true
  },
  {
    slug: 'ncap-jodhpur', title: 'NCAP \u2014 Jodhpur',
    org: 'All India Institute of Local Self-Government', cat: 'sbm',
    category: 'Swachh Bharat Mission / IEC / BCC',
    tags: ['NCAP', 'Air Quality', 'Public Awareness'],
    place: 'Jodhpur',
    roleLine: 'Business Development Associate, AIILSG',
    archived: true
  }
];

/* ---------------------------------------------------------------------------
   DESIGN — the 39 pieces regrouped into case studies. `folders` name the
   asset directories, which is what design-data.js is keyed on.
   ------------------------------------------------------------------------ */
const DESIGN_PROJECTS = [
  {
    slug: 'swachh-survekshan', title: 'Swachh Bharat Mission', invert: true,
    year: '2025–', place: 'Chittorgarh · Jaitaran',
    category: 'IEC / BCC campaign',
    client: 'Nagar Parishad Chittorgarh · Nagar Palika Jaitaran · AIILSG',
    roleLine: 'Design, copy layout and social media',
    lede: 'A running IEC and BCC campaign for two Urban Local Bodies under Swachh Bharat Mission (Urban) 2.0.',
    context: 'Swachh Survekshan is the annual cleanliness survey of Indian cities. For a Nagar Parishad it is both an assessment and a deadline — the behaviour it measures has to be argued for, ward by ward, in the months before the surveyor arrives.',
    role: 'Handled social media communication for Chittorgarh Nagar Parishad, and produced the creative set: single-use plastic explainers, cloth-bag drives, anti-littering instruction, sanitation worker capacity building, food-stall hygiene, and school outreach. Photographs from each drive were carried back into the next post.',
    process: 'One fixed masthead — the Swachh Survekshan lockup beside the ULB mark — sits at the top of every piece so the account reads as an institution rather than a feed. Underneath it the format changes freely: illustration where an instruction has to be unambiguous, documentary photography where the point is that the drive actually happened.',
    storySlug: 'the-campaign-on-the-ground',
    planSlug: 'chittorgarh-iec',
    folders: ['social-18', 'social-post-07', 'social-post-08', 'social-post-09', 'social-post-11', 'social-post-13', 'social-post-14', 'social-post-15', 'social-post-16', 'social-post-17', 'pamphlet-04']
  },
  {
    slug: 'training-admissions', title: 'Training & Admissions',
    year: '2025–', place: 'Jodhpur',
    category: 'Campaign / Print / Outdoor',
    client: 'All India Institute of Local Self-Government',
    roleLine: 'Design across print, outdoor and social',
    lede: 'Recruitment and convocation communication for AIILSG’s fireman and sanitary inspector programmes.',
    context: 'AIILSG runs vocational courses that lead directly to municipal employment — fireman certificate, sanitary inspector diploma. The audience is a school leaver deciding what to do next, reached across a hoarding, a pamphlet, a notice board and a phone screen.',
    role: 'Designed the full run: admission notices, 3×2 ft banners, a two-panel career brochure, convocation banners in light and dark variants, and the achievement poster for the course topper. Each piece was set in Hindi and English at the sizes the format required.',
    process: 'The set holds together on a red-and-navy institutional palette, a consistent seal position and a fixed contact block — while the hierarchy is rebuilt per format. A hoarding leads with the course name at three inches high; the brochure leads with a photograph of the training ground.',
    folders: ['fireman-training-brochure', 'banners-5', 'banners-6', 'banner-02', 'banner-03', 'pamphlet-01', 'pamphlet-02', 'pamphlet-03', 'aiilsg-fireman-convocation-banner', 'aiilsg-jodhpur-fireman-convocation', 'graduation-poster', 'social-post-01', 'social-post-02']
  },
  {
    slug: 'aiilsg-identity', title: 'AIILSG Rajasthan',
    year: '2025–', place: 'Jodhpur',
    category: 'Institutional identity / Publication',
    client: 'All India Institute of Local Self-Government',
    roleLine: 'Design and layout',
    lede: 'Identity-level work for a hundred-year-old institution in local self-government.',
    context: 'AIILSG has worked with Indian local government since 1926. The Rajasthan regional office needed material that states what the institute does — detailed project reports, training, survey work — without reading like a prospectus.',
    role: 'Designed the centenary brochure for AIILSG Rajasthan, the institutional banner, the CSR health camp announcement, the felicitation post and the office business card.',
    process: 'The brochure runs on a two-tone grid — a green field for the institute, tinted panels for each service — and keeps a full-bleed photograph on the cover so the first page is a place rather than a logo.',
    /* banner-04, the institutional banner, was removed at the client's request. */
    folders: ['final-brochure-print', 'banner-01', 'social-post-03', 'business-card']
  },
  {
    slug: 'field-survey', title: 'Field Survey Recruitment',
    year: '2025–', place: 'Jodhpur',
    category: 'Notice / Recruitment / NULM',
    client: 'AIILSG · NULM',
    roleLine: 'Design and layout',
    lede: 'Enumerator recruitment and street vendor survey notices.',
    context: 'A street vendor survey under NULM is only as good as the enumerators walking it. Hiring them is a local, urgent, printed problem: a notice that has to be legible on a wall and complete enough that nobody arrives without documents.',
    role: 'Designed the walk-in recruitment notice, the staff requirement notice and the street vendor survey pamphlet, each set in Hindi with the eligibility and contact block carried at fixed position.',
    process: 'Everything is subordinated to the reading order a wall notice actually gets: authority mark, then the one word that stops you, then eligibility as a scannable list, then a phone number set large enough to photograph.',
    folders: ['aiilsg-jodhpur-walk-in-bharti', 'aiilsg-requirement-notice', 'street-vendor-survey-pamphlet']
  },
  {
    slug: 'civic-calendar', title: 'The Civic Calendar',
    year: '2025–', place: 'Jodhpur',
    category: 'Observance / Social',
    client: 'All India Institute of Local Self-Government',
    roleLine: 'Design and data layout',
    lede: 'The fixed dates a public institution is expected to mark, treated as an information problem.',
    context: 'International Yoga Day, World Population Day, World Nature Conservation Day, Holika Dahan, the new year. Institutions post on all of them, usually with a stock image and a greeting.',
    role: 'Designed the observance set. Where the day carries data — population, conservation — the post was rebuilt around figures and a small stat block rather than decoration.',
    folders: ['social-post-04', 'social-post-05', 'social-post-06', 'social-post-10', 'social-post-12']
  },
  {
    slug: 'wuf11', title: 'NIUA @ WUF11', invert: true,
    year: '2022', place: 'Katowice, Poland',
    category: 'Conference publication',
    client: 'National Institute of Urban Affairs',
    roleLine: 'Design and communication, team of three',
    lede: 'A nineteen-page conference publication on NIUA’s presence at the World Urban Forum.',
    context: 'See the planning case for the full account of the Forum and the role.',
    planSlug: 'wuf11',
    role: 'Contributed to the design and communication process for WUF11 within a team of three at global level; drafted reports synthesising findings from the Forum.',
    process: 'Alternating spreads: a saturated teal field carrying nothing but the section name in outline type, then a white field carrying the evidence. Section names are set as a running foot so the document can be flicked through and still navigated.',
    folders: ['wuf-brochure']
  },
  {
    slug: 'photography-book', title: 'Photography Portfolio',
    year: null, place: null,
    category: 'Book / Self-directed',
    client: 'Self-initiated',
    roleLine: 'Photography, edit, sequence and layout',
    lede: 'A thirty-eight page book built from the same archive this site draws on.',
    context: 'The photographs existed as folders. A book forces the harder decisions — what the categories actually are, which frame opens a chapter, and which two pictures can survive facing each other.',
    role: 'Shot, selected, sequenced and laid out the full book: nature, landscape, arid and mountain landscape, riverine, coastal, people, portrait, fashion, macro, heritage, cityscape, music, astrophotography, lunar, long exposure, wildlife, eye and staircase.',
    process: 'A quiet white grid with generous margins, one short text column per chapter, and image blocks that change size rather than position — so the sequence carries the rhythm instead of the layout.',
    folders: ['photography-portfolio-book']
  },
  {
    slug: 'har-ghar-tiranga', title: 'Har Ghar Tiranga',
    year: '2025', place: 'Balotra',
    category: 'Campaign / IEC / Documentation',
    client: 'Municipal Council Balotra · AIILSG Jodhpur',
    roleLine: 'Campaign communication and reporting',
    lede: 'A national flag campaign run through a municipal council, and the record of what actually happened in the wards.',
    context: 'Har Ghar Tiranga asks every household to raise the national flag. Run alongside Har Ghar Swachhata Abhiyan through a municipal council, it becomes something more useful than a gesture: a fortnight of scheduled activity that reaches schools, self-help groups, markets and streets, with sanitation carried in on the back of it.',
    role: 'Worked on the campaign’s visual communication and outreach, and produced the activities report — the document that records each activity, what it involved and where it ran. The report is the deliverable shown here.',
    process: 'Nineteen activities, one page each, each page holding a short account and the photographs from that activity. The flag’s own saffron-white-green runs as a fixed border so the document reads as one campaign rather than nineteen separate events.',
    folders: ['har-ghar-tiranga'],
    doc: { href: 'docs/Har_Ghar_Tiranga_Report.pdf', label: 'Read the full activities report (PDF)' }
  }
];

/* ---------------------------------------------------------------------------
   VISUALISATION — the charts, built in Flourish and embedded live.

   Each entry is a study, not a chart. The charts inside it are the figures
   from that study, in reading order, grouped the way the argument runs:
   the national picture before the city, the city before the sample, the
   sample before the street.

   A chart is either `id` — a Flourish visualisation id — or `dw`, a
   Datawrapper code. The site embeds the frame itself, with no third-party
   script, and sizes it from the resize message the service posts back.
   Datawrapper is addressed without a version, so republishing a chart there
   does not mean editing a code here.

   A chart only renders for a visitor once it is PUBLISHED. An unpublished
   one shows a link to itself instead of an empty frame, so the page is never
   broken, only incomplete. Publish it and it appears here on the next load —
   nothing in this file needs changing.

   The rule at the top of this file holds. The figures describe what was
   measured and how; they do not state findings that the chart itself has
   to make. No year, client or institution below is guessed.
   ------------------------------------------------------------------------ */
const VIZ_PROJECTS = [
  {
    slug: 'accessibility-delhi',
    title: 'Planning for Persons with Disabilities',
    year: '2022', place: 'Delhi',
    category: 'Thesis / Census analysis / Primary survey',
    client: 'School of Planning and Architecture, New Delhi',
    roleLine: 'Research, survey design, analysis and visualisation',
    lede: 'The evidence base of the thesis, drawn as figures — a national census, a city, a survey of 117 people and one audited sub-zone.',
    context: 'Accessibility is written into standards and almost never into streets. The thesis took Delhi as its ground; these are the figures it was argued from. They run at four scales, and the point of the sequence is the narrowing: what the Census can tell you about a country, what it can tell you about a city, what only asking 117 people will tell you, and what is left that you can only find by walking a footpath with a measuring tape.',
    role: 'Bachelor of Planning thesis at the School of Planning and Architecture, New Delhi, completed with First Class. The Census tabulations were re-cut by type, age, sex, district and residence; the primary survey of 117 respondents was designed, run and coded; the pathway audit scored stretches in Sub-zone F1 against a fixed set of factors.',
    process: 'Census 2011 is the only source that covers everyone, and it is also the bluntest — it counts disability by type and leaves the street out entirely. So each scale is there to catch what the one above it misses. The survey asks about travel, work and schooling, which no tabulation records. The audit scores kerbs, widths and crossings, which no respondent should have to describe from memory.',
    planSlug: 'universal-access',
    doc: { href: 'docs/Aatish_Kumar_Thesis_Planning_for_Persons_with_Disabilities.pdf', label: 'Read the full thesis, 112 pages (PDF)' },
    /* The seven figures that do not look like the others lead the study. A
       reader meeting twenty-four charts should not meet six variations of the
       same bar first; the forms that carry the most at a glance — the
       marimekko, the two heatmaps, the parliament, the hierarchy, the radar —
       are pulled to the front. They are moved, not repeated: each one is gone
       from the scale group it came from, and the four scales below run on the
       remaining seventeen in the same order as before. */
    groups: [
      {
        name: 'Selected figures',
        note: 'The forms the study used, gathered at the front — a marimekko scaled to district size, two heatmaps, a parliament of one mark per respondent, a hierarchy of the sample, and a radar profile of one street. The study then runs in full below, at its four scales.',
        charts: [
          { id: 30309875, title: 'Disability type by district, scaled to district size' },
          { id: 30309395, title: 'Persons with disabilities by district and type — urban Delhi' },
          { id: 30309399, title: 'Disability type by age group — Delhi' },
          { id: 30309877, title: 'The 117 respondents' },
          { id: 30309405, title: 'Composition of the 117-person sample' },
          { id: 30309366, title: 'Pathway accessibility audit — Sub-zone F1' },
          { id: 30309872, title: 'Accessibility profile — best, worst and mean stretch' }
        ]
      },
      {
        name: 'The national picture — Census 2011',
        note: 'Six cuts of the same national tabulation. Type, age and sex first, then the urban and rural split, which is the one that matters for a planner and the one the headline figure hides.',
        charts: [
          { id: 30309444, title: 'Distribution of persons with disabilities by type — India' },
          { id: 30309638, title: 'Prevalence of disability by age and sex — India' },
          { id: 30309447, title: 'Persons with disabilities by sex and type — India' },
          { id: 30309639, title: 'Urban and rural share of persons with disabilities — India' },
          { id: 30309448, title: 'Proportion of disabled population by residence, 2001 and 2011' },
          { id: 30309398, title: 'Disability type by residence — India' }
        ]
      },
      {
        name: 'Delhi — Census 2011',
        note: 'The same source cut to one city and then to its districts, so the question stops being how many and becomes where. The district marimekko and the age heatmap are among the opening figures.',
        charts: [
          { id: 30309641, title: 'Persons with disabilities by type — Delhi' },
          { id: 30309455, title: 'Persons with disabilities by age group and sex — Delhi' },
          { id: 30309452, title: 'District share of Delhi’s disabled population' },
          { id: 30309882, title: 'Disability prevalence rate by district — Delhi' }
        ]
      },
      {
        name: 'The primary survey — 117 respondents',
        note: 'What the Census does not ask. The same 117 people cut by education, by work, and by how they actually move through the city. The sample itself is drawn at the front, one mark to a person.',
        charts: [
          { id: 30309643, title: 'Respondents by age group and impairment type' },
          { id: 30309383, title: 'Education attainment by impairment type' },
          { id: 30309404, title: 'Occupational structure by impairment type' },
          { id: 30309401, title: 'Travel independence by impairment type' },
          { id: 30309649, title: 'Modal split by impairment type' }
        ]
      },
      {
        name: 'The pathway audit — Sub-zone F1',
        note: 'One sub-zone, walked and scored stretch by stretch. This is the scale at which accessibility either exists or does not. The scored grid and the profile of the best and worst stretch both open the study.',
        charts: [
          { id: 30309441, title: 'Mean accessibility score by factor' },
          { id: 30309442, title: 'Pathway stretches ranked by accessibility score' }
        ]
      }
    ]
  },
  {
    slug: 'walkability-taimoor-nagar',
    planSlug: 'walkability-audit',
    title: 'Walkability — Taimoor Nagar and New Friends Colony',
    place: 'Delhi',
    category: 'Studio / Street audit / Transport',
    client: 'School of Planning and Architecture, New Delhi',
    roleLine: 'Street audit, scoring and visualisation',
    /* Semester III is stated on the sheets, and the published heatmap dates
       the audit 2019 in its own subtitle. */
    year: '2019',
    meta: 'Semester III · Second year',
    lede: 'A street audit of two adjacent Delhi neighbourhoods, scored section by section and plotted against the things that were measured on the ground.',
    context: 'Taimoor Nagar and New Friends Colony sit next to each other and are not walked the same way. The studio scored the streets of both against a fixed instrument, which makes the comparison a matter of record rather than impression.',
    role: 'Audited and scored streets by section, then drew the results four ways — as a heatmap of every street and section, as a profile by road hierarchy, and as two scatters testing the score against footpath width and against vehicle speed.',
    process: 'A score is only as good as what it is tested against. The two scatters exist to check the instrument: if effective footpath width and driver behaviour do not move with the walkability score, the score is measuring something other than walking.',
    groups: [
      {
        name: 'The audit',
        charts: [
          { id: 30309933, title: 'Walkability scores by street and section' },
          { id: 30309935, title: 'Walkability profile by road hierarchy' }
        ]
      },
      {
        name: 'Testing the score',
        note: 'The score plotted against what was measured on the street.',
        charts: [
          { id: 30309939, title: 'Effective footpath width against walkability score' },
          { id: 30309940, title: 'Vehicle speed against driver behaviour and safety score' }
        ]
      }
    ]
  },
  {
    slug: 'india-reference-maps',
    title: 'India — Reference Maps',
    place: 'India',
    category: 'Self-directed / Reference',
    roleLine: 'Data preparation and visualisation',
    lede: 'Self-directed reference pieces: the country by state population, and the calendar of large religious and cultural gatherings.',
    context: 'Two pieces made outside any brief, for the reason reference maps usually get made — because the question came up often enough that it was worth drawing once properly.',
    role: 'Prepared the data and built the pieces: a projection map of population by state and union territory, and the attendance figures for major pilgrimages, fairs and festivals drawn twice — once as a hierarchy, once as a symbol map.',
    process: 'The festival data is shown two ways because the two questions it answers are different. A hierarchy ranks and nests: which gathering is largest, and what it sits inside. A symbol map puts the same numbers back on the ground, where the clustering along particular rivers and routes is the thing you actually see.',
    groups: [
      {
        name: 'Reference',
        charts: [
          { id: 30293929, title: 'India — population by state and union territory' }
        ]
      },
      {
        name: 'Religious footfall and festivals, 2026',
        note: 'The same attendance figures ranked, then placed.',
        charts: [
          { id: 30310275, title: 'Attendance by gathering — hierarchy' },
          { dw: 'ePi99', title: 'Attendance by gathering — symbol map' }
        ]
      }
    ]
  }
];

/* ---------------------------------------------------------------------------
   MOTION — films published on the channel. No years are asserted: the CV
   dates the research, not the release, and nothing here should be guessed.
   ------------------------------------------------------------------------ */
const FILMS = [
  {
    id: 'tHCIrt1CYdA', title: 'Kathputli Colony, Delhi',
    kind: 'Documentary', note: 'A settlement of performers, documented from inside during field research at SPA Delhi.',
    featured: true, planSlug: 'kathputli-colony'
  },
  {
    id: 'FCwKJSpvIOw', title: 'Universal Accessibility',
    kind: 'Documentary', note: 'Carried out of the undergraduate thesis on planning for persons with disabilities.',
    planSlug: 'universal-access'
  },
  {
    id: 'sc6pKN-palo', title: 'Celebrating 30 Years of Planning',
    kind: 'Institutional film', note: 'School of Planning and Architecture, New Delhi.'
  },
  {
    id: 'D6nAEBTkZHo', title: 'NIUA TV — India Climate Dialogues',
    kind: 'Programme', note: 'National Institute of Urban Affairs.'
  },
  {
    id: 'XTnez9jhKaE', title: 'NOSPLAN — Inaugural Address',
    kind: 'Event film', note: 'Inaugural address by Shri Durga Shanker Mishra.'
  },
  { id: '6ZfpgKIWuQ8', title: 'The Second Chance', kind: 'Short film', note: 'Narrative.' },
  { id: 'bCk4xZc0quM', title: 'Love in the Music', kind: 'Short film', note: 'Narrative.' }
];

/* ---------------------------------------------------------------------------
   SELECTED WORK — the homepage sequence. Six entries, one per practice,
   ordered so the planner reads first and the range reveals itself after.
   ------------------------------------------------------------------------ */
/* `kind` decides how the block is built, and it is the difference between a
   picture and a piece of artwork:

     photo    a photograph. It may be cropped to a cinematic band, because a
              crop is an editorial decision the photographer is entitled to.
     artwork  a poster, a brochure page, a notice. It is NEVER cropped and
              never letterboxed — the block takes the artwork's own aspect
              ratio and the column span is chosen to suit it, so the whole
              piece is visible at a sensible size without scrolling.
     type     no image exists for this project. Rather than borrowing an
              unrelated photograph or a still lifted out of a video, the block
              is set typographically. */
/* Five projects, each one backed by artwork that exists in this repository.
   `desc` is the one-sentence case for the project; `where` is the survey-style
   locator that runs under the number. Everything else works as before. */
const SELECTED = [
  {
    n: '01', title: 'Photography Portfolio', href: '#/design/photography-book',
    meta: 'Book / Photography / Layout',
    where: 'Self-initiated',
    desc: 'A thirty-eight page book built from the same archive this site draws on — shot, selected, sequenced and laid out, because a book forces the decisions a folder lets you avoid.',
    kind: 'artwork', cover: 'design/photography-portfolio-book/01.jpg',
    alt: 'Cover of the Photography Portfolio book — a bass guitarist photographed from below against blue stage smoke, with the author’s name above and the title set in wide white capitals below.',
    caption: 'Photography Portfolio — cover'
  },
  {
    n: '02', title: 'Environment — Shamli 2041', href: '#/plan/environment-shamli',
    meta: 'Master plan / Environment / Regional',
    where: 'Shamli, Uttar Pradesh / 2021',
    desc: 'The environment aspect of a master plan, worked through six headings from observation to issue — then answered with a green belt, a buffer along the new roads and a common effluent treatment plant.',
    kind: 'artwork', cover: 'images/work/env-shamli-2041.jpg',
    alt: 'Cover of the Shamli 2041 master plan environment proposal — an ink and foliage collage in deep greens beside the title Master Plan Shamli 2041 and the word ENVIRONMENT.',
    caption: 'Master Plan Shamli 2041 — environment proposal'
  },
  {
    n: '03', title: 'Chittorgarh IEC', href: '#/design/swachh-survekshan',
    meta: 'Visual communication / SBM (Urban) 2.0',
    where: 'Chittorgarh · Jaitaran / 2025–',
    desc: 'A running sanitation campaign for two Urban Local Bodies — single-use plastic explainers, cloth-bag drives, anti-littering instruction and school outreach, argued ward by ward in the months before the survey.',
    kind: 'artwork', cover: 'design/social-post-08/01.jpg',
    alt: 'Awareness post reading “Adopt cloth bags, save the environment”, setting a crossed-out plastic bag against a cloth bag.',
    caption: 'Nagar Parishad Chittorgarh — awareness set'
  },
  {
    n: '04', title: 'NIUA @ WUF11', href: '#/plan/wuf11',
    meta: 'Urban research / Conference publication',
    where: 'Katowice, Poland / 2022',
    desc: 'A nineteen-page conference brochure on the National Institute of Urban Affairs at the eleventh World Urban Forum, designed and written inside a team of three.',
    kind: 'artwork', cover: 'design/wuf-brochure/01.jpg',
    alt: 'Cover of the NIUA at WUF11 conference brochure — the institute’s wordmark in white on a dark teal field above an illustrated city.',
    caption: 'Conference brochure — cover'
  },
  {
    n: '05', title: 'Walkability Audit', href: '#/plan/walkability-audit',
    meta: 'Transport / Street audit / Walkability index',
    where: 'Taimoor Nagar · New Friends Colony / 2019',
    desc: 'A walkability index built for two Delhi colonies and used to score every street in them — six sections, a score out of ten, and a table graded red to green so the failures read at a glance.',
    kind: 'artwork', cover: 'images/work/walkability-jury.jpg',
    alt: 'Internal jury sheet titled Final scoring of study area — a base map of Taimoor Nagar and New Friends Colony beside a score table for every street, shaded from red to green, with bar charts of the average score in each section.',
    caption: 'Internal jury — final scoring of study area'
  }

];

/* The stories that get a preview on the home page. */
const HOME_STORIES = ['the-blue-city', 'lines', 'after-dark', 'between-streets'];

/* --------------------------------------------------------------------- ABOUT */
const TIMELINE = [
  { k: '2017 — 2022', t: 'B.Plan', d: 'School of Planning and Architecture, New Delhi. First Class. Thesis: planning for persons with disabilities, Delhi.' },
  { k: '2020', t: 'Urban research', d: 'Research intern under Prof. Dr. Mahavir — pandemic impact on Mumbai and Bhopal.' },
  { k: '2021', t: 'Field documentation', d: 'Research intern under Prof. Poonam Prakash and Ms. Ankita Mandal — Kathputli Colony, Delhi.' },
  { k: '2022', t: 'NIUA', d: 'Research Fellow, National Institute of Urban Affairs — WUF11, CITIIS 2.0, C-CUBE.' },
  { k: '2025 —', t: 'AIILSG', d: 'BD Associate (Urban Planner) and IEC Expert, Swachh Bharat Mission — Balotra, Siwana, Chittorgarh.' },
  { k: 'Throughout', t: 'Photography / Film', d: '166 photographs, seven films, a thirty-eight page book. Society coordinator, Inmotion film-making society, SPA Delhi.' }
];

/* Software, arranged as the route a project actually travels — map, then
   chart, then design, then document, then image and film — rather than as a
   résumé list. Nothing here claims a proficiency level.

   Every entry is on the CV's own software lists, with QGIS and ArcGIS named
   where the CV says only "GIS", and Word covered by its "MS Office". The Data
   stage is not an invention of this site either: the CV carries a "Data
   Visualisation Tools" line of its own, listing Flourish, Datawrapper and
   Power BI, with Visme under Software. */
const TOOLS = [
  { g: 'Planning',      sub: 'Maps / CAD / GIS',
    items: ['AutoCAD', 'SketchUp', 'GIS'] },
  { g: 'Data',          sub: 'Charts / Maps / Dashboards',
    items: ['Flourish', 'Datawrapper', 'Power BI', 'Visme'] },
  { g: 'Design',        sub: 'Image / Layout / Interface',
    items: ['Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Canva'] },
  { g: 'Documentation', sub: 'Reports / Presentations / Spreadsheets',
    items: ['Word', 'PowerPoint', 'Excel'] },
  { g: 'Media',         sub: 'Photography / Video / Editing',
    items: ['Lightroom', 'Premiere Pro', 'After Effects'] }
];

const CAPABILITIES = [
  { g: 'Planning', items: ['Urban Planning', 'Urban Research', 'Field Documentation', 'Primary Survey Design', 'Detailed Project Reports', 'Stakeholder Coordination', 'Report Writing'] },
  { g: 'Design', items: ['Visual Communication', 'Data Visualisation', 'IEC / BCC', 'Campaign Design', 'Information Design', 'Publication Layout', 'Presentation Design'] },
  { g: 'Visual', items: ['Photography', 'Videography', 'Documentary', 'Motion', 'Editing', 'Social Media'] }
];

const ABOUT_BODY = [
  'I work between maps, cities, images and moving stories.',
  'With a background in urban planning, I am interested in how places are planned, experienced and communicated. I trained at the School of Planning and Architecture in New Delhi, wrote a thesis on planning for persons with disabilities, and have worked since on urban research, field documentation and communication for public institutions.',
  'My work moves between urban planning, data visualisation, visual communication, photography and film — looking for the space where analytical thinking and visual storytelling meet. In practice that means the same week can hold a detailed project report, a chart that makes a census tabulation legible, a ward-level awareness campaign, and a night on a fixed mount waiting for a star trail to close.'
];

/* ---------------------------------------------------------------------------
   ARCHIVE — every document in the collection, grouped.

   Semester attribution follows the documents themselves wherever they state it
   (those carry src: 'stated'); the rest are placed by file date and subject,
   which is why each group carries a date range rather than a bare claim.

   Every entry links to the complete document. The PowerPoint decks were
   converted to PDF so they open in a browser instead of downloading — Faridabad
   went from 380 MB to 10 MB on the way.
   ------------------------------------------------------------------------ */
const ARCHIVE = [
  {
    inst: 'AIILSG', key: "sbm", label: "Swachh Bharat Mission (Urban)",
    meta: "AIILSG Jodhpur \u00b7 Rajasthan \u00b7 2025\u2013",
    note: "Professional reporting for Urban Local Bodies under SBM 2.0 \u2014 the IEC and BCC record, activity by activity.",
    items: [
      { stem: "combined_report_IEC_chttorgarh", title: "IEC & BCC Activities \u2014 Combined Report", note: "Municipal Council Chittorgarh. The full programme record.", pages: 228, mb: 53.8, w: 560, h: 792 },
      { stem: "IEC_ACT_DEC", title: "IEC Activities \u2014 December", note: "Monthly activity report.", pages: 19, mb: 4.6, w: 560, h: 315 },
      { stem: "Daily_Activities_Report_NOV_11", title: "Daily Activities Report \u2014 11 November", note: "Field reporting.", pages: 22, mb: 6.1, w: 560, h: 792 },
      { stem: "On_completion_of_two_years_of_the_present_Government", title: "Two Years of the Present Government", note: "Commemorative activity report.", pages: 16, mb: 3.8, w: 560, h: 315 },
      { stem: "Har_Ghar_Tiranga_PRESENTATION", title: "Har Ghar Tiranga \u2014 Activities Report", note: "Balotra. Nineteen activities with photographs.", pages: 20, mb: 4.4, w: 560, h: 315 },
      { stem: "Har_Ghar_Tiranga_Report", title: "Har Ghar Tiranga \u2014 Report", note: "Balotra. The written record.", pages: 12, mb: 1.6, w: 560, h: 725 },
    ]
  },
  {
    inst: 'SPA New Delhi', key: "thesis", label: "Thesis \u2014 Final Year",
    meta: "Bachelor of Planning \u00b7 2022",
    note: "The undergraduate thesis and the presentation that carried it.",
    items: [
      { stem: "Aatish_Kumar_Thesis_Planning_for_Persons_with_Disabilities", title: "Planning for Persons with Disabilities", note: "Delhi. 112 pages, First Class.", pages: 112, mb: 4.2, w: 560, h: 792, src: "stated" },
      { stem: "Assessing_inclusivity_of_Disabled_in_Smart_cities_Autosaved_", title: "Assessing Accessibility in Smart Cities", note: "Thesis presentation.", pages: 21, mb: 0.4, w: 560, h: 315 },
    ]
  },
  {
    inst: 'SPA New Delhi', key: "sem7", label: "Semester VII",
    meta: "Fourth year \u00b7 Aug\u2013Dec 2021",
    note: "Physical infrastructure and the zonal plan.",
    items: [
      { stem: "Proposals_2_1_", title: "Physical Infrastructure \u2014 Proposals", note: "The deck states 7th Semester.", pages: 11, mb: 2.0, w: 560, h: 396, src: "stated" },
      { stem: "water_external_jury", title: "Water Supply \u2014 External Jury", note: "Muzaffarnagar / Kandhla.", pages: 9, mb: 1.2, w: 560, h: 396 },
      { stem: "14th_Dec_Zonal_Level_Sheets", title: "Land Pooling Policy \u2014 Zonal Level Sheets", note: "Zone L, Delhi. 64 sheets.", pages: 64, mb: 9.2, w: 560, h: 396 },
    ]
  },
  {
    inst: 'SPA New Delhi', key: "sem6", label: "Semester VI",
    meta: "Third year \u00b7 Jan\u2013May 2021",
    note: "Environment, site design and regional context.",
    items: [
      { stem: "Environment_Final_Proposals_pptx_edited", title: "Environment \u2014 Final Proposals", note: "The deck states 6th Semester.", pages: 16, mb: 3.8, w: 560, h: 396, src: "stated" },
      { stem: "Final_Proposals_1_", title: "Environment \u2014 Proposed Planning Strategies", note: "", pages: 15, mb: 3.7, w: 560, h: 396 },
      { stem: "SITE_DESIGN_AATISH", title: "Site Design", note: "", pages: 10, mb: 3.5, w: 560, h: 315 },
      { stem: "Cream_and_Brown_Minimalist_Accountant_and_Bookkeeper_Marketing_Presentation_2_", title: "Shamli \u2014 Historical & Regional Context", note: "", pages: 18, mb: 4.3, w: 560, h: 315 },
      { stem: "Final_RegionalContext_AR", title: "Regional Context", note: "", pages: 6, mb: 3.6, w: 560, h: 396 },
      { stem: "add_stuff", title: "Housing \u2014 Characteristics & Approach", note: "", pages: 24, mb: 6.6, w: 560, h: 315 },
    ]
  },
  {
    inst: 'SPA New Delhi', key: "sem4", label: "Semester IV",
    meta: "Second year \u00b7 Jan\u2013May 2020",
    note: "Site context and analysis.",
    items: [
      { stem: "lit_study", title: "Indore \u2014 Site Context & Analysis", note: "The deck states 4th Semester.", pages: 5, mb: 3.5, w: 560, h: 396, src: "stated" },
      { stem: "jurygroupwork_1", title: "Group Jury \u2014 Studio", note: "", pages: 21, mb: 7.6, w: 560, h: 396 },
    ]
  },
  {
    inst: 'SPA New Delhi', key: "sem3", label: "Semester III",
    meta: "Second year \u00b7 Aug\u2013Dec 2019",
    note: "Transport, walkability and the street.",
    items: [
      { stem: "BEST_PRACTICE_BRO", title: "Transport Improvement & Sustainable Mobility", note: "Taimoor Nagar & New Friends Colony. The sheet states 3rd Semester.", pages: 2, mb: 1.3, w: 560, h: 395, src: "stated" },
      { stem: "WALKABILITY_FINAL_INTERNAL_JURY_make_sheet_size", title: "Walkability \u2014 Internal Jury", note: "", pages: 10, mb: 5.8, w: 560, h: 396 },
      { stem: "Walkability_Pedestrian_1", title: "Walkability & Pedestrian", note: "", pages: 2, mb: 1.8, w: 560, h: 396 },
      { stem: "external_street_final", title: "External Street \u2014 Final", note: "", pages: 5, mb: 9.1, w: 560, h: 792 },
      { stem: "ZOMBIE_A4_", title: "Street Audit \u2014 Scoring", note: "", pages: 13, mb: 1.0, w: 560, h: 388 },
    ]
  },
  {
    inst: 'SPA New Delhi', key: "sem2", label: "Semester II",
    meta: "First year \u00b7 Jan\u2013May 2019",
    note: "The first studios: a sector, a settlement, an economy.",
    items: [
      { stem: "SEC_21_A_noida", title: "Sector 21-A, Noida", note: "The sheets state II Semester, January 2019.", pages: 40, mb: 17.9, w: 560, h: 387, src: "stated" },
      { stem: "FARIDABAD_AA30", title: "Economic Activity \u2014 Firozabad", note: "", pages: 22, mb: 10.0, w: 560, h: 396 },
      { stem: "studio_AA", title: "Firozabad \u2014 Cottage Industries", note: "", pages: 25, mb: 6.9, w: 560, h: 315 },
      { stem: "booooom_final_pdf", title: "Studio \u2014 Final", note: "", pages: 9, mb: 5.5, w: 560, h: 395 },
      { stem: "site_plan_sheet", title: "Site Plan Sheet", note: "", pages: 1, mb: 0.2, w: 560, h: 376 },
    ]
  },
  {
    inst: 'SPA New Delhi', key: "research", label: "Internships & Research",
    meta: "2020 \u2013 2021",
    note: "Work done outside the studio sequence.",
    items: [
      { stem: "internship_assin", title: "The Pandemic in Two Cities", note: "Mumbai and Bhopal, Wave 1 and Wave 2.", pages: 13, mb: 0.7, w: 560, h: 792 },
      { stem: "Aatish_Kumar_Kathputli_Colony_Report", title: "Kathputli Colony \u2014 Draft Report", note: "In-situ rehabilitation, Delhi.", pages: 11, mb: 0.2, w: 560, h: 792 },
      { stem: "Aatish_planner_final", title: "Kevin A. Lynch \u2014 Planner Study", note: "", pages: 7, mb: 0.2, w: 560, h: 792 },
    ]
  },
];

/* ---------------------------------------------------------------------------
   INSTITUTIONS — the three places the planning work was done.

   `org` matches the org field already carried by every entry in PLAN_PROJECTS,
   so grouping needs no second list to be kept in sync. The descriptions are
   deliberately one line each: they exist to establish context, not to
   advertise the institution, and each states only what the institution is —
   never anything about the nature of my involvement, which belongs on the
   project itself.
   ------------------------------------------------------------------------ */
const INSTITUTIONS = [
  {
    org: 'All India Institute of Local Self-Government',
    short: 'AIILSG',
    cats: 'aiilsg',
    full: 'All India Institute of Local Self-Government',
    note: 'A premier, Government-recognised institute established in 1926, with a Pan-India presence, working in close association with State and Central Governments and with national and international agencies.'
  },
  {
    org: 'National Institute of Urban Affairs',
    short: 'NIUA',
    full: 'National Institute of Urban Affairs',
    note: 'A premier institute of the Ministry of Housing and Urban Affairs, Government of India, working across urban research, policy, capacity building and knowledge dissemination.'
  },
  {
    org: 'School of Planning and Architecture, New Delhi',
    short: 'SPA New Delhi',
    cats: 'spa',
    full: 'School of Planning and Architecture, New Delhi',
    note: 'An Institution of National Importance under an Act of Parliament, Ministry of Education, Government of India, imparting education in planning, architecture and design.'
  }
];

/* ---------------------------------------------------------------------------
   AIILSG — the seven categories the practice is organised into, in order.
   `key` is what each project's `cat` field points at.
   ------------------------------------------------------------------------ */
const AIILSG_CATEGORIES = [
  { key: 'infra',      label: 'Physical Infrastructure / Urban Planning' },
  { key: 'sbm',        label: 'Swachh Bharat Mission / IEC / BCC' },
  { key: 'waste',      label: 'Waste Management / Waste to Wealth' },
  { key: 'nulm',       label: 'NULM / Urban Livelihoods' },
  { key: 'riverfront', label: 'Urban Development / Riverfront' },
  { key: 'heritage',   label: 'Heritage / Beautification / Architectural Development' },
  { key: 'governance', label: 'Urban Governance / Institutional Work' }
];

/* ---------------------------------------------------------------------------
   SPA NEW DELHI — the academic sequence, using the same labels as the Archive
   so a project and its documents are filed under the same heading. Empty
   semesters are never printed.
   ------------------------------------------------------------------------ */
const SPA_CATEGORIES = [
  { key: 'thesis',   label: 'Thesis — Final Year' },
  { key: 'sem7',     label: 'Semester VII' },
  { key: 'sem6',     label: 'Semester VI' },
  { key: 'sem5',     label: 'Semester V' },
  { key: 'sem4',     label: 'Semester IV' },
  { key: 'sem3',     label: 'Semester III' },
  { key: 'sem2',     label: 'Semester II' },
  { key: 'sem1',     label: 'Semester I' },
  { key: 'research', label: 'Internships & Research' }
];

/* Which category list an institution uses, if any. */
const CATEGORY_SETS = { aiilsg: AIILSG_CATEGORIES, spa: SPA_CATEGORIES };
