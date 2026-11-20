# 13. Improved questionnaire and scorecards

The redesign replaces self-ratings and leading yes/no questions with scenario judgment, which predicts listening quality better and is harder to game. It cuts 20 questions to 14 scored questions of about 20 minutes, and moves compliance items out of the questionnaire into consents and the agreement.

### 13.1 What changed and why

| Original | Problem | Change |
| --- | --- | --- |
| Applicant details (Section A) | Already collected in registration and profile | Removed |
| Q6 and Q9, self-rated 1 to 5 | Self-ratings are inflated and uninformative | Removed from scoring |
| Q15, Q19, Q20, "Do you agree..." | Everyone answers yes; no signal | Moved to consents and the listener agreement |
| Q13 and Q14, convictions and removal | Sensitive data asked too early, restricted by law in some countries | Moved to a separate declaration step after ID approval, with counsel-approved wording per country |
| Open questions only | Slow to review, language-dependent | Mix of scored scenario choices (instant triage) and short written answers (human review) |
| No boundary scenarios involving risk | The most important skill was tested only for money and medical advice | Added self-harm, contact-outside-platform, romantic interest and gift scenarios |
| Scorecard categories without anchors | Two reviewers score the same answer differently | Anchored 0 to 3 scale with examples |

### 13.2 Questionnaire v2

| # | Section | Question | Type | Scored by |
| --- | --- | --- | --- | --- |
| 1 | Motivation | What made you want to become a listener, and what do you hope to get from it? (Income is a fine answer; we want honesty.) | Text, 60 to 150 words | Reviewer |
| 2 | Motivation | Rank what matters most to you in this role: helping people, income, flexibility, personal growth, learning skills. | Ranking | Not scored |
| 3 | Listening judgment | A person says: "My mother died last month and everyone keeps telling me to be strong." Pick the best and the worst response from this list. | Best and worst of 5 | Automatic |
| 4 | Listening judgment | A person goes quiet in the middle of a story. Pick the best and the worst thing to do. | Best and worst of 5 | Automatic |
| 5 | Listening judgment | Someone says: "I do not want advice, I just want someone to listen." Write what you would say next, in your own words. | Text, 30 to 100 words | Reviewer |
| 6 | Emotional response | A person begins to cry during a conversation. Describe what you would do and say, and what you would avoid. | Text, 60 to 150 words | Reviewer |
| 7 | Emotional response | Someone describes a view you strongly disagree with. What do you do with your own reaction while you listen? | Text, 60 to 150 words | Reviewer |
| 8 | Emotional response | Someone says: "I lost my job and I am scared about the future." Write your first three sentences. | Text, 40 to 120 words | Reviewer |
| 9 | Boundaries and safety | A person asks whether they should stop taking their prescribed medication. Pick the best and the worst response. | Best and worst of 5 | Automatic |
| 10 | Boundaries and safety | A person says they have been thinking that everyone would be better off without them. What would you do, in order? | Text, 60 to 150 words | Reviewer, safety-critical |
| 11 | Boundaries and safety | A person you have spoken to several times offers you a gift, asks for your personal number, or says they are developing feelings. Pick the best and the worst response. | Best and worst of 5 | Automatic |
| 12 | Boundaries and safety | A person asks which investment to buy. Pick the best and the worst response. | Best and worst of 5 | Automatic |
| 13 | Self-care and reliability | After a heavy conversation, how do you look after yourself, and who or what supports you? | Text, 40 to 120 words | Reviewer |
| 14 | Practical | Weekly hours you can offer, time zone, quiet private space, device and connection, languages you can listen in. | Structured fields | Rule check |

### 13.3 Application scoring (100 points)

| Category | Questions | Points | How scored |
| --- | --- | --- | --- |
| Motivation and honesty | 1 | 10 | Reviewer, anchored 0 to 3 |
| Listening judgment | 3, 4, 5 | 20 | Questions 3 and 4 automatic (best and worst keyed), question 5 reviewer |
| Emotional response | 6, 7, 8 | 20 | Reviewer, anchored 0 to 3 |
| Boundaries and safety | 9, 10, 11, 12 | 30 | Automatic and reviewer |
| Self-care and reliability | 13, 14 | 10 | Reviewer and rule check |
| Written clarity and warmth | All written answers | 10 | Reviewer, overall |

Example anchors for reviewer questions: **0** judges, lectures, fixes, or uses clichés; **1** polite but generic; **2** reflects feelings and asks an open question; **3** reflects feelings, stays with the person, offers no unrequested advice, and checks understanding.

**Decision rules.** 70 or above advances to ID request. 55 to 69 goes to a second reviewer. Below 55 is declined with a templated, respectful message after a human confirms. Question 10 is safety-critical: a score of 0 or 1 puts the application on hold for the interviewer to probe, whatever the total, and no other score can compensate for it.

### 13.4 Interview scorecard v2

The interview is 30 minutes: 3 minutes welcome, 5 background, 12 role-play (the interviewer plays a person in two scenarios), 5 on a boundary or crisis scenario, 3 for the applicant's questions, 2 to close. Each category is scored 1 to 5 against behavioural anchors, not impressions.

| Category | Score 1 looks like | Score 3 looks like | Score 5 looks like |
| --- | --- | --- | --- |
| Empathic presence | Misses or dismisses feelings | Names feelings when prompted | Reflects unspoken feeling accurately and unhurried |
| Active listening | Interrupts, changes topic | Paraphrases sometimes | Paraphrases, uses silence, checks understanding |
| Non-judgment | Moralises or reacts visibly | Mostly neutral, slips once | Stays curious about views they disagree with |
| Boundaries | Gives advice, shares contact, takes on the problem | Names limits when asked | States limits kindly and redirects to proper help |
| Emotional regulation | Flustered, defensive | Recovers quickly | Calm, grounded, sets pace |
| Safety judgment | Ignores or panics at risk signals | Recognises risk, uncertain of steps | Asks directly, stays present, follows the protocol |
| Communication and language | Hard to follow | Clear with effort | Clear, warm, appropriate to the person |
| Reliability and professionalism | Late, unprepared, unsuitable setting | Prepared, minor issues | Prepared, consistent with their application |
| Integrity and identity | Answers conflict with application or ID | Minor gaps explained | Fully consistent |

**Outcome:** Strong yes, Yes, Hold, or No, with written notes. **Pass rule:** average 3.5 or more, with no score below 3 on Boundaries, Non-judgment and Safety judgment. **Red flags** (any one needs a second interviewer): gives unsolicited advice repeatedly, pushes personal beliefs, seeks personal contact, evasive about identity, appears to read or be coached by another person or a tool, unsuitable environment.

**Quality control.** Double-score 10% of interviews, hold a monthly calibration meeting, and review results by language and country for unintended bias. Pilot the questionnaire with about 30 applicants and have a licensed professional review the content before launch. This is a suitability screen for a listening role, not a clinical or personality assessment.
