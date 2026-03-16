(async () => {

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const waitForElement = async (selector, timeout = 7000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const el = document.querySelector(selector);
    if (el) return el;
    await delay(120);
  }
  return null;
};

const FRONTEND_KEYWORDS = [
  "react",
  "frontend",
  "front-end",
  "javascript",
  "next.js",
  "nextjs",
  "ui engineer",
  "web developer",
  "full stack",
  "full-stack"
];

const SENIOR_KEYWORDS = [
  "senior",
  "lead",
  "principal",
  "staff",
  "architect",
  "manager",
  "director",
  "head"
];

const EXPERIENCE_REGEX = /\b([5-9]|\d{2,})\+?\s*(years|yrs|y)\b/i;

const applicationText = `Hi,

I'm a Frontend-Focused Full Stack Developer and MCA graduate (2025) with strong experience building responsive web applications using React.js, Next.js, JavaScript (ES6+), and Tailwind CSS.

During my Frontend Developer internship at Unified Mentor Pvt. Ltd., I developed reusable UI components, integrated REST APIs, and improved application performance and usability.

I’ve also built real-world projects including a Job Portal, Doctor Appointment System, and a full-stack Hotel Booking platform using React, Node.js, Express, and MongoDB.

Tech Stack:
Frontend: React.js, Next.js, Redux, Tailwind CSS
Backend: Node.js, Express.js, REST APIs
Databases: MongoDB, MySQL
Tools: Git, GitHub, Postman, Docker (basic), CI/CD basics
Workflow: Agile, Scrum

Portfolio: https://devesh-portfolio-peach.vercel.app/
GitHub: https://github.com/deveshgoel27
LinkedIn: https://www.linkedin.com/in/devesh-goel/

Best,
Devesh`;

const companyInterestText = `I'm excited about the opportunity to work with a product-focused team building real-world software solutions. The role aligns with my experience in React.js, Next.js, and modern JavaScript development, and I'm eager to contribute while continuing to learn and grow as a developer in a collaborative engineering environment.`;

let applied = 0;
let skipped = 0;
let scrollCount = 0;

const processedButtons = new Set();

console.log("🚀 Wellfound Smart Auto Apply Started");

const textIncludesAny = (text, arr) => {
  const lower = (text || "").toLowerCase();
  return arr.some(word => lower.includes(word));
};

const shouldSkipJob = () => {

  const modal = document.querySelector('[data-test="JobDescriptionSlideIn"]') || document.body;

  const title = modal.querySelector("h1,h2")?.innerText || "";
  const description = modal.innerText || "";

  if (textIncludesAny(title, SENIOR_KEYWORDS) || textIncludesAny(description, SENIOR_KEYWORDS)) {
    console.log("⏭️ Skipping Senior Role");
    return true;
  }

  if (EXPERIENCE_REGEX.test(description)) {
    console.log("⏭️ Skipping 5+ years role");
    return true;
  }

  if (!textIncludesAny(title, FRONTEND_KEYWORDS) && !textIncludesAny(description, FRONTEND_KEYWORDS)) {
    console.log("⏭️ Skipping Non-Frontend role");
    return true;
  }

  return false;
};

const fillApplicationFields = () => {

  const textareas = document.querySelectorAll("textarea");

  textareas.forEach(area => {

    const labelText = area.labels?.[0]?.innerText?.toLowerCase() || "";
    const placeholder = area.placeholder?.toLowerCase() || "";

    if (labelText.includes("interest") || placeholder.includes("interest")) {

      area.value = companyInterestText;
      area.dispatchEvent(new Event("input", { bubbles: true }));

      console.log("💬 Filled company interest question");

    } else {

      area.value = applicationText;
      area.dispatchEvent(new Event("input", { bubbles: true }));

      console.log("📝 Filled main application message");

    }

  });

};

const handleCustomQuestions = () => {

  const groups = document.querySelectorAll('[data-test^="RadioGroup-customQuestionAnswers"]');

  groups.forEach(group => {

    const radios = group.querySelectorAll('input[type="radio"]');

    if (radios.length === 3) radios[1].click();
    if (radios.length === 2) radios[0].click();

  });

};

const processBatch = async () => {

  let buttons = [...document.querySelectorAll('button[data-test="LearnMoreButton"]')];

  buttons = buttons.filter(btn => !processedButtons.has(btn));

  if (buttons.length === 0) return false;

  for (let btn of buttons) {

    processedButtons.add(btn);

    btn.scrollIntoView({behavior:"smooth",block:"center"});
    await delay(400);

    btn.click();

    const applyBtn = await waitForElement('button[data-test="JobDescriptionSlideIn--SubmitButton"]');

    if (!applyBtn) {
      skipped++;
      continue;
    }

    if (shouldSkipJob()) {

      const closeBtn = await waitForElement('button[data-test="closeButton"]');
      if (closeBtn) closeBtn.click();

      skipped++;
      await delay(800);
      continue;
    }

    if (applyBtn.disabled) {

      console.log("⏭️ Apply button disabled");

      const closeBtn = await waitForElement('button[data-test="closeButton"]');
      if (closeBtn) closeBtn.click();

      skipped++;
      await delay(800);
      continue;
    }

    handleCustomQuestions();

    fillApplicationFields();

    await delay(1500);

    applyBtn.click();

    applied++;

    console.log(`✅ Applied (${applied})`);

    await delay(2500);

    const closeBtn = await waitForElement('button[data-test="closeButton"]');
    if (closeBtn) closeBtn.click();

    await delay(800);

  }

  return true;

};

const MAX_SCROLLS = 25;

while (scrollCount < MAX_SCROLLS) {

  const found = await processBatch();

  if (!found) {

    window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});

    console.log("📜 Scrolling for more jobs...");

    scrollCount++;

    await delay(2000);

  } else {

    scrollCount = 0;

  }

}

console.log("🎉 Auto Apply Finished");
console.log(`Applied: ${applied}`);
console.log(`Skipped: ${skipped}`);

})();
