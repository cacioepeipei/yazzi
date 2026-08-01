const chatThread = document.getElementById('chat-thread');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const quickPills = document.querySelectorAll('.pill');
const resultsPanel = document.querySelector('.results-panel');
const scrollHint = document.getElementById('scroll-hint');
const generateButton = document.querySelector('.primary-btn');

const knowledgeBase = [
  {
    id: 'secondary-pathways',
    title: 'Explore post-secondary pathways and school options',
    agency: 'MOE / schools',
    appliesTo: ['secondary', 'education'],
    source: 'MOE education pathways',
    link: 'https://www.moe.gov.sg/post-secondary',
    lastUpdated: '2026-07-01',
    confidence: 'High',
    when: 'As early as possible before choosing your next school step',
    description: 'Compare polytechnic, junior college, ITE, and other pathways so your next step fits your goals.'
  },
  {
    id: 'student-loan',
    title: 'Check student loans, bursaries and financial aid',
    agency: 'MOE / financial aid',
    appliesTo: ['tertiary', 'student', 'loan', 'finance'],
    source: 'Financial aid information',
    link: 'https://www.moe.gov.sg/financial-matters/loans-grants-scholarships',
    lastUpdated: '2026-07-01',
    confidence: 'High',
    when: 'Before or soon after enrolment',
    description: 'Find out what support is available for tuition, living costs, and study expenses.'
  },
  {
    id: 'cpf-account',
    title: 'Set up CPF and Singpass so your work life is covered',
    agency: 'CPF / Singpass',
    appliesTo: ['graduate', 'job', 'working', 'singpass'],
    source: 'CPF Member Services',
    link: 'https://www.cpf.gov.sg/member',
    lastUpdated: '2026-07-01',
    confidence: 'High',
    when: 'Within 1 month of starting work',
    description: 'Make sure your CPF account and Singpass access are working so you can receive updates and manage future transactions.'
  },
  {
    id: 'mom-employment',
    title: 'Review employment basics such as salary and leave entitlements',
    agency: 'MOM',
    appliesTo: ['job', 'working', 'employment'],
    source: 'MOM employment resources',
    link: 'https://www.mom.gov.sg/employment-practices',
    lastUpdated: '2026-07-01',
    confidence: 'Medium',
    when: 'Soon after you start work',
    description: 'Understand your pay slips, leave entitlements, and key employment rights early.'
  },
  {
    id: 'iras-tax',
    title: 'Prepare for annual income tax filing',
    agency: 'IRAS',
    appliesTo: ['job', 'tax', 'income', 'working'],
    source: 'IRAS myTax Portal',
    link: 'https://mytax.iras.gov.sg',
    lastUpdated: '2026-07-01',
    confidence: 'High',
    when: 'By 15 April after the year you earned income',
    description: 'Check whether you need to file a tax return and keep your employment income records ready.'
  },
  {
    id: 'medishield',
    title: 'Review MediShield Life and health coverage',
    agency: 'MOH / CPF',
    appliesTo: ['graduate', 'healthcare', 'coverage', 'working', 'retirement'],
    source: 'MediShield Life',
    link: 'https://www.moh.gov.sg',
    lastUpdated: '2026-07-01',
    confidence: 'Medium',
    when: 'As soon as you start work or become a citizen',
    description: 'Use official information to check whether your situation requires a review of MediShield Life coverage.'
  },
  {
    id: 'hdb-eligibility',
    title: 'Check HDB and housing grant eligibility early',
    agency: 'HDB',
    appliesTo: ['housing', 'marriage', 'family', 'parenting'],
    source: 'HDB Flat Eligibility Tool',
    link: 'https://services2.hdb.gov.sg/webapp/BB33/FLATELIGIBILITY',
    lastUpdated: '2026-07-01',
    confidence: 'Medium',
    when: 'Before you commit to a housing timeline',
    description: 'Use the official eligibility tool to understand if you meet current eligibility conditions.'
  },
  {
    id: 'rom-planning',
    title: 'Plan your ROM timeline and marriage-related admin',
    agency: 'ROM / ICA / HDB',
    appliesTo: ['marriage', 'wedding', 'family'],
    source: 'Marriage and civil registration information',
    link: 'https://www.ica.gov.sg',
    lastUpdated: '2026-07-01',
    confidence: 'Medium',
    when: 'Several months before your planned wedding date',
    description: 'Make sure marriage registration and any home-planning steps line up with your timeline.'
  },
  {
    id: 'baby-bonus',
    title: 'Explore Baby Bonus and child-related support',
    agency: 'MSF / CPF / Baby Bonus',
    appliesTo: ['parenting', 'baby', 'family'],
    source: 'Baby Bonus',
    link: 'https://www.babybonus.gov.sg',
    lastUpdated: '2026-07-01',
    confidence: 'Medium',
    when: 'Before or soon after your baby arrives',
    description: 'Check government support for child-raising, childcare, and family expenses.'
  },
  {
    id: 'retirement-setup',
    title: 'Review retirement readiness and CPF LIFE planning',
    agency: 'CPF Board',
    appliesTo: ['retirement', 'elder', 'senior'],
    source: 'CPF retirement planning',
    link: 'https://www.cpf.gov.sg/member/retirement-income',
    lastUpdated: '2026-07-01',
    confidence: 'High',
    when: 'Before retirement or as you approach later life',
    description: 'Review your savings, healthcare planning, and retirement income options early.'
  },
  {
    id: 'ns-milestones',
    title: 'Keep NS and reservist milestones on your calendar',
    agency: 'MINDEF',
    appliesTo: ['ns', 'national-service'],
    source: 'MINDEF / SAF',
    link: 'https://www.mindef.gov.sg',
    lastUpdated: '2026-07-01',
    confidence: 'Medium',
    when: 'As soon as your service timeline is known',
    description: 'Track enlistment, reservist, and other service-related milestones that can affect your planning.'
  }
];

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseProfile(text) {
  const lower = text.toLowerCase();
  const profile = {
    graduate: /graduate|graduat|fresh grad|first job|started work/.test(lower),
    job: /job|work|employ|salary|income|career|employment|started work/.test(lower),
    housing: /move out|moving out|rent|house|hdb|bto|housing|home/.test(lower),
    ns: /ns|national service|army|reservist|servic/.test(lower),
    loan: /loan|debt|repay|student loan|bursary|financial aid/.test(lower),
    marriage: /marry|marriage|wed|rom|fiance|partner|spouse/.test(lower),
    tax: /tax|iras|income tax/.test(lower),
    secondary: /secondary|sec|o level|n level|jc|polytechnic|ite|schooling|school/.test(lower),
    tertiary: /tertiary|university|polytechnic|college|undergrad|nus|ntu|smu|sutd|student/.test(lower),
    parenting: /baby|child|pregnant|parent|children|kid|mum|dad|family/.test(lower),
    retirement: /retire|retirement|elder|senior|pension|old age|later years/.test(lower),
    healthcare: /health|medical|medi|shield|hospital|clinic/.test(lower),
    education: /study|school|course|education|academic/.test(lower)
  };

  return profile;
}

function isMeaningfulPrompt(text) {
  const trimmed = text.trim();
  if (!trimmed) return false;

  const lower = trimmed.toLowerCase();
  const hasLifeStageKeyword = /graduate|graduat|job|work|employ|salary|income|career|started work|move out|housing|hdb|bto|home|ns|national service|army|reservist|loan|debt|repay|student loan|marry|marriage|wed|rom|partner|spouse|tax|iras|secondary|polytechnic|ite|jc|university|college|student|baby|pregnant|parent|children|kid|mum|dad|family|retire|retirement|elder|senior|health|medical|medi|shield|hospital|clinic|study|school|course|education|academic/.test(lower);
  const hasEnoughWords = trimmed.split(/\s+/).filter(Boolean).length >= 3;

  return hasLifeStageKeyword && hasEnoughWords;
}

function selectTasks(profile) {
  const activeTags = [];

  if (profile.secondary) activeTags.push('secondary');
  if (profile.tertiary) activeTags.push('tertiary');
  if (profile.job || profile.graduate) activeTags.push('job');
  if (profile.housing) activeTags.push('housing');
  if (profile.marriage) activeTags.push('marriage');
  if (profile.parenting) activeTags.push('parenting');
  if (profile.retirement) activeTags.push('retirement');
  if (profile.ns) activeTags.push('ns');
  if (profile.tax) activeTags.push('tax');
  if (profile.healthcare) activeTags.push('healthcare');

  const matches = knowledgeBase.filter((item) => item.appliesTo.some((tag) => activeTags.includes(tag)));

  if (matches.length) {
    return matches.slice(0, 4);
  }

  if (profile.job || profile.graduate) {
    return knowledgeBase.filter((item) => ['cpf-account', 'iras-tax', 'medishield'].includes(item.id));
  }

  if (profile.housing) {
    return knowledgeBase.filter((item) => item.id === 'hdb-eligibility');
  }

  return knowledgeBase.slice(0, 3);
}

function retrieveRelevantGovernmentSignals(profile) {
  const suggestions = [];

  const addSuggestion = (title, description) => suggestions.push({ title, description });

  if (profile.secondary) {
    addSuggestion('Explore open houses and career talks', 'Attend school events, open houses, and talks to get a better feel for different post-secondary paths.');
    addSuggestion('Keep a simple decision tracker', 'Use a spreadsheet or notes app to compare courses, costs, and deadlines without getting overwhelmed.');
  }

  if (profile.job || profile.graduate) {
    addSuggestion('Try career-related community events', 'Keep an eye out for networking sessions, industry talks, and workshops that can help you grow beyond your first job.');
    addSuggestion('Create a life admin tracker', 'A shared spreadsheet or calendar can help you track deadlines for CPF, tax, insurance, and other paperwork.');
  }

  if (profile.housing) {
    addSuggestion('Browse housing seminars or talks', 'Community talks and HDB information sessions can be useful even if you are still exploring options.');
    addSuggestion('Start a moving checklist', 'A simple checklist for packing, budget, and key documents can make a future move feel much more manageable.');
  }

  if (profile.marriage) {
    addSuggestion('Look at wedding and family events', 'Community wedding fairs and family events can provide ideas and practical inspiration.');
    addSuggestion('Keep a shared planning document', 'A collaborative notes document can help you track vendors, dates, and household admin.');
  }

  if (profile.parenting) {
    addSuggestion('Look into baby and parenting classes', 'Community classes or workshops can help you prepare for routines, health appointments, and family life.');
    addSuggestion('Create a baby readiness checklist', 'A simple checklist for baby gear, appointments, and documents can make the transition feel much calmer.');
  }

  if (profile.retirement) {
    addSuggestion('Explore senior community programmes', 'Look out for talks, workshops, and community events that cover health and later-life planning.');
    addSuggestion('Use a retirement checklist', 'A simple tracker can help you review savings, healthcare appointments, and personal admin over time.');
  }

  if (profile.ns) {
    addSuggestion('Follow community and service updates', 'Keep an eye on relevant announcements and events that might affect your planning.');
    addSuggestion('Build a personal milestone calendar', 'A calendar or spreadsheet makes it much easier to track service dates and prep tasks.');
  }

  return suggestions.slice(0, 4);
}

function triggerResultsGlow() {
  resultsPanel.classList.remove('glow');
  void resultsPanel.offsetWidth;
  resultsPanel.classList.add('glow');
  window.setTimeout(() => {
    resultsPanel.classList.remove('glow');
  }, 1400);
}

function showScrollHint() {
  if (!scrollHint) return;
  scrollHint.classList.add('show');
  window.setTimeout(() => {
    scrollHint.classList.remove('show');
  }, 2200);
}

function renderResponse(text) {
  const profile = parseProfile(text);
  const tasks = selectTasks(profile);
  const signals = retrieveRelevantGovernmentSignals(profile);

  const messageGroup = document.createElement('div');
  messageGroup.className = 'message-group';

  const userMessage = document.createElement('div');
  userMessage.className = 'message user';
  userMessage.innerHTML = `<strong>You</strong><p>${escapeHtml(text)}</p>`;

  const assistantMessage = document.createElement('div');
  assistantMessage.className = 'message';
  assistantMessage.innerHTML = `
    <h3>Personalized checklist</h3>
    <ul class="checklist">
      ${tasks.map((task) => `
        <li class="check-item">
          <strong>${escapeHtml(task.title)}</strong>
          <div class="meta">${escapeHtml(task.when)} • ${escapeHtml(task.agency)}</div>
          <div class="meta">${escapeHtml(task.description)}</div>
          <div class="meta"><a href="${escapeHtml(task.link)}" target="_blank" rel="noreferrer">Official source</a> • Last updated ${escapeHtml(task.lastUpdated)}</div>
        </li>
      `).join('')}
    </ul>
    <h3 class="subheader">Things you can try:</h3>
    <ul class="benefit-list">
      ${signals.map((item) => `
        <li class="benefit-item">
          <strong>${escapeHtml(item.title)}</strong>
          <div class="meta">${escapeHtml(item.description)}</div>
        </li>
      `).join('')}
    </ul>
    <p class="disclaimer">This is a navigation/checklist prototype, not a financial or legal advisor. Verify anything with high personal impact through official government channels.</p>
  `;

  messageGroup.appendChild(userMessage);
  messageGroup.appendChild(assistantMessage);
  chatThread.prepend(messageGroup);
  chatThread.scrollTop = 0;
  triggerResultsGlow();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text || !isMeaningfulPrompt(text)) {
    if (input) {
      input.value = '';
    }
    return;
  }

  if (generateButton) {
    const rect = generateButton.getBoundingClientRect();
    const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
    if (!isVisible) {
      showScrollHint();
      window.scrollTo({
        top: resultsPanel.offsetTop - 20,
        behavior: 'smooth'
      });
    }
  }

  renderResponse(text);
  form.reset();
});

quickPills.forEach((pill) => {
  pill.addEventListener('click', () => {
    input.value = pill.dataset.example;
    input.focus();
  });
});

window.addEventListener('DOMContentLoaded', () => {
  if (input) {
    input.value = '';
  }
});
