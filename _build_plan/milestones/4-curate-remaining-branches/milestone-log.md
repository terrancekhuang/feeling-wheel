# Milestone 4 — Curate Remaining Branches: log

Branches done: **Fear** (milestone 2), **Sadness** (session 1 below).
Still to do: Anger, Shame, Loneliness, Weariness, Doubt.

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
