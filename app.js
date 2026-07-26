const chatThread = document.getElementById('chat-thread');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const quickPills = document.querySelectorAll('.pill');

const knowledgeBase = [
  {
    id: 'cpf-account',
    title: 'Confirm your CPF and Singpass setup',
    agency: 'CPF / Singpass',
    appliesTo: ['graduate', 'job', 'singpass'],
    source: 'CPF Member Services',
    link: 'https://www.cpf.gov.sg/member',
    lastUpdated: '2026-07-01',
    confidence: 'High',
    when: 'Within 1 month of starting work',
    description: 'Make sure your CPF account and Singpass access are working so you can receive updates and manage future transactions.'
  },
  {
    id: 'iras-tax',
    title: 'Prepare for annual income tax filing',
    agency: 'IRAS',
    appliesTo: ['graduate', 'job', 'tax'],
    source: 'IRAS myTax Portal',
    link: 'https://mytax.iras.gov.sg',
    lastUpdated: '2026-07-01',
    confidence: 'High',
    when: 'By 15 April after the year you earned income',
    description: 'Check whether you need to file a tax return and keep your employment income records ready.'
  },
  {
    id: 'medishield',
    title: 'Review MediShield Life coverage',
    agency: 'MOH / CPF',
    appliesTo: ['graduate', 'healthcare', 'coverage'],
    source: 'MediShield Life',
    link: 'https://www.moh.gov.sg',
    lastUpdated: '2026-07-01',
    confidence: 'Medium',
    when: 'As soon as you start work or become a citizen',
    description: 'Use official information to check whether your situation requires a review of MediShield Life coverage.'
  },
  {
    id: 'hdb-eligibility',
    title: 'Check HDB / BTO eligibility early if housing is part of your plan',
    agency: 'HDB',
    appliesTo: ['housing', 'graduate', 'move'],
    source: 'HDB Flat Eligibility Tool',
    link: 'https://services2.hdb.gov.sg/webapp/BB33/FLATELIGIBILITY',
    lastUpdated: '2026-07-01',
    confidence: 'Medium',
    when: 'Before you commit to a housing timeline',
    description: 'Use the official eligibility tool to understand if you meet current eligibility conditions.'
  },
  {
    id: 'student-loan',
    title: 'Check your student loan repayment schedule',
    agency: 'MOE / loan servicer',
    appliesTo: ['student-loan', 'graduate', 'loan'],
    source: 'Student loan repayment information',
    link: 'https://www.moe.gov.sg/financial-matters/loans-grants-scholarships',
    lastUpdated: '2026-07-01',
    confidence: 'Medium',
    when: 'At the start of your repayment cycle',
    description: 'Confirm your repayment start date and the official contact channel for your loan.'
  }
];

function parseProfile(text) {
  const lower = text.toLowerCase();
  const profile = {
    graduate: /graduate|graduat|stud|university|polytechnic|school/.test(lower),
    job: /job|work|employ|salary|income|start work/.test(lower),
    housing: /move out|moving out|rent|house|hdb|bto|housing/.test(lower),
    ns: /ns|national service|army|servic/.test(lower),
    loan: /loan|debt|repay|student loan/.test(lower),
    marriage: /marry|marriage|wed|rom/.test(lower),
    tax: /tax|iras|income tax/.test(lower)
  };

  return profile;
}

function selectTasks(profile) {
  return knowledgeBase.filter((item) => {
    const matches = item.appliesTo.some((keyword) => {
      if (keyword === 'graduate' && profile.graduate) return true;
      if (keyword === 'job' && profile.job) return true;
      if (keyword === 'housing' && profile.housing) return true;
      if (keyword === 'move' && profile.housing) return true;
      if (keyword === 'loan' && profile.loan) return true;
      if (keyword === 'marriage' && profile.marriage) return true;
      if (keyword === 'tax' && profile.tax) return true;
      if (keyword === 'healthcare' && (profile.job || profile.graduate)) return true;
      if (keyword === 'singpass' && (profile.job || profile.graduate)) return true;
      return false;
    });

    if (!matches && profile.job && profile.graduate) {
      return item.id === 'cpf-account' || item.id === 'iras-tax' || item.id === 'medishield';
    }

    return matches;
  });
}

function buildTrace(profile, tasks) {
  const trace = [
    `Parsed your input into a life-stage profile: graduate=${profile.graduate}, first job=${profile.job}, housing=${profile.housing}, NS=${profile.ns}.`,
    `Initiated tool-like retrieval for government sources covering CPF, income tax, healthcare, and housing.`,
    `Filtered ${tasks.length} relevant checklist items based on your situation and the current demo knowledge base.`,
    `Added official source links and visible confidence labels for each generated item.`
  ];

  if (profile.ns) {
    trace.push('Included an additional reminder path for NS-related life-stage milestones in the reasoning trace.');
  }

  if (profile.marriage) {
    trace.push('Added a marriage-related follow-up path because the input mentioned major life events.');
  }

  return trace;
}

function renderResponse(text) {
  const profile = parseProfile(text);
  const tasks = selectTasks(profile);
  const trace = buildTrace(profile, tasks);

  const userMessage = document.createElement('div');
  userMessage.className = 'message user';
  userMessage.innerHTML = `<strong>You</strong><p>${text}</p>`;
  chatThread.appendChild(userMessage);

  const assistantMessage = document.createElement('div');
  assistantMessage.className = 'message';
  assistantMessage.innerHTML = `
    <h3>Agent reasoning trace</h3>
    <ul class="trace-list">
      ${trace.map((item) => `<li class="trace-item">${item}</li>`).join('')}
    </ul>
    <h3 style="margin-top: 14px;">Personalized checklist</h3>
    <ul class="checklist">
      ${tasks.map((task) => `
        <li class="check-item">
          <strong>${task.title}</strong>
          <div class="meta">${task.when} • ${task.agency} <span class="badge">Confidence: ${task.confidence}</span></div>
          <div class="meta">${task.description}</div>
          <div class="meta"><a href="${task.link}" target="_blank" rel="noreferrer">Official source</a> • Last updated ${task.lastUpdated}</div>
        </li>
      `).join('')}
    </ul>
    <p class="disclaimer">This is a navigation/checklist prototype, not a financial or legal advisor. Verify anything with high personal impact through official government channels.</p>
  `;

  chatThread.appendChild(assistantMessage);
  chatThread.scrollTop = chatThread.scrollHeight;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
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
  renderResponse('I just graduated, got my first job, and I want a checklist for the first few months.');
});
