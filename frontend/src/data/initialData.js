// frontend/src/data/initialData.js

/**
 * ============================================================================
 * INITIAL AUTHORITATIVE DATASETS
 * Default data for Events, Posters, and Student Achievements
 * ============================================================================
 */

export const INITIAL_EVENTS = [
  {
    id: '1',
    title: 'POWER BI - SESSION',
    date: '24/01/2026',
    time: '10:00 AM - 04:00 PM',
    venue: 'Seminar Hall, INFO INSTITUTE OF ENGINEERING',
    type: 'Session',
    description: 'Practical knowledge of Power BI for transforming raw data into interactive dashboards.',
    fullDetails:
      'Participants will gain practical knowledge of Power BI and learn how to transform raw data into meaningful insights through data visualization and interactive dashboards. The session will cover data import, data cleaning, data modeling, DAX basics, report creation, and dashboard development to support effective data-driven decision-making.',
    link: '#',
    images: [
      '/Events/PowerBi_1.png',
      '/Events/PowerBi_2.png',
      '/Events/PowerBi_3.png'
    ]
  },
  {
    id: '2',
    title: 'GITHUB - WORKSHOP',
    date: '24/01/2026',
    time: '10:00 AM - 04:00 PM',
    venue: 'Seminar Hall, INFO INSTITUTE OF ENGINEERING',
    type: 'Workshop',
    description: 'Introduction to version control, repositories, commits, branches, and pull requests.',
    fullDetails:
      'The GitHub Workshop introduced participants to version control and collaborative development. Participants gained practical exposure to repositories, commits, branches, pull requests, and project collaboration.',
    link: '#',
    images: ['/Events/Github_1.png', '/Events/Github_2.png']
  },
  {
    id: '3',
    title: 'RAG BASICS - SESSION',
    date: '28/01/2026',
    time: '10:00 AM - 04:00 PM',
    venue: 'Seminar Hall, INFO INSTITUTE OF ENGINEERING',
    type: 'Session',
    description: 'Fundamentals of Retrieval-Augmented Generation (RAG) and context-aware AI systems.',
    fullDetails:
      'The session introduced participants to the fundamentals of Retrieval-Augmented Generation (RAG), including how AI systems retrieve relevant information and generate context-aware responses.',
    link: '#',
    images: [
      '/Events/Rag_basics_1.png',
      '/Events/Rag_basics_2.png',
      '/Events/Rag_basics_3.png',
      '/Events/Rag_basics_4.png'
    ]
  },
  {
    id: '4',
    title: 'RPA - Build Your Own Automation Bot - Guest Lecture',
    date: '14/02/2026',
    time: '10:00 AM - 04:00 PM',
    venue: 'Seminar Hall, INFO INSTITUTE OF ENGINEERING',
    type: 'Guest Lecture',
    description: 'Insights into Robotic Process Automation (RPA) and automated bot creation.',
    fullDetails:
      'Participants will gain insights into Robotic Process Automation (RPA) and learn how automation bots can automate repetitive tasks efficiently. The session will cover RPA concepts, workflow automation, bot creation, and real-world applications.',
    link: '#',
    images: ['/Events/Rpa_1.png', '/Events/Rpa_2.png', '/Events/Rpa_3.png']
  },
  {
    id: '5',
    title: 'UiPath - Hands-on Training',
    date: '14/02/2026',
    time: '10:00 AM - 04:00 PM',
    venue: 'Seminar Hall, INFO INSTITUTE OF ENGINEERING',
    type: 'Hands-on',
    description: 'Practical training on UiPath to design automated workflows and automation solutions.',
    fullDetails:
      'Participants will explore UiPath through practical activities and learn how to design automated workflows, manage tasks, and create simple automation solutions. The session will provide an interactive introduction to building efficient automation using UiPath.',
    link: '#',
    images: ['/Events/uipath_1.png', '/Events/uipath_2.png', '/Events/uipath_3.png']
  },
  {
    id: '6',
    title: 'Placement Preparation - 6th Semester - Hands-on',
    date: '6th Sem 2026',
    time: '10:30 AM - 04:30 PM',
    venue: 'INFO INSTITUTE OF ENGINEERING',
    type: 'Hands-on',
    description: 'Placement preparation covering aptitude, technical skills, resume building, and interviews.',
    fullDetails:
      'A placement-focused session designed to help students prepare for upcoming recruitment opportunities. The session will cover aptitude, technical skills, communication, resume building, and interview preparation, helping students approach placements with greater confidence.',
    link: '#',
    images: ['/Events/Rag_1.png', '/Events/Rag_2.png', '/Events/Rag_3.png']
  },
  {
    id: '7',
    title: 'Industrial Visit - Soften Technologies',
    date: '27/02/2026 - 28/02/2026',
    time: 'Full-day',
    venue: 'Cochin',
    type: 'Industrial Visit',
    description: 'Practical industrial visit exploring real-world IT technologies and workplace practices.',
    fullDetails:
      'Students will gain industry exposure through a practical visit to Soften Technologies, exploring real-world technologies, workplace practices, and the application of technical skills in the IT industry.',
    link: '#',
    images: ['/Events/IV_1.png', '/Events/IV_2.png', '/Events/IV_3.png']
  },
  {
    id: '8',
    title: 'Industry Internship Program',
    date: 'July 2026',
    time: 'Full Duration',
    venue: 'Coimbatore',
    type: 'Internship',
    description: 'Practical industry experience through an internship program in Coimbatore.',
    fullDetails:
      'Students will gain practical industry experience through an internship program in Coimbatore, helping them apply their academic knowledge, develop technical skills, and understand real-world professional environments.',
    link: '#',
    images: ['/Events/Intern_1.png', '/Events/Intern_2.png']
  },
  {
    id: '9',
    title: 'SYMPOSIUM - INFEST 2K26',
    date: '22/02/2026',
    time: 'Full-day',
    venue: 'INFO INSTITUTE OF ENGINEERING',
    type: 'Symposium',
    description: 'Departmental technical symposium celebrating innovation, technology, and talent.',
    fullDetails:
      'A departmental symposium that brings together innovation, technology, and talent. INFEST 2K26 provides a platform for students to showcase their technical knowledge, creativity, and skills through exciting events, competitions, and interactive activities.',
    link: '#',
    images: ['/Events/Symp_1.png', '/Events/Symp_2.png', '/Events/Symp_3.png']
  }
];

export const INITIAL_POSTERS = [
  {
    id: 'poster-1',
    title: 'POWER BI - HANDS-ON SESSION',
    category: 'Workshop',
    date: '24/01/2026',
    image: '/Events/PowerBi_1.png',
    gradient: ['#00d2ff', '#0078d4'],
    description: 'Transforming raw data into meaningful business intelligence dashboards and interactive analytics.',
    fullDetails: 'The Power BI masterclass provided hands-on training for students to master data modeling, DAX queries, and dashboard storytelling for real-world business analytics.'
  },
  {
    id: 'poster-2',
    title: 'GITHUB - COLLABORATIVE WORKSHOP',
    category: 'Workshop',
    date: '24/01/2026',
    image: '/Events/Github_1.png',
    gradient: ['#6366f1', '#a855f7'],
    description: 'Mastering modern version control, repository workflows, branch management, and open-source collaboration.',
    fullDetails: 'Participants engaged in collaborative git practices including pull request reviews, rebasing, merge conflict resolution, and GitHub Actions CI/CD pipelines.'
  },
  {
    id: 'poster-3',
    title: 'RETRIEVAL-AUGMENTED GENERATION (RAG)',
    category: 'AI & Data',
    date: '28/01/2026',
    image: '/Events/Rag_basics_1.png',
    gradient: ['#00f2fe', '#4facfe'],
    description: 'Context-aware intelligence architectures combining vector databases with large language models.',
    fullDetails: 'Deep dive into retrieval pipelines, embedding chunking strategies, semantic search, and grounding AI agent responses with authoritative institutional knowledge.'
  },
  {
    id: 'poster-4',
    title: 'RPA - BUILD YOUR OWN AUTOMATION BOT',
    category: 'Automation',
    date: '14/02/2026',
    image: '/Events/Rpa_1.png',
    gradient: ['#ff0844', '#ffb199'],
    description: 'Guest lecture and live bot building covering end-to-end Robotic Process Automation pipelines.',
    fullDetails: 'Students discovered how autonomous software bots execute repetitive business tasks across enterprise systems, error handling, and orchestrator triggers.'
  },
  {
    id: 'poster-5',
    title: 'UiPath - HANDS-ON AUTOMATION TRAINING',
    category: 'Hands-on',
    date: '14/02/2026',
    image: '/Events/uipath_1.png',
    gradient: ['#fa709a', '#fee140'],
    description: 'Interactive workflow automation design, desktop recording, and bot deployment using UiPath Studio.',
    fullDetails: 'An interactive session introducing robotic process automation patterns, custom activity packages, and workflow scheduling for enterprise automation.'
  },
  {
    id: 'poster-6',
    title: 'INFEST 2K26 - NATIONAL TECHNICAL SYMPOSIUM',
    category: 'Symposium',
    date: '22/02/2026',
    image: '/Events/Symp_1.png',
    gradient: ['#f72585', '#7209b7'],
    description: 'Annual flagship symposium showcasing coding championships, project expos, technical presentations, and talent.',
    fullDetails: 'The flagship departmental festival bringing together engineering colleges across the state for competitive coding, hack sprints, paper presentations, and robotics.'
  },
  {
    id: 'poster-7',
    title: 'INDUSTRIAL VISIT - SOFTEN TECHNOLOGIES',
    category: 'Industrial',
    date: '27/02/2026 - 28/02/2026',
    image: '/Events/IV_1.png',
    gradient: ['#00c6ff', '#0072ff'],
    description: 'On-site industrial learning expedition to Cochin exploring live cloud environments and enterprise IT culture.',
    fullDetails: 'Students experienced firsthand how commercial software architectures are managed, monitored, and scaled in high-availability production cloud clusters.'
  },
  {
    id: 'poster-8',
    title: 'INDUSTRY INTERNSHIP PROGRAM 2026',
    category: 'Internship',
    date: 'July 2026',
    image: '/Events/Intern_1.png',
    gradient: ['#43e97b', '#38f9d7'],
    description: 'Immersive corporate engineering internships providing real-world development experience in Coimbatore.',
    fullDetails: 'Comprehensive internship cohort placing students alongside senior developers to build production client applications and gain invaluable software engineering competence.'
  },
  {
    id: 'poster-9',
    title: 'EXCELLENCE & INNOVATION MILESTONE',
    category: 'Achievement',
    date: '2026',
    image: '/Achievements/Achievements_1.png',
    gradient: ['#f857a6', '#ff5858'],
    description: 'Honoring outstanding performance, awards, and technical triumphs achieved by INTELLIQ students.',
    fullDetails: 'Celebrating prestigious recognitions won at national conferences, hackathons, and symposiums by our dedicated student innovators.'
  },
  {
    id: 'poster-10',
    title: 'NATIONAL HACKATHON CHAMPIONSHIP',
    category: 'Achievement',
    date: '2026',
    image: '/Achievements/Achievements_2.png',
    gradient: ['#f12711', '#f5af19'],
    description: 'First prize and championship laurels earned in competitive rapid-prototyping tournaments.',
    fullDetails: 'Our student teams secured top honors for developing autonomous AI systems solving pressing industrial challenges in 36-hour non-stop hackathons.'
  }
];

export const INITIAL_ACHIEVEMENTS = [
  '/Achievements/Achievements_1.png',
  '/Achievements/Achievements_2.png',
  '/Achievements/Achievements_3.png',
  '/Achievements/Achievements_4.png',
  '/Achievements/Achievements_5.png',
  '/Achievements/Achievements_6.png',
  '/Achievements/Achievements_7.png',
  '/Achievements/Achievements_8.png',
  '/Achievements/Achievements_9.png',
  '/Achievements/Achievements_10.png',
  '/Achievements/Achievements_11.png',
  '/Achievements/Achievements_12.png',
  '/Achievements/Achievements_13.png'
];
