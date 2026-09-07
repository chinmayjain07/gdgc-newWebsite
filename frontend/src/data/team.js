/**
 * =========================================================================
 * GDGC TEAM MEMBERS DATA
 * =========================================================================
 * To update or add team members, simply edit the objects in this file.
 * 
 * Fields:
 * - id: Unique numeric ID
 * - name: Full name of the member
 * - designation: Title/Role (e.g., "Lead Organizer", "Web Dev Lead")
 * - role: Kept identical to designation for backward compatibility
 * - domain: Department / Domain track
 * - bio: Short summary text shown on the back of the flip card
 * - image: Avatar image URL (using Pravatar demo placeholders with unique img IDs)
 * - linkedinUrl: LinkedIn profile URL (currently '#' for placeholder)
 * - githubUrl: GitHub profile URL (currently '#' for placeholder)
 * - social: Social media links object ({ linkedin: '#', github: '#', ... })
 * - skills: Array of top skill/tool badges
 * =========================================================================
 */

export const coreTeam = [
  {
    id: 1,
    name: 'Alexandra Chen',
    designation: 'Lead Organizer',
    role: 'Lead Organizer',
    domain: 'AI/ML & Cloud',
    bio: 'Passionate about making AI accessible to all students. Google Cloud Certified, leading technical workshops and hackathons.',
    image: 'https://i.pravatar.cc/150?img=1',
    linkedinUrl: '#',
    githubUrl: '#',
    social: {
      linkedin: '#',
      github: '#',
      twitter: '#',
      email: '#',
    },
    skills: ['TensorFlow', 'GCP', 'Python', 'Kubernetes'],
  },
  {
    id: 2,
    name: 'Rahul Sharma',
    designation: 'Co-Lead Organizer',
    role: 'Co-Lead Organizer',
    domain: 'Mobile & Web',
    bio: 'Cross-platform app specialist with 10+ published apps. Directs campus study jams and developer outreach programs.',
    image: 'https://i.pravatar.cc/150?img=3',
    linkedinUrl: '#',
    githubUrl: '#',
    social: {
      linkedin: '#',
      github: '#',
      twitter: '#',
      email: '#',
    },
    skills: ['Flutter', 'React', 'Dart', 'TypeScript'],
  },
  {
    id: 3,
    name: 'Priya Patel',
    designation: 'Technical Lead',
    role: 'Technical Lead',
    domain: 'Web & Cloud',
    bio: 'Full-stack software engineer building scalable web architectures and leading developer mentoring sprints.',
    image: 'https://i.pravatar.cc/150?img=5',
    linkedinUrl: '#',
    githubUrl: '#',
    social: {
      linkedin: '#',
      github: '#',
      twitter: '#',
      email: '#',
    },
    skills: ['Next.js', 'Node.js', 'PostgreSQL', 'Docker'],
  },
  {
    id: 4,
    name: 'Marcus Johnson',
    designation: 'Design Lead',
    role: 'Design Lead',
    domain: 'UI/UX & Design',
    bio: 'Product and visual designer obsessed with modern UI design systems, micro-interactions, and visual storytelling.',
    image: 'https://i.pravatar.cc/150?img=8',
    linkedinUrl: '#',
    githubUrl: '#',
    social: {
      linkedin: '#',
      github: '#',
      twitter: '#',
      email: '#',
    },
    skills: ['Figma', 'Framer', 'UI Systems', 'Motion'],
  },
  {
    id: 5,
    name: 'Sarah Williams',
    designation: 'Community Manager',
    role: 'Community Manager',
    domain: 'Community & Outreach',
    bio: 'Dedicated to cultivating inclusive and engaging student tech spaces. Directs campus partnerships and member relations.',
    image: 'https://i.pravatar.cc/150?img=9',
    linkedinUrl: '#',
    githubUrl: '#',
    social: {
      linkedin: '#',
      github: '#',
      twitter: '#',
      email: '#',
    },
    skills: ['Community', 'Events', 'Outreach', 'Networking'],
  },
  {
    id: 6,
    name: 'David Kim',
    designation: 'Operations Lead',
    role: 'Operations Lead',
    domain: 'Operations & Logistics',
    bio: 'Ensures every GDGC event runs seamlessly. Manages logistics, staging, and technical infrastructure for the team.',
    image: 'https://i.pravatar.cc/150?img=11',
    linkedinUrl: '#',
    githubUrl: '#',
    social: {
      linkedin: '#',
      github: '#',
      twitter: '#',
      email: '#',
    },
    skills: ['Project Mgmt', 'Logistics', 'AV Tech', 'Streaming'],
  },
];

export const domainLeads = [
  {
    id: 7,
    name: 'Emily Zhang',
    designation: 'AI/ML Domain Lead',
    role: 'AI/ML Domain Lead',
    domain: 'AI/ML',
    bio: 'NLP and deep learning researcher. Conducts hands-on neural network study jams and AI innovation sprints.',
    image: 'https://i.pravatar.cc/150?img=16',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#', twitter: '#' },
    skills: ['PyTorch', 'Transformers', 'NLP', 'Computer Vision'],
  },
  {
    id: 8,
    name: 'Carlos Mendez',
    designation: 'Mobile Domain Lead',
    role: 'Mobile Domain Lead',
    domain: 'Mobile',
    bio: 'Android specialist and Kotlin enthusiast. Hosts Android study jams and modern mobile design workshops.',
    image: 'https://i.pravatar.cc/150?img=12',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#', twitter: '#' },
    skills: ['Kotlin', 'Jetpack Compose', 'Flutter', 'Firebase'],
  },
  {
    id: 9,
    name: 'Aisha Rahman',
    designation: 'Web Domain Lead',
    role: 'Web Domain Lead',
    domain: 'Web',
    bio: 'Frontend architect and web performance advocate. Leads modern web frameworks workshops and open source jams.',
    image: 'https://i.pravatar.cc/150?img=20',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#', twitter: '#' },
    skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
  },
  {
    id: 10,
    name: 'James Liu',
    designation: 'Cloud Domain Lead',
    role: 'Cloud Domain Lead',
    domain: 'Cloud',
    bio: 'Cloud DevOps engineer. Leads Google Cloud study jams, certification tracks, and containerization labs.',
    image: 'https://i.pravatar.cc/150?img=33',
    linkedinUrl: '#',
    githubUrl: '#',
    social: { linkedin: '#', github: '#', twitter: '#' },
    skills: ['GCP', 'Kubernetes', 'Docker', 'CI/CD'],
  },
];

export const allTeam = [...coreTeam, ...domainLeads];