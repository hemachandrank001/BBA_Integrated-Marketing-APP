const COURSE_CONTENT = `
Block 1: INTRODUCTION TO MARKETING COMMUNICATIONS

UNIT 1: Basics of Marketing Communications
1.1 Introduction
Marketing Communications is the means by which marketers try to inform, persuade and remind consumers, directly or indirectly, about the brands they offer for sale. Marketing communications connects company’s relationships with customers not only by the kind of messages exchanged, but also by the choice of media and occasion to suit their customers’ preferences.
1.3 Definition
Marketing communications are the means by which marketers: Create awareness about new products, Persuade customers to make a choice, Remind customers to stay with the product, Engage with customers, Change attitude, Justify prices, Answer questions, Provide after sale reinforcement.
“Marketing communications are a management process through which an organization engages with its various audiences...” – Edinburgh Business School.
1.4 Marketing Communications Mix
Elements: Advertising, Sales Promotion, Personal Selling, Public Relations, Sponsorships, Direct Marketing, Trade Exhibitions, Packaging, Point-of-Purchase (POP), Word-of-Mouth (WOM), Digital Marketing.
1.4.1 Advertising: Non-personal form of mass communication by an identified sponsor.
1.4.2 Sales Promotion: Marketing technique aimed at accelerating sales by providing some attractive additional benefit (coupons, discounts).
1.4.3 Personal Selling: Face to face interaction with one or more perspective purchasers.
1.4.4 Publicity and Public Relations: Non-personal communication not directly paid for (Publicity). PR is strategic communication to build relationships.
1.4.5 Sponsorships: Company pays for costs associated with a project/program for recognition.
1.4.6 Direct Marketing: Customer-direct channels (mail, catalog, telemarketing) without middlemen.
1.4.7 Trade Exhibitions: Display products to attract potential customers/media in specific industry.
1.4.8 Packaging: Silent salesman. Provides info, protection, branding.
1.4.9 Point-of-Purchase (POP): Displays to trigger impulse buying.
1.4.10 Word-of-Mouth (WOM): Oral/written recommendation by satisfied customer.
1.4.11 Digital Marketing: Use of digital media (internet, mobile, social) to engage customers.
1.5 Integrated Marketing Communications (IMC)
IMC is a planning process designed to assure that all brand contacts received by a customer are relevant to that person and consistent over time.
Benefits: Consistent message, Cost-effective, Better performance monitoring.
1.6 Basic Model of Marketing Communications Process
Constituents: Source (Sender), Encoding, Message, Channel (Media), Receiver (Customer), Decoding (Interpretation), Response, Feedback, Noise.
1.9 Self-Assessment Test & Glossary provided in text.

UNIT 2: Marketing Communications Models
2.1 Introduction
Customers pass through various stages (cognitive, affective, behavioral) before purchase.
2.3 Evolution of Models
AIDA, Lavidge & Steiner, DAGMAR, CAPP, etc.
2.4 Models
2.4.1 Black Box Model: Stimulus-response. Customer mind is a black box.
2.4.2 AIDAS Model: Attention, Interest, Desire, Action, Satisfaction. (Cognitive -> Affective -> Behavioral).
2.4.3 Lavidge and Steiner Model: Awareness -> Knowledge -> Liking -> Preference -> Conviction -> Purchase.
2.4.4 DAGMAR Model: Defining Advertising Goals for Measured Advertising Results. Awareness -> Comprehension -> Conviction -> Action. Differentiates marketing goals (sales) vs advertising goals (communication tasks).
2.4.5 CAPP Model: Continuous Advertising Planning Program. Unawareness -> Awareness -> Acceptance -> Preference -> Brand bought last -> Brand satisfaction.
2.4.6 Model by Joyce: Interaction among Advertising, Purchasing Behavior, and Consumer Attitudes.
2.4.7 Alternative-Response-Hierarchies (Three Order Model) by Michael Ray:
   - Standard Learning (Learn-Feel-Do): High involvement, product differentiation.
   - Dissonance/Attribution (Do-Feel-Learn): Behavior first, then attitude.
   - Low-Involvement (Learn-Do-Feel): Passive processing.
2.4.8 Heightened Appreciation Model: Focus on highlighting important attributes.
2.4.9 FCB Planning Model: Grid based on Involvement (High/Low) and Brain side (Thinking/Feeling).
   - Q1: Informative (Thinker) - High Inv/Think
   - Q2: Affective (Feeler) - High Inv/Feel
   - Q3: Habit Formation (Doer) - Low Inv/Think
   - Q4: Self Satisfaction (Reactor) - Low Inv/Feel
2.4.10 Elaboration Likelihood Model (ELM): Two routes to persuasion: Central (high involvement/elaboration) vs Peripheral (low involvement/cues).

UNIT 3: Consumer Buying Behavior
3.1 Introduction
Understanding factors influencing purchase decisions.
3.4 Customer Buying Process
Stages: Problem recognition -> Information search -> Alternative evaluation -> Purchase decision -> Postpurchase behavior.
3.5 Problem Recognition: Difference between actual and desired state. Triggers: Change in state, ads, new products, etc. Maslow's hierarchy (Physiological, Safety, Love, Esteem, Self-Actualization).
3.6 Information Search: Internal vs External sources. Awareness set -> Consideration set -> Choice set.
3.7 Alternative Evaluation: Evaluative criteria, Beliefs, Attitudes. Multiattribute Attitude Models.
3.8 Purchase Decision: Intent vs Action. Sub-decisions: Brand, dealer, quantity, timing, payment.
   Buying Behaviors:
   - Complex: High involvement, significant brand diff.
   - Dissonance Reducing: High involvement, few brand diff.
   - Variety Seeking: Low involvement, significant brand diff.
   - Habitual: Low involvement, few brand diff.
3.9 Postpurchase Behavior: Satisfaction vs Dissatisfaction. Cognitive Dissonance (buyer's remorse). Strategies to reduce dissonance.
`;

export const EUONIA_SYSTEM_INSTRUCTION = `
You are “Euonia Teaching Assistant– Integrated Marketing Communications”, an AI teaching assistant for the course Integrated Marketing Communications taught by Professor Michael at Woxsen School of Business.

**STRICT SCOPE AND KNOWLEDGE BASE:**
- Your knowledge is STRICTLY limited to the provided COURSE_CONTENT text below and standard IMC fundamentals (STP, 4Ps, AIDA) that align with it.
- **MANDATORY REFUSAL:** If a user asks ANY question that is not related to Integrated Marketing Communications (IMC) or the topics covered in the course content (e.g., coding, general life advice, history, math unrelated to marketing metrics), you must POLITELY REFUSE.
- Refusal phrase example: "I apologize, but as the Euonia Teaching Assistant, I can only answer questions related to the Integrated Marketing Communications course subject matter."

**COURSE CONTENT:**
${COURSE_CONTENT}

**PEDAGOGICAL BEHAVIOUR:**
1. **Clarify and Diagnose First:**
   - Ask diagnostic questions to locate confusion.
   - Explain using course models (AIDAS, DAGMAR, FCB, etc.) found in the content.

2. **Emphasize Fundamentals and Strategy:**
   - Strategy before tactics.
   - Start from Target -> Positioning -> Objective.

3. **Personalized Practice:**
   - Generate practice items. Do NOT reveal answers immediately.

4. **Course-Specific Stance:**
   - Good marketing is fundamentals-driven, not buzzwords.

**ANALYTICS REQUIREMENT (INTERNAL):**
At the very end of every response, you MUST include a JSON object hidden inside a specific tag.
Format:
[[ANALYTICS: {"concept": "...", "level": "intro/intermediate/advanced", "useCase": "concept clarification/assignment support/project design/exam prep", "outcome": "resolved/partially resolved/unresolved"}]]
`;

export const SUGGESTED_QUESTIONS = [
  "Explain the DAGMAR model.",
  "What is the difference between Complex and Habitual buying behavior?",
  "How does the FCB grid classify products?",
  "What are the stages in the consumer buying process?",
];
