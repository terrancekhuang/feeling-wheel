# Milestone 4 — Curate Remaining Branches: log

Branches done: **Fear** (milestone 2), **Sadness** (session 1), **Anger** (session 2), **Shame, Loneliness, Weariness, Doubt** (session 3).
Still to do: none. Every branch is drafted; review is what remains.

---

## Session 1 — Sadness

### What's new in the app

- **All 21 Sadness emotions now have full pages in draft preview**, including God sees this, Truth to hold, and a reflection, prayer and action for each.
- **84 new verse cards in total**, every one checked word for word against the BSB.
- **The four crisis-flagged Sadness pages** (Empty, Hopeless, Despairing, Not wanting to live) now carry content written to point toward a real person and 988, alongside the banner.
- Nothing is live yet. These pages appear on the public site only after you mark them `reviewed: true`.

### Review list (run `pnpm dev`, open each link, then set `reviewed: true`)

- [ ] /sadness
- [ ] /grieving · [ ] /heartbroken · [ ] /bereaved · [ ] /missing-someone
- [ ] /disappointed · [ ] /let-down · [ ] /discouraged · [ ] /unfulfilled
- [ ] /hurt · [ ] /wounded · [ ] /betrayed · [ ] /crushed
- [ ] /downcast · [ ] /heavy-hearted · [ ] /gloomy · [ ] /empty ⚠
- [ ] /hopeless ⚠ · [ ] /despairing ⚠ · [ ] /defeated · [ ] /not-wanting-to-live ⚠

⚠ = crisis-flagged. Read these with the most care.

Worth a closer look while reviewing:
- **/not-wanting-to-live** quotes Elijah asking to die (1 Kings 19:4), then God's response of sleep, food and care (19:5–7). The action sends the reader straight to 988 or a trusted person.
- **/defeated** uses Joshua 7:7 as the lament. In context, the defeat at Ai came from Achan's sin. Swap it if that reading feels off.
- **/bereaved** uses John 11:25 and 1 Thessalonians 4:13–14 (resurrection hope). That's right for believers, but it may read as presumptuous to someone grieving a person whose faith they're unsure of.

### What was built

- `content/emotions.yaml`: full content for the 21 Sadness entries. No names, slugs, descriptions or flags changed. No app code changed.

### Decisions not pre-specified in the PRD

- **Crisis flags rechecked and kept as they were:** Empty, Hopeless, Despairing and Not wanting to live are flagged. Defeated and Crushed are not, since they describe struggle rather than risk. Empty stays flagged because hollowness is a common depression signal. Unflag it if you disagree.
- **Crisis-page actions name 988 or a trusted person explicitly,** on top of the banner. Low-mood pages (Downcast, Empty) suggest a doctor or counsellor if the feeling persists.
- A verse may appear on more than one page (e.g. "Why are you downcast, O my soul?" on both /anxious and /downcast), but never twice on one page.

### For the next session

- Same recipe: print candidate verses straight from `content/bsb.txt` (`grep "^Psalm 42:5<TAB>"`), write the entries, then run `pnpm check`. Use excerpts for psalm titles (verse 1) and partial verses.
- Next suggested branch: **Anger** (wheel order). Shame (one crisis flag) and Weariness (one) are also left.

### Deviations from the PRD

- None.

---

## Session 2 — Anger

### What's new in the app

- **All 22 Anger emotions now have full pages in draft preview**, each with God sees this, Truth to hold, and a reflection, prayer and action.
- **Every verse is checked word for word against the BSB** (`pnpm check`: no problems).
- **Pages for the most volatile feelings tell you to step away and get help.** On Enraged, Furious and Vengeful, the action says to step away and to call someone if you might hurt someone.
- Nothing is live yet. These pages appear on the public site only after you mark them `reviewed: true`.

### Review list (run `pnpm dev`, open each link, then set `reviewed: true`)

- [ ] /anger
- [ ] /frustrated · [ ] /irritated · [ ] /impatient · [ ] /stuck
- [ ] /bitter · [ ] /resentful · [ ] /unforgiving · [ ] /hardened
- [ ] /enraged · [ ] /furious · [ ] /vengeful
- [ ] /wronged · [ ] /cheated · [ ] /disrespected · [ ] /indignant
- [ ] /envious · [ ] /jealous · [ ] /discontent
- [ ] /angry-with-god · [ ] /disappointed-in-god · [ ] /god-is-unfair

Worth a closer look while reviewing:
- **/vengeful** uses an imprecatory psalm (Psalm 58:6, "shatter their teeth") as the lament. It shows that the wish for revenge can be prayed rather than acted on. Swap it if it reads as endorsing revenge.
- **/enraged** and **/furious** use God's questions to Cain and Jonah ("Why are you angry?") as "God sees this". They are gentle in tone, but both men were in the wrong. Check that they don't read as a rebuke.
- **/jealous** quotes Song of Solomon 8:6 on love's jealousy. The BSB names the book "Song of Solomon", not "Song of Songs".
- **/unforgiving** and **/disrespected** say outright that forgiving doesn't mean staying near someone unsafe, and point to a trusted person if there is mistreatment or abuse.

### What was built

- `content/emotions.yaml`: full content for the 22 Anger entries. No names, slugs, descriptions or flags changed. No app code changed.

### Decisions not pre-specified in the PRD

- **No crisis flags added to Anger.** The banner is for self-harm (988). Harm-to-others risk (Enraged, Furious, Vengeful) is handled in the action text instead. Flag them if you want the banner there too.
- The angry-with-God pages lean on lament (Job, Jeremiah, Martha) to show that bringing anger to God is allowed. They don't correct the reader.

### For the next session

- Same recipe as before: print verses from `content/bsb.txt`, write the entries, run `pnpm check`. Watch for "Selah" and psalm titles (Psalm 4:4, 62:8, 13:1 needed excerpts here).
- Next suggested branch: **Shame** (one crisis flag: Worthless).

### Deviations from the PRD

- None.

---

## Session 3 — Shame, Loneliness, Weariness, Doubt

### What's new in the app

- **Every emotion on the wheel now has a full page in draft preview.** This session adds 81 pages: Shame (21), Loneliness (20), Weariness (21) and Doubt (19).
- **Every verse is checked word for word against the BSB** (`pnpm check`: no problems, 145 of 145 fully drafted).
- **The two crisis-flagged pages** (Worthless, Ready to give up) have actions that name 988 or a trusted person, alongside the banner.
- Nothing is live yet. These pages appear on the public site only after you mark them `reviewed: true`.

### Review list (run `pnpm dev`, open each link, then set `reviewed: true`)

Shame
- [ ] /shame
- [ ] /guilty · [ ] /remorseful · [ ] /condemned · [ ] /regretful
- [ ] /worthless ⚠ · [ ] /unlovable · [ ] /like-a-failure · [ ] /insignificant
- [ ] /inadequate · [ ] /not-good-enough · [ ] /inferior · [ ] /falling-short
- [ ] /embarrassed · [ ] /humiliated · [ ] /exposed · [ ] /foolish
- [ ] /unclean · [ ] /defiled · [ ] /disgusted-with-myself · [ ] /unforgivable

Loneliness
- [ ] /loneliness
- [ ] /isolated · [ ] /alone · [ ] /cut-off · [ ] /homesick
- [ ] /rejected · [ ] /excluded · [ ] /unwanted · [ ] /ignored
- [ ] /abandoned · [ ] /deserted · [ ] /forgotten · [ ] /left-behind
- [ ] /misunderstood · [ ] /unseen · [ ] /unheard · [ ] /judged
- [ ] /disconnected · [ ] /distant · [ ] /out-of-place

Weariness
- [ ] /weariness
- [ ] /exhausted · [ ] /drained · [ ] /burned-out · [ ] /sleepless
- [ ] /burdened · [ ] /weighed-down · [ ] /stretched-thin · [ ] /carrying-others-pain
- [ ] /worn-down · [ ] /tired-of-waiting · [ ] /worn-out-by-pain · [ ] /ready-to-give-up ⚠
- [ ] /numb · [ ] /detached · [ ] /apathetic · [ ] /flat
- [ ] /spiritually-dry · [ ] /going-through-the-motions · [ ] /struggling-to-pray · [ ] /thirsty-for-god

Doubt
- [ ] /doubt
- [ ] /confused · [ ] /lost · [ ] /torn · [ ] /unsure-of-gods-will
- [ ] /far-from-god · [ ] /forsaken · [ ] /god-feels-silent · [ ] /cold-in-faith
- [ ] /questioning · [ ] /struggling-to-believe · [ ] /shaken · [ ] /why-god
- [ ] /disillusioned · [ ] /hurt-by-church · [ ] /cynical
- [ ] /spiritually-unsure · [ ] /unsure-im-saved · [ ] /gone-too-far

⚠ = crisis-flagged. Read these with the most care.

Worth a closer look while reviewing:
- **/defiled** quotes Tamar ("Where could I ever take my shame?", 2 Samuel 13:13), spoken as she pleads against being raped. It fits readers who feel stained by abuse, but it is heavy. The action says plainly that harm done to you is not your shame.
- **/unclean**, **/defiled** and **/hurt-by-church** separate sin you did from harm done to you, and point to a trusted person or counsellor.
- **/worthless** and **/like-a-failure** both use Elijah's "I am no better than my fathers" (1 Kings 19:4, excerpt). **/ready-to-give-up** uses "I have had enough, LORD" from the same verse, then God's answer of sleep and food (19:5–7).
- **/numb**, **/detached**, **/apathetic**, **/sleepless**, **/burned-out** and **/worn-out-by-pain** suggest a doctor or counsellor if the feeling persists, since these overlap with depression and burnout.
- **/forsaken** uses Jesus' cry from the cross (Matthew 27:46) as the lament.
- **/unsure-im-saved** leans on Romans 10:9 and Ephesians 2:8–9. Check that it fits your church's teaching on assurance.

### What was built

- `content/emotions.yaml`: full content for 81 entries across Shame, Loneliness, Weariness and Doubt. No names, slugs, descriptions, flags or `reviewed` values changed (diffed against the previous commit). No app code changed.

### Decisions not pre-specified in the PRD

- **Crisis flags kept as they were:** only Worthless and Ready to give up. Unlovable, Unforgivable, Forsaken and Numb are not flagged. Their content points toward people and, where relevant, a doctor. Flag any of them if you want the banner.
- All four branches were done in one session at your request, rather than one per session.

### For the next session

- Milestone 4's content is complete. What remains is your review: work through the lists above and in sessions 1–2, then set `reviewed: true`.

### Deviations from the PRD

- None.
