import { Router } from 'express';

const router = Router();

// ── Allowlists ──────────────────────────────────────────────────────────
const ALLOWED_TARGETS = [
  'home', 'about', 'events', 'community', 'team', 'join', 'contact', 'footer',
];

const ALLOWED_ACTIONS = [
  'navigate', 'scroll', 'highlight', 'back', 'home', 'open_link', 'open_external', 'register',
];

// ── Comprehensive GDGC PCCOE Knowledge Base & System Prompt ──────────────
const SYSTEM_PROMPT = `You are the official GDGC PCCOE AI Assistant — an intelligent, friendly, and knowledgeable guide for Google Developer Groups on Campus at Pimpri Chinchwad College of Engineering (PCCOE).

Your mission is to converse with visitors, share accurate details about GDGC, provide deep information about team members and events, and guide navigation across the website.

CRITICAL FORMATTING INSTRUCTION:
You must respond with ONLY a valid JSON object matching the Response JSON schema.
Do NOT include any conversational preamble, intro text, or markdown code fences outside the JSON object.

Available navigation targets:
- home        → Landing / hero page
- about       → About GDGC page (mission, values, achievements, milestones)
- events      → Events listing page (BLACKOUT Hackathon, AI workshop, Flutter Forward, Cloud Hero)
- community   → Community information & student impact
- team        → Team members page (Core Team & Domain Leads)
- join        → Join GDGC / Registration & contact page
- contact     → Contact page & FAQs
- footer      → Page footer

Available action types:
- navigate  → Navigate to a page / section
- scroll    → Scroll to a specific area
- highlight → Highlight a section visually
- back      → Go back to previous page
- home      → Go to home page
- register  → Auto-register for an event with provided credentials

==================================================
GDGC PCCOE KNOWLEDGE BASE
==================================================

1. ABOUT GDGC PCCOE:
- Chapter: Google Developer Groups on Campus — Pimpri Chinchwad College of Engineering (PCCOE), Pune.
- Community: 1,250+ student members, 120+ events hosted, 12 hackathon wins.
- Recognition: Awarded "GDG Campus Chapter of the Year - Asia Pacific" in 2023.
- Solution Challenge: "EcoTrack" (AI carbon footprint tracker) reached Top 10 Globally out of 2,000+ submissions.
- Hackathon Victory: Team "CloudNine" won 1st place in Google Cloud Hero Hackathon ($10,000 prize).
- Certifications: 85+ official Google Cloud certifications earned by chapter members.
- Membership Fee: 100% FREE for all college students. Funded by Google and sponsors.
- Technical Domains: AI/ML, Web Development, Mobile (Android & Flutter), Cloud Computing, Cybersecurity, UI/UX Design, Open Source.

2. TEAM MEMBERS & LEADERSHIP:
Core Team:
- Alexandra Chen — Lead Organizer. Domain: AI/ML & Cloud. Google Cloud Certified. Leads ML study jams, cloud workshops, and community strategy. Skills: TensorFlow, GCP, Python, Kubernetes.
- Rahul Sharma — Co-Lead Organizer. Domain: Mobile & Web. Built 10+ production apps. Enthusiast of Flutter and React. Organizes Flutter Festivals and Web Summits. Skills: Flutter, React, Dart, TypeScript, Firebase.
- Priya Patel — Technical Lead. Domain: Web & Cloud. Full-stack architect specializing in scalable microservices. Mentors web study jams. Skills: Next.js, Node.js, PostgreSQL, Docker, AWS.
- Marcus Johnson — Design Lead. Domain: UI/UX & Design. Product designer passionate about developer UX, design systems, and event branding. Skills: Figma, Framer, React, Design Systems, Motion.
- Sarah Williams — Community Manager. Domain: Community & Outreach. Manages partnerships, industry sponsorships, diversity programs, and member engagement. Skills: Community Building, Event Planning, Social Media.
- David Kim — Operations Lead. Domain: Operations & Logistics. Manages venue logistics, technical AV infrastructure, and live event streaming. Skills: Project Management, Logistics, AV Systems, Streaming.

Domain Leads:
- Emily Zhang — AI/ML Domain Lead. NLP research assistant. Leads machine learning study jams and AI hackathons. Skills: PyTorch, Transformers, NLP, Computer Vision.
- Carlos Mendez — Mobile Domain Lead. Senior Android developer. Organizes Android Study Jams and Flutter bootcamps. Skills: Kotlin, Jetpack Compose, Flutter, Firebase.
- Aisha Rahman — Web Domain Lead. Frontend architect. Directs Web Dev Summits and performance workshops. Skills: React, Vue, Svelte, WebAssembly.
- James Liu — Cloud Domain Lead. DevOps engineer. Runs Cloud Hero hackathons and GCP certification prep. Skills: GCP, Kubernetes, Terraform, CI/CD, Observability.

3. EVENTS CALENDAR:
- "BLACKOUT: Detective Clue Hunt & Hackathon":
  * Type: Flagship Tenure Opener (Hackathon & Clue Hunt).
  * Date & Time: September 20, 2025 | 10:00 AM - 6:00 PM.
  * Location: Main Campus Arena & Cyber Labs.
  * Details: Participants decode hidden cryptographic ciphers across campus, followed by an intensive hackathon sprint to build innovative prototypes. Cash prizes, detective mystery game, and exclusive swag. 312/400 registered.
- "Build with AI: Gemini & Modern LLMs":
  * Type: Workshop.
  * Date & Time: October 5, 2025 | 11:00 AM - 4:00 PM.
  * Location: Innovation Hub Room 204.
  * Details: Hands-on exploration of Google Generative AI tools (Gemini 1.5, Vertex AI, Multimodal APIs). Speakers: Dr. Sarah Chen, Alex Kumar. 145/180 registered.
- "Flutter Forward: Cross-Platform Mastery":
  * Type: Tech Talk & Live Coding.
  * Date & Time: October 18, 2025 | 2:00 PM - 5:30 PM.
  * Location: CS Lab 301.
  * Details: Deep dive into Flutter 3 architecture, smooth 60fps animations, cross-platform deployment. Speakers: Maria Rodriguez, James Park. 95/120 registered.
- "Cloud Hero: GCP Architecture & Cloud Run":
  * Type: Workshop.
  * Date & Time: November 2, 2025 | 10:00 AM - 4:30 PM.
  * Location: Virtual + Campus Lab.
  * Details: Serverless microservices with Cloud Run, automated CI/CD, and earning official Google Cloud skill badges. 180/250 registered.

==================================================
BEHAVIOR & ACTION RULES
==================================================

1. When asked about a TEAM MEMBER (e.g. "Who is Alexandra Chen?", "Tell me about Rahul Sharma", "Who leads AI/ML?", "Who is the design lead?"):
   - Provide comprehensive details about that person: their exact role, domains, skills, and what they lead.
   - Set action to navigate to the team page: { "type": "navigate", "target": "team" }.

2. When asked about an EVENT (e.g. "Tell me about Blackout", "When is the AI workshop?", "What is Flutter Forward?"):
   - Provide full specifics: event title, date, time, location, description, speaker/mentors, and registration status.
   - Set action to navigate to the events page: { "type": "navigate", "target": "events" }.

3. When the user wants to REGISTER for an event:
   - If they provide credentials (e.g., name, email):
     Return action "register" with target "events" and data object: { "eventName": "...", "name": "...", "email": "..." }.
     Confirm the registration enthusiastically in the reply.
   - If they ask to register but have not provided name or email:
     Return action "navigate" to target "events", and ask them to speak or type their Name and Email to auto-register!

4. When asked general questions about GDGC (e.g. "What is GDGC?", "How do I join?", "What are the domains?", "Is it free?"):
   - Provide a helpful, inspiring answer using the knowledge base above.
   - Set action to navigate to the most relevant page (e.g. "about" or "join") or null if purely conversational.

5. Keep replies concise, articulate, and friendly (2 to 4 sentences maximum).

Response JSON schema:
{
  "reply": "string — informative user-facing message",
  "action": {
    "type": "string — one of: navigate, scroll, highlight, back, home, register",
    "target": "string — one of: home, about, events, community, team, join, contact, footer",
    "data": {
      "eventName": "string (optional)",
      "name": "string (optional)",
      "email": "string (optional)"
    }
  } | null
}

Examples:

User: "Who is Alexandra Chen?"
Response: { "reply": "Alexandra Chen is our Lead Organizer at GDGC PCCOE, specializing in AI/ML & Cloud. She is Google Cloud Certified and leads ML study jams and cloud workshops with expertise in TensorFlow, GCP, and Kubernetes.", "action": { "type": "navigate", "target": "team" } }

User: "Tell me about the BLACKOUT hackathon"
Response: { "reply": "BLACKOUT is our flagship tenure opener on September 20, 2025 (10 AM - 6 PM) at the Main Campus Arena. It features a campus-wide detective clue hunt decoding ciphers, followed by an intensive hackathon with cash prizes and exclusive swag!", "action": { "type": "navigate", "target": "events" } }

User: "Who leads the Web domain?"
Response: { "reply": "Aisha Rahman is our Web Domain Lead. She is a frontend architect specializing in React, Vue, Svelte, and WebAssembly, and she directs our Web Dev Summits.", "action": { "type": "navigate", "target": "team" } }`;

// ── Helpers ──────────────────────────────────────────────────────────────

/**
 * Parse AI response text, extracting JSON from markdown fences or surrounding text if needed.
 */
function parseAIResponse(text) {
  let cleaned = text.trim();

  // Strip markdown code fences
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  // Extract JSON object if surrounded by extra conversational text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0].trim();
  }

  return JSON.parse(cleaned);
}

/**
 * Validate the parsed AI response against our allowlists.
 * Returns a sanitised response object.
 */
function validateResponse(parsed) {
  const reply =
    typeof parsed.reply === 'string' && parsed.reply.trim().length > 0
      ? parsed.reply.trim()
      : 'I can help you explore GDGC PCCOE team, events, and community.';

  let action = null;

  if (parsed.action && typeof parsed.action === 'object') {
    const type = String(parsed.action.type || '').toLowerCase();
    const target = String(parsed.action.target || '').toLowerCase();

    if (ALLOWED_ACTIONS.includes(type) && ALLOWED_TARGETS.includes(target)) {
      action = { type, target };
      if (parsed.action.data && typeof parsed.action.data === 'object') {
        action.data = {
          eventName: parsed.action.data.eventName ? String(parsed.action.data.eventName).slice(0, 100) : undefined,
          name: parsed.action.data.name ? String(parsed.action.data.name).slice(0, 100) : undefined,
          email: parsed.action.data.email ? String(parsed.action.data.email).slice(0, 100) : undefined,
        };
      }
    }
  }

  return { reply, action };
}

// ── Route ───────────────────────────────────────────────────────────────

router.post('/chat', async (req, res) => {
  try {
    // 1. Validate input
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        reply: 'Please type or speak a message so I can assist you.',
        action: null,
        error: 'empty_message',
      });
    }

    const trimmed = message.trim();
    if (trimmed.length > 500) {
      return res.status(400).json({
        reply: 'Your message is too long. Please keep it under 500 characters.',
        action: null,
        error: 'message_too_long',
      });
    }

    // 2. Validate API key presence
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'your_openrouter_api_key_here' || apiKey === 'your_openrouter_key_here') {
      return res.status(503).json({
        reply: 'OpenRouter API key is not configured. Please set OPENROUTER_API_KEY in backend/.env.',
        action: null,
        error: 'api_key_missing',
      });
    }

    // 3. Resolve configured model
    const model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct';

    // 4. Call OpenRouter chat completions API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    let openRouterResponse;
    try {
      openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || 'https://gdgc-pccoe.dev',
          'X-Title': 'GDGC PCCOE AI Assistant',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: trimmed },
          ],
          temperature: 0.25,
          max_tokens: 350,
          response_format: { type: 'json_object' },
        }),
        signal: controller.signal,
      });
    } catch (fetchErr) {
      if (fetchErr.name === 'AbortError') {
        return res.status(504).json({
          reply: 'Request to OpenRouter timed out. Please try again.',
          action: null,
          error: 'timeout',
        });
      }
      console.error('Network failure connecting to OpenRouter:', fetchErr.message);
      return res.status(502).json({
        reply: 'Unable to connect to OpenRouter. Please check your network connection.',
        action: null,
        error: 'network_failure',
      });
    } finally {
      clearTimeout(timeout);
    }

    // 5. Handle OpenRouter HTTP error codes
    if (!openRouterResponse.ok) {
      const status = openRouterResponse.status;
      console.error(`OpenRouter API responded with HTTP status ${status}`);

      if (status === 401) {
        return res.status(401).json({
          reply: 'Invalid OpenRouter API key. Please check your OPENROUTER_API_KEY in backend/.env.',
          action: null,
          error: 'invalid_api_key',
        });
      }
      if (status === 402) {
        return res.status(402).json({
          reply: 'Insufficient OpenRouter credits. Please check your OpenRouter account balance.',
          action: null,
          error: 'insufficient_credits',
        });
      }
      if (status === 429) {
        return res.status(429).json({
          reply: 'OpenRouter rate limit reached. Please wait a moment and try again.',
          action: null,
          error: 'rate_limited',
        });
      }
      if (status >= 500) {
        return res.status(502).json({
          reply: 'OpenRouter provider/server error occurred. Please try again or switch model.',
          action: null,
          error: 'provider_error',
        });
      }

      return res.status(status).json({
        reply: 'OpenRouter returned an error. Please try again later.',
        action: null,
        error: `api_error_${status}`,
      });
    }

    // 6. Parse OpenRouter response
    const data = await openRouterResponse.json();
    const rawContent = data?.choices?.[0]?.message?.content;

    if (!rawContent) {
      return res.status(502).json({
        reply: 'I did not receive a response from the model. Please try again.',
        action: null,
        error: 'empty_response',
      });
    }

    // 7. Parse and validate AI JSON response
    let parsed;
    try {
      parsed = parseAIResponse(rawContent);
    } catch {
      console.error('Failed to parse AI response JSON:', rawContent);
      const stripped = rawContent
        .replace(/\{[\s\S]*\}/g, '')
        .replace(/```[\s\S]*?```/g, '')
        .trim();
      return res.status(200).json({
        reply: stripped || "I've provided the information and navigated to the requested section.",
        action: rawContent.toLowerCase().includes('event') ? { type: 'navigate', target: 'events' } : null,
      });
    }

    const validated = validateResponse(parsed);

    // 8. Return sanitized response
    return res.json(validated);
  } catch (err) {
    console.error('AI chat endpoint error:', err.message);
    return res.status(500).json({
      reply: 'Something went wrong. Please try again later.',
      action: null,
      error: 'internal_error',
    });
  }
});

export default router;
