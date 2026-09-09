/**
 * =========================================================================
 * GDGC TEAM MEMBERS DATA
 * =========================================================================
 * Structure:
 * 1. faculties: Faculty advisors & coordinators
 * 2. leads: Chapter executive leadership (President, Secretary, AIML Lead)
 * 3. domainGroups & domainHeads: 9 technical domains in exact sequence:
 *    1. Management
 *    2. Flutter
 *    3. Web + Cloud
 *    4. Competitive Programming
 *    5. AIML
 *    6. PR & Outreach
 *    7. UI/UX & Creative Head
 *    8. AR/VR
 *    9. IoT
 * =========================================================================
 */

export const faculties = [
  {
    id: 101,
    name: 'Prof. Kapil Tajane',
    designation: 'Faculty Coordinator',
    role: 'Faculty Coordinator',
    domain: 'Computer Engineering',
    subheading: 'Assistant Professor | CSE Department',
    bio: 'Prof. Kapil Tajane is an Assistant Professor with 12+ years of academic experience and expertise in Information Security. As the Faculty Coordinator of GDGC PCCOE, he mentors students and supports technical initiatives that foster innovation, collaboration, and continuous learning.',
    image: '/team/kapil-tajane.png',
    linkedinUrl: '#',
    googleScholarUrl: 'https://share.google/SW0riZ9DWRtlSkQFW',
    isFaculty: true,
    social: { linkedin: '#', scholar: 'https://share.google/SW0riZ9DWRtlSkQFW' },
    skills: ['Information Security', 'Academic Mentorship', 'Technical Initiatives', 'Cybersecurity'],
  },
  {
    id: 102,
    name: 'Mrs. Tanuja S. Patankar',
    designation: 'Faculty Coordinator',
    role: 'Faculty Coordinator',
    domain: 'Information Technology',
    subheading: 'Assistant Professor | IT Department',
    bio: 'Mrs. Tanuja S. Patankar is an Assistant Professor in the Department of Information Technology at Pimpri Chinchwad College of Engineering, with over 18 years of academic experience. Her areas of research interest include Algorithms, Image Processing, Video Processing, and Biometric Authentication. With her extensive experience and academic expertise, she is committed to fostering technical excellence, innovation, and the overall academic and professional development of students.',
    image: null,
    linkedinUrl: 'https://www.linkedin.com/in/tanuja-patankar-28965225b/',
    googleScholarUrl: 'https://share.google/cHr0kLv6BCH61M9h3',
    isFaculty: true,
    social: { linkedin: 'https://www.linkedin.com/in/tanuja-patankar-28965225b/', scholar: 'https://share.google/cHr0kLv6BCH61M9h3' },
    skills: ['Algorithms', 'Image Processing', 'Video Processing', 'Biometric Authentication'],
  },
];

/* =========================================================================
 * CHAPTER LEADS (Executive Leadership)
 * ========================================================================= */
export const leads = [
  {
    id: 1,
    name: 'Mayur Kharat',
    designation: 'President',
    role: 'President',
    domain: 'Management',
    image: '/team/mayur-kharat.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/mayur-kharat2006/',
    githubUrl: 'https://github.com/MayurKharat0390',
    quote: 'When I decide to do something, I make it happen.',
    social: {
      linkedin: 'https://www.linkedin.com/in/mayur-kharat2006/',
      github: 'https://github.com/MayurKharat0390',
    },
  },
  {
    id: 5,
    name: 'Sharvari Bangar',
    designation: '',
    role: '',
    domain: 'Management',
    image: null,
    linkedinUrl: '#',
    githubUrl: '#',
    quote: '',
    social: {
      linkedin: '#',
      github: '#',
    },
  },
  {
    id: 4,
    name: 'Soumil Chandra',
    designation: '',
    role: '',
    domain: 'Management',
    image: null,
    linkedinUrl: '#',
    githubUrl: '#',
    quote: '',
    social: {
      linkedin: '#',
      github: '#',
    },
  },
 /* {
    id: 2,
    name: 'Pankaj Pandit',
    designation: '',
    role: '',
    domain: 'Management',
    image: '/team/pankaj-pandit.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/pankaj-pandit-96b952318',
    githubUrl: 'https://github.com/parcosm04',
    quote: 'Curious by nature, Engineer by choice, Builder by passion.',
    social: {
      linkedin: 'https://www.linkedin.com/in/pankaj-pandit-96b952318',
      github: 'https://github.com/parcosm04',
    },
  },*/
];

/* =========================================================================
 * DOMAIN HEADS (9 DOMAINS IN EXACT SEQUENCE)
 * ========================================================================= */

// 1. Management
export const managementHeads = [
  {
    id: 1,
    name: 'Mayur Kharat',
    designation: 'President',
    role: 'President',
    domain: 'Management',
    image: '/team/mayur-kharat.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/mayur-kharat2006/',
    githubUrl: 'https://github.com/MayurKharat0390',
    quote: 'When I decide to do something, I make it happen.',
    social: {
      linkedin: 'https://www.linkedin.com/in/mayur-kharat2006/',
      github: 'https://github.com/MayurKharat0390',
    },
  },
  {
    id: 5,
    name: 'Sharvari Bangar',
    designation: '',
    role: '',
    domain: 'Management',
    image: null,
    linkedinUrl: '#',
    githubUrl: '#',
    quote: '',
    social: {
      linkedin: '#',
      github: '#',
    },
  },
  {
    id: 4,
    name: 'Soumil Chandra',
    designation: '',
    role: '',
    domain: 'Management',
    image: null,
    linkedinUrl: '#',
    githubUrl: '#',
    quote: '',
    social: {
      linkedin: '#',
      github: '#',
    },
  },
  {
    id: 2,
    name: 'Pankaj Pandit',
    designation: 'Secretary',
    role: 'Secretary',
    domain: 'Management',
    image: '/team/pankaj-pandit.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/pankaj-pandit-96b952318',
    githubUrl: 'https://github.com/parcosm04',
    quote: 'Curious by nature, Engineer by choice, Builder by passion.',
    social: {
      linkedin: 'https://www.linkedin.com/in/pankaj-pandit-96b952318',
      github: 'https://github.com/parcosm04',
    },
  },
];

// 2. Flutter
export const flutterHeads = [
  {
    id: 11,
    name: 'Himanshu Patil',
    designation: 'Flutter Head',
    role: 'Flutter Head',
    domain: 'Flutter',
    image: '/team/himanshu-patil.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/himanshupatil1111',
    githubUrl: 'https://github.com/himanshu-codes-1111',
    quote: 'I love working with a fun team',
    social: {
      linkedin: 'https://www.linkedin.com/in/himanshupatil1111',
      github: 'https://github.com/himanshu-codes-1111',
    },
  },
  {
    id: 12,
    name: 'Shreyash Dubewar',
    designation: 'Flutter Head',
    role: 'Flutter Head',
    domain: 'Flutter',
    image: '/team/shreyash-dubewar.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/shreyashdubewar',
    githubUrl: 'https://github.com/shreyash-devs',
    quote: "I don't believe in psychology, I believe in good moves",
    social: {
      linkedin: 'https://www.linkedin.com/in/shreyashdubewar',
      github: 'https://github.com/shreyash-devs',
    },
  },
];

// 3. Web + Cloud
export const webDevCloudHeads = [
  {
    id: 23,
    name: 'Sanika Mahendra Patil',
    designation: 'Web + Cloud Head',
    role: 'Web + Cloud Head',
    domain: 'Web + Cloud',
    image: '/team/sanika-patil.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/sanika-patil-644754327?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    githubUrl: 'https://github.com/sanikapatil01',
    quote: '',
    social: {
      linkedin: 'https://www.linkedin.com/in/sanika-patil-644754327?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      github: 'https://github.com/sanikapatil01',
    },
  },
  {
    id: 22,
    name: 'Yash Sonalekar',
    designation: 'Web + Cloud Head',
    role: 'Web + Cloud Head',
    domain: 'Web + Cloud',
    image: '/team/yash-sonalekar.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/yash-sonalekar',
    githubUrl: 'https://github.com/yash-dot-com',
    quote: 'You must understand that there are more than one path to the top of the mountain.',
    social: {
      linkedin: 'https://www.linkedin.com/in/yash-sonalekar',
      github: 'https://github.com/yash-dot-com',
    },
  },
  {
    id: 21,
    name: 'Sarang Wasamwar',
    designation: 'Web + Cloud Head',
    role: 'Web + Cloud Head',
    domain: 'Web + Cloud',
    image: '/team/sarang-wasamwar.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/sarang-wasamwar-31b48532b/',
    githubUrl: 'https://github.com/sarang-wasamwar',
    quote: 'One Day, All these late nights will make sense.',
    social: {
      linkedin: 'https://www.linkedin.com/in/sarang-wasamwar-31b48532b/',
      github: 'https://github.com/sarang-wasamwar',
    },
  },
  {
    id: 24,
    name: 'Manthan Marathe',
    designation: 'Web + Cloud Head',
    role: 'Web + Cloud Head',
    domain: 'Web + Cloud',
    image: '/team/manthan-marathe.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/manthanmarathe',
    githubUrl: 'https://github.com/ManthanMarathe223',
    quote: 'Progress, not perfection — chase growth, and mastery follows.',
    social: {
      linkedin: 'https://www.linkedin.com/in/manthanmarathe',
      github: 'https://github.com/ManthanMarathe223',
    },
  },
  {
    id: 25,
    name: 'Anushka Sachin Parkhi',
    designation: 'Web + Cloud Head',
    role: 'Web + Cloud Head',
    domain: 'Web + Cloud',
    image: '/team/anushka-parkhi.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/anushka-parkhi',
    githubUrl: 'https://github.com/wizboltez',
    quote: 'Here for the love of the game',
    social: {
      linkedin: 'https://www.linkedin.com/in/anushka-parkhi',
      github: 'https://github.com/wizboltez',
    },
  },
];

// 4. Competitive Programming
export const cpHeads = [
  {
    id: 31,
    name: 'Harsh Kawale',
    designation: 'CP Head',
    role: 'CP Head',
    domain: 'Competitive Programming',
    image: '/team/harsh-kawale.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/hmk-672b00351',
    githubUrl: 'https://github.com/HMK-007',
    quote: "Math is the engineer's ultimate leverage",
    social: {
      linkedin: 'https://www.linkedin.com/in/hmk-672b00351',
      github: 'https://github.com/HMK-007',
    },
  },
  {
    id: 32,
    name: 'Nishant Gawande',
    designation: 'CP Head',
    role: 'CP Head',
    domain: 'Competitive Programming',
    image: '/team/nishant-gawande.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/nishant-gawande-1b8388376?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
    githubUrl: 'https://github.com/Nishant333-stack',
    quote: 'tuff',
    social: {
      linkedin: 'https://www.linkedin.com/in/nishant-gawande-1b8388376?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
      github: 'https://github.com/Nishant333-stack',
    },
  },
];

// 5. AIML
export const aimlHeads = [
  {
    id: 41,
    name: 'Aaryan Nerkar',
    designation: 'AIML Head',
    role: 'AIML Head',
    domain: 'AIML',
    image: '/team/aaryan-nerkar.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/aaryan-nerkar-16214b2b7/',
    githubUrl: 'https://github.com/AaryanNerkar',
    quote: 'Like an evolving model, I learn from data, adapt to change, and turn every error into a better iteration',
    social: {
      linkedin: 'https://www.linkedin.com/in/aaryan-nerkar-16214b2b7/',
      github: 'https://github.com/AaryanNerkar',
    },
  },
  {
    id: 3,
    name: 'Harshwardhan Sambhaji Bavale',
    designation: 'AIML Head',
    role: 'AIML Head',
    domain: 'AIML',
    image: '/team/harshwardhan-bavale.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/harshwardhan-bavale-86007032b/',
    githubUrl: 'https://github.com/Harshal1712',
    quote: 'Stay curious. Keep building. Never stop growing.',
    social: {
      linkedin: 'https://www.linkedin.com/in/harshwardhan-bavale-86007032b/',
      github: 'https://github.com/Harshal1712',
    },
  },
  {
    id: 42,
    name: 'Aryan Dalvi',
    designation: 'AIML Head',
    role: 'AIML Head',
    domain: 'AIML',
    image: '/team/aryan-dalvi.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/aryan-dalvi-258690318/',
    githubUrl: 'https://github.com/AryanDalvi03',
    quote: 'The first responsibility of a leader is to define reality.',
    social: {
      linkedin: 'https://www.linkedin.com/in/aryan-dalvi-258690318/',
      github: 'https://github.com/AryanDalvi03',
    },
  },
  {
    id: 43,
    name: 'Om Kadu',
    designation: 'AIML Head',
    role: 'AIML Head',
    domain: 'AIML',
    image: '/team/om-kadu.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/omkadu786/',
    githubUrl: 'https://github.com/OmKadu786',
    quote: 'Code and have Fun.',
    social: {
      linkedin: 'https://www.linkedin.com/in/omkadu786/',
      github: 'https://github.com/OmKadu786',
    },
  },
];

// 6. IoT
export const iotHeads = [
  {
    id: 81,
    name: 'Harshwardhan Chitte',
    designation: 'IoT Head',
    role: 'IoT Head',
    domain: 'IoT',
    image: '/team/harshwardhan-chitte.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/harshwardhan-chitte-321717369',
    githubUrl: 'https://github.com/HarshwardhanChitte',
    quote: 'Seek to understand what lies beneath the obvious.',
    social: {
      linkedin: 'https://www.linkedin.com/in/harshwardhan-chitte-321717369',
      github: 'https://github.com/HarshwardhanChitte',
    },
  },
  {
    id: 82,
    name: 'Pankaj Pandit',
    designation: 'IoT Head',
    role: 'IoT Head',
    domain: 'IoT',
    image: '/team/pankaj-pandit.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/pankaj-pandit-96b952318',
    githubUrl: 'https://github.com/parcosm04',
    quote: 'Curious by nature, Engineer by choice, Builder by passion.',
    social: {
      linkedin: 'https://www.linkedin.com/in/pankaj-pandit-96b952318',
      github: 'https://github.com/parcosm04',
    },
  },
];

// Single-Head Domains (displayed in the final unified row)
// 7. Social Media
export const socialMediaHeads = [
  {
    id: 51,
    name: 'Prachi Pawar',
    designation: 'Social Media Head',
    role: 'Social Media Head',
    domain: 'Social Media',
    image: '/team/prachi-pawar.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/prachi-pawar-49483a350',
    githubUrl: 'https://github.com/prachi-3011',
    quote: "If everything seems under control, you're not going fast enough.",
    social: {
      linkedin: 'https://www.linkedin.com/in/prachi-pawar-49483a350',
      github: 'https://github.com/prachi-3011',
    },
  },
];

// 8. PR & Outreach
export const prOutreachHeads = [
  {
    id: 52,
    name: 'Prince Vallecha',
    designation: 'PR & Outreach Head',
    role: 'PR & Outreach Head',
    domain: 'PR & Outreach',
    image: null,
    linkedinUrl: '#',
    githubUrl: '#',
    quote: '',
    social: {
      linkedin: '#',
      github: '#',
    },
  },
];

// 9. UI/UX & Creative
export const uiUxCreativeHeads = [
  {
    id: 61,
    name: 'Samiksha Mote',
    designation: 'UI/UX Head',
    role: 'UI/UX Head',
    domain: 'UI/UX & Creative',
    image: '/team/samiksha-mote.jpg',
    linkedinUrl: 'https://in.linkedin.com/in/samiksha-mote-97a4a92b8',
    githubUrl: 'https://github.com/samiksha2644',
    quote: 'Just believe in yourself. The dots will somehow connect in your future.',
    social: {
      linkedin: 'https://in.linkedin.com/in/samiksha-mote-97a4a92b8',
      github: 'https://github.com/samiksha2644',
    },
  },
];

// 10. AR/VR
export const arVrHeads = [
  {
    id: 71,
    name: 'Srushti Jadhav',
    designation: 'AR/VR Head',
    role: 'AR/VR Head',
    domain: 'AR/VR',
    image: '/team/srushti-jadhav.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/srushtijadhav-',
    githubUrl: 'https://github.com/srushtijadhav18',
    quote: "Photons scattering off both the real and the rasterized - i don't discriminate",
    social: {
      linkedin: 'https://www.linkedin.com/in/srushtijadhav-',
      github: 'https://github.com/srushtijadhav18',
    },
  },
];

/* =========================================================================
 * DOMAIN GROUPS
 * ========================================================================= */
export const multiHeadDomainGroups = [
  {
    id: 'management',
    name: 'Management',
    description: 'Chapter executive leadership, operational coordination, and organizational management.',
    members: managementHeads,
  },
  {
    id: 'flutter',
    name: 'Flutter',
    description: 'Cross-platform mobile application development and modern UI engineering with Flutter.',
    members: flutterHeads,
  },
  {
    id: 'web-cloud',
    name: 'Web + Cloud',
    description: 'Full-stack web architecture, scalable backend systems, and Google Cloud infrastructure.',
    members: webDevCloudHeads,
  },
  {
    id: 'competitive-programming',
    name: 'Competitive Programming',
    description: 'Algorithmic problem solving, data structures, and competitive coding contests.',
    members: cpHeads,
  },
  {
    id: 'aiml',
    name: 'AIML',
    description: 'Machine learning models, artificial intelligence research, and intelligent data systems.',
    members: aimlHeads,
  },
  {
    id: 'iot',
    name: 'IoT',
    description: 'Internet of Things hardware integration, embedded systems, and sensor networks.',
    members: iotHeads,
  },
];

export const singleHeadDomainGroups = [
  {
    id: 'social-media',
    name: 'Social Media',
    description: 'Social media presence, digital branding, and online community engagement.',
    members: socialMediaHeads,
  },
  {
    id: 'pr-outreach',
    name: 'PR & Outreach',
    description: 'Public relations, campus community outreach, and strategic partnerships.',
    members: prOutreachHeads,
  },
  {
    id: 'ui-ux-creative',
    name: 'UI/UX & Creative',
    description: 'Visual design, design systems, and creative brand media.',
    members: uiUxCreativeHeads,
  },
  {
    id: 'ar-vr',
    name: 'AR/VR',
    description: 'Immersive experiences, augmented & virtual reality prototyping.',
    members: arVrHeads,
  },
];

export const domainGroups = [
  ...multiHeadDomainGroups,
  ...singleHeadDomainGroups,
];

export const domainHeads = [
  ...managementHeads,
  ...flutterHeads,
  ...webDevCloudHeads,
  ...cpHeads,
  ...aimlHeads,
  ...iotHeads,
  ...socialMediaHeads,
  ...prOutreachHeads,
  ...uiUxCreativeHeads,
  ...arVrHeads,
];

// Backward-compatible exports
export const coreTeam = leads;
export const domainLeads = domainHeads;
export const allTeam = [...faculties, ...leads, ...domainHeads];

/* =========================================================================
 * PREVIOUS MOCK DATA (PRESERVED - COMMENTED OUT PER PROJECT POLICY)
 * =========================================================================
export const _previousMockLeads = [
  {
    id: 1,
    name: 'Mayur Kharat',
    designation: 'Chapter Lead',
    role: 'Chapter Lead',
    domain: 'AI/ML & Cloud',
    bio: 'Passionate about making AI accessible to all students. Google Cloud Certified, leading chapter vision, technical workshops, and hackathons.',
    image: 'https://i.pravatar.cc/300?img=11',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#', twitter: '#', email: '#' },
    skills: ['TensorFlow', 'GCP', 'Python', 'Leadership'],
  },
  {
    id: 2,
    name: 'Soumil Chandra',
    designation: 'Co-Lead Organizer',
    role: 'Co-Lead Organizer',
    domain: 'Mobile & Web',
    bio: 'Cross-platform app specialist and system architect. Directs campus study jams, hackathons, and developer outreach programs.',
    image: 'https://i.pravatar.cc/300?img=3',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#', twitter: '#', email: '#' },
    skills: ['Flutter', 'React', 'TypeScript', 'System Design'],
  },
  {
    id: 3,
    name: 'Sharvari Bangar',
    designation: 'Co-Lead Organizer',
    role: 'Co-Lead Organizer',
    domain: 'Web & Cloud',
    bio: 'Full-stack software engineer building scalable web architectures and leading developer mentoring sprints across all branches.',
    image: 'https://i.pravatar.cc/300?img=5',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#', twitter: '#', email: '#' },
    skills: ['Next.js', 'Node.js', 'PostgreSQL', 'Docker'],
  },
];

export const _previousMockWebDevCloudHeads = [
  {
    id: 11,
    name: 'Harshwardhan Deshmukh',
    designation: 'Web Dev Head',
    role: 'Web Dev Head',
    domain: 'Web Dev + Cloud',
    bio: 'Frontend architect crafting interactive, ultra-fast web experiences with modern React 19 and Next.js ecosystems.',
    image: 'https://i.pravatar.cc/300?img=12',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#' },
    skills: ['React 19', 'Next.js', 'Tailwind', 'TypeScript'],
  },
  {
    id: 12,
    name: 'Riya Kulkarni',
    designation: 'Cloud & DevOps Head',
    role: 'Cloud & DevOps Head',
    domain: 'Web Dev + Cloud',
    bio: 'Cloud DevOps practitioner conducting Google Cloud Study Jams, Cloud Run deployments, and Kubernetes orchestration.',
    image: 'https://i.pravatar.cc/300?img=9',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#' },
    skills: ['GCP', 'Docker', 'Kubernetes', 'CI/CD'],
  },
  {
    id: 13,
    name: 'Rohan Sharma',
    designation: 'Full Stack Head',
    role: 'Full Stack Head',
    domain: 'Web Dev + Cloud',
    bio: 'Engineering microservice backends, RESTful APIs, and database performance tuning for large-scale web applications.',
    image: 'https://i.pravatar.cc/300?img=15',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#' },
    skills: ['Node.js', 'Go', 'PostgreSQL', 'Redis'],
  },
  {
    id: 14,
    name: 'Aditi Shinde',
    designation: 'Backend Engineering Head',
    role: 'Backend Engineering Head',
    domain: 'Web Dev + Cloud',
    bio: 'Specialist in backend authentication, real-time WebSockets, and serverless compute on Google Cloud Platform.',
    image: 'https://i.pravatar.cc/300?img=24',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#' },
    skills: ['Express', 'Python', 'Firebase', 'MongoDB'],
  },
  {
    id: 15,
    name: 'Tanmay Joshi',
    designation: 'Frontend Platform Head',
    role: 'Frontend Platform Head',
    domain: 'Web Dev + Cloud',
    bio: 'Performance advocate focused on fluid 60fps web animations, progressive web apps, and web accessibility standards.',
    image: 'https://i.pravatar.cc/300?img=33',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#' },
    skills: ['WebPerf', 'Three.js', 'CSS Architecture', 'Framer Motion'],
  },
];

export const _previousMockUiUxHeads = [
  {
    id: 21,
    name: 'Marcus Johnson',
    designation: 'Lead Product Designer',
    role: 'Lead Product Designer',
    domain: 'UI/UX',
    bio: 'Product and visual designer obsessed with modern design systems, micro-interactions, and visual storytelling.',
    image: 'https://i.pravatar.cc/300?img=8',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#' },
    skills: ['Figma', 'UI Systems', 'Prototyping', 'Design Tokens'],
  },
  {
    id: 22,
    name: 'Neha Kulkarni',
    designation: 'UI System Head',
    role: 'UI System Head',
    domain: 'UI/UX',
    bio: 'Building consistent multi-platform component libraries, typography hierarchies, and accessible design patterns.',
    image: 'https://i.pravatar.cc/300?img=20',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#' },
    skills: ['Design Systems', 'Figma', 'Accessibility', 'Color Theory'],
  },
  {
    id: 23,
    name: 'Aryan Patil',
    designation: 'Visual Interaction Head',
    role: 'Visual Interaction Head',
    domain: 'UI/UX',
    bio: 'Crafting responsive user interfaces, fluid micro-interactions, and engaging user journeys for campus software.',
    image: 'https://i.pravatar.cc/300?img=13',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#' },
    skills: ['Interaction Design', 'Wireframing', 'Framer', 'User Flows'],
  },
  {
    id: 24,
    name: 'Ananya Gupta',
    designation: 'UX Research Head',
    role: 'UX Research Head',
    domain: 'UI/UX',
    bio: 'Conducting student usability tests, information architecture surveys, and transforming data into intuitive experiences.',
    image: 'https://i.pravatar.cc/300?img=26',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#' },
    skills: ['User Research', 'Usability Testing', 'Heuristic Eval', 'Personas'],
  },
  {
    id: 25,
    name: 'Shreyas Verma',
    designation: 'Motion & Branding Head',
    role: 'Motion & Branding Head',
    domain: 'UI/UX',
    bio: 'Creating cinematic motion graphics, 3D product visualizations, and dynamic brand assets for GDGC events.',
    image: 'https://i.pravatar.cc/300?img=52',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#' },
    skills: ['Motion Graphics', 'Blender', 'Lottie', 'Brand Identity'],
  },
];

export const _previousMockManagementHeads = [
  {
    id: 31,
    name: 'Sarah Williams',
    designation: 'Community & PR Head',
    role: 'Community & PR Head',
    domain: 'Management',
    bio: 'Dedicated to cultivating inclusive student developer spaces. Directs campus partnerships and public relations.',
    image: 'https://i.pravatar.cc/300?img=25',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#' },
    skills: ['Public Relations', 'Community Building', 'Outreach', 'Networking'],
  },
  {
    id: 32,
    name: 'David Kim',
    designation: 'Operations & Logistics Head',
    role: 'Operations & Logistics Head',
    domain: 'Management',
    bio: 'Ensures every GDGC event runs seamlessly. Manages logistics, staging, and technical infrastructure for the chapter.',
    image: 'https://i.pravatar.cc/300?img=60',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#' },
    skills: ['Project Mgmt', 'Logistics', 'Staging', 'Vendor Coordination'],
  },
  {
    id: 33,
    name: 'Siddhesh Shinde',
    designation: 'Event Execution Head',
    role: 'Event Execution Head',
    domain: 'Management',
    bio: 'Directs on-ground event management, registration checkpoints, audience engagement, and audio-visual setups.',
    image: 'https://i.pravatar.cc/300?img=59',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#' },
    skills: ['Event Planning', 'Operations', 'Team Leadership', 'Crowd Mgmt'],
  },
  {
    id: 34,
    name: 'Sanika More',
    designation: 'Sponsorship & Outreach Head',
    role: 'Sponsorship & Outreach Head',
    domain: 'Management',
    bio: 'Connecting GDGC PCCOE with tech sponsors, industry mentors, and community partners to support student hackathons.',
    image: 'https://i.pravatar.cc/300?img=47',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#' },
    skills: ['Sponsorships', 'Partnerships', 'Budgeting', 'Negotiation'],
  },
  {
    id: 35,
    name: 'Pranav Kulkarni',
    designation: 'Media & Documentation Head',
    role: 'Media & Documentation Head',
    domain: 'Management',
    bio: 'Capturing event photography, producing aftermovies, and managing official GDGC reports and social documentation.',
    image: 'https://i.pravatar.cc/300?img=68',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#' },
    skills: ['Photography', 'Video Editing', 'Social Strategy', 'Content Writing'],
  },
];
========================================================================= */