# 🎬 Movie Reco### Sprint 1 – Setup & Infrastructure (1 week)
- [x] **Req 1.1:** Initialize Vite + React project structure  
- [x] **Req 1.2:** Install dependencies (React Router, Axios for API calls, Tailwind/styling library)  
- [x] **Req 1.3:** Configure environment variables (TMDB API key & sheet.best endpoint)  
- [x] **Req 1.4:** Set up GitHub repo + deployment pipeline (Vercel/Netlify)  
- **Deliverable:** Running "Hello World" React app deployed onliner A/B Test – Requirements & Sprint Plan

## 📋 High-Level Goal
Build a static **Vite + React** web app that:  
1. Collects student **name + ID**  
2. Runs a **movie recommendation experiment (A/B test)**  
   - **Group A:** static recommender (movies don’t change)  
   - **Group B:** “adaptive” recommender (after a selection, new movies from the same genre appear)  
3. Records **interaction data + survey answers** in a **Google Sheet (via sheet.best)**  
4. Shows a **debrief/explanation screen** at the end  

---

## 🚀 Sprint Breakdown

### Sprint 1 – Setup & Infrastructure (1 week)
- [ ] **Req 1.1:** Initialize Vite + React project structure  
- [ ] **Req 1.2:** Install dependencies (React Router, Axios for API calls, Tailwind/styling library)  
- [ ] **Req 1.3:** Configure environment variables (TMDB API key & sheet.best endpoint)  
- [ ] **Req 1.4:** Set up GitHub repo + deployment pipeline (Vercel/Netlify)  
- **Deliverable:** Running “Hello World” React app deployed online  

---

### Sprint 2 – User Input & Experiment Setup (1 week)
- [ ] **Req 2.1:** Landing form collects student **name + ID**  
- [ ] **Req 2.2:** Randomly assign users to **Group A or B** (store in state + Google Sheet)  
- [ ] **Req 2.3:** Log initial metadata (timestamp, group, name, ID) in Google Sheet  
- **Deliverable:** Student info recorded in Google Sheet upon submission  

---

### Sprint 3 – Movie Fetching & Display (2 weeks)
- [ ] **Req 3.1:** Integrate with **TMDB API** to fetch movies (e.g., trending or random)  
- [ ] **Req 3.2:** Display movies in a **grid of posters** with title & genre  
- [ ] **Req 3.3:** Allow users to select movies (click poster = “selected”)  
- [ ] **Req 3.4:** Log selection event in Google Sheet (movie ID, genre, timestamp)  

- **Adaptive Condition (Group B):**  
  - [ ] **Req 3.5:** When a movie is selected, fetch more movies of the **same genre** to update the grid  

- **Static Condition (Group A):**  
  - [ ] **Req 3.6:** Movie grid remains unchanged after selections  

- **Deliverable:** Users can pick 5 movies, with adaptive vs static flow depending on group  

---

### Sprint 4 – Survey Implementation (1 week)
- [ ] **Req 4.1:** After 5 selections, show survey form with Likert scale questions:  
  - Helpfulness (1–10)  
  - Satisfaction  
  - Ease of use  
  - Personalization  
  - Trust  
  - Would use again (Yes/No + scale)  
- [ ] **Req 4.2:** Add open-text box for feedback  
- [ ] **Req 4.3:** Record survey answers in Google Sheet (linked to student ID + group)  
- **Deliverable:** Survey responses logged correctly  

---

### Sprint 5 – Debrief & Closing (1 week)
- [ ] **Req 5.1:** Show thank-you / debrief page explaining:  
  - The system tested “adaptive” vs “static” movie recommenders  
  - Goal = measure perceived helpfulness & user experience  
  - Clarify it was a **study**, not a real recommender  
- [ ] **Req 5.2:** Provide contact info / consent reminder (if required for IRB)  
- **Deliverable:** Study debrief shown consistently after survey submission  

---

### Sprint 6 – Data & Testing (1–2 weeks)
- [ ] **Req 6.1:** Test end-to-end flow with test participants  
- [ ] **Req 6.2:** Verify events (user info, selections, survey) log correctly in Google Sheet  
- [ ] **Req 6.3:** Check randomization fairness between Group A & B  
- [ ] **Req 6.4:** Run pilot (5–10 users) for usability & reliability  
- **Deliverable:** Clean dataset in Google Sheet ready for analysis  

---

## 📊 Data Schema in Google Sheet
| Column                | Description |
|------------------------|-------------|
| `participant_id`       | Student ID |
| `name`                 | Student name |
| `group`                | Group A (static) or Group B (adaptive) |
| `timestamp`            | Event timestamp |
| `event_type`           | init / movie_selection / survey_response / end |
| `movie_id`             | TMDB movie ID (if selection) |
| `genre`                | Genre of selected movie |
| `survey_helpfulness`   | Rating 1–10 |
| `survey_satisfaction`  | Rating scale |
| `survey_ease`          | Rating scale |
| `survey_personalization` | Rating scale |
| `survey_trust`         | Rating scale |
| `survey_reuse`         | Likelihood to use again |
| `survey_open_feedback` | Open text feedback |

---
