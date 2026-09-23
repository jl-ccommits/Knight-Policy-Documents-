# Brokerage Service Team SOP

Sep 23, 2026 · Jacob Landman

Living version: https://claude.ai/code/artifact/2b4503e2-5960-4d8b-aee3-f14fa1b06da5

## Purpose and definition of done

Matthew Castro runs the brokerage desk end to end, with Kheluram Kumar as the second seat. Every submission, quote, bind and service request goes through **brokerage@carma365.com** and C360. Summer Jenkins-Wilson brings in the business, hands it to the service team, and reviews only the exceptions listed in this SOP.

This SOP is done when:

- Matthew and Kheluram run every brokerage file from the brokerage inbox without Summer doing the work.
- Summer's only touch points are the approvals and escalations in the Oversight section.
- No bind request, quote or service item goes past its deadline in the Timelines section.

Why now: on 9/23 Summer flagged bind orders open since 9/18, flood quotes due to Jodi that day, and C360 erroring on brokerage functions. Service work was slipping while the team tested new tools.

## Roles and ownership

Matthew owns the outcome of every brokerage file. Today each carrier quote waits for Summer to review it, pick one, and email the team which quote to send (Matt, 9/23). This SOP moves quote selection and release to Matthew, so Summer only sees exceptions.

| Person | Role | Owns | Does not do |
| --- | --- | --- | --- |
| Matthew Castro | Brokerage service lead | The brokerage inbox, C360 brokerage records and the NB Log. Market selection, quote selection, final QC on every proposal, binds, issuance, service requests. Trains and checks Kheluram. Accountable for every deadline. | Wait on Summer for anything outside the Oversight list. |
| Kheluram Kumar | Brokerage service associate | Logging new submissions, sending submissions to markets, building retail proposals, sending approved proposals, bind follow-ups, filing documents. Covers the inbox during his shift. | Release a proposal Matthew has not checked (until Matthew signs him off). |
| Summer Jenkins-Wilson | Producer, brokerage oversight | Bringing in agents and business, carrier and wholesaler relationships, appointments. Hands new business to the inbox. Decides only the items in the Oversight section. | Build proposals, send quotes, chase bind requests. |
| Jacob Landman | Executive sponsor | Mailbox and C360 access, tools, weekly review, escalations Summer can't resolve. | Day-to-day file work. |

Other referral sources (Carma underwriting, Bryan, carriers) send brokerage work to the brokerage inbox, not to a person's Teams or inbox.

## Intake: one door for everything

All brokerage work enters and leaves through brokerage@carma365.com. If a file is not in the brokerage inbox and in C360, the team is not responsible for it.

**Before this works:** Matthew and Kheluram need full access to the brokerage shared mailbox. Matthew said on 9/23 he does not have it yet. Owner: Jacob, due Sep 24, 2026.

**Rules**

1. Agents, carriers and wholesalers send to brokerage@carma365.com. Summer already points new contacts there (IMA, 9/14); keep doing that.
2. Anything Summer, Carma underwriting or Bryan receives directly gets forwarded to the brokerage inbox the same day, with the handoff note below. No work is assigned through Teams DMs or texts.
3. All replies to agents and carriers go out from the brokerage inbox, never a personal inbox, so the thread stays visible to the whole team.
4. Every email and document is saved to the account in C360 and to Brokerage > New Business > the Named Insured folder. Nothing is saved to a desktop.
5. If C360 errors out (as it did on 9/23), log the item in the NB Log and back-fill C360 the same day it recovers.

**Handoff note (Summer to the brokerage inbox)**

One short email per new account, subject `NEW BIZ – [Named Insured] – [LOB] – Eff [MM/DD/YY]`:

- Agent and agency, with email
- Lines of business and effective date
- Incumbent carrier and premium, if known
- Anything promised to the agent (markets, price, timing)
- Attachments: application, loss runs, SOV, supplementals

**File names** (match what is already in C360):

- `26-27 [LOB] - Submission Email to [Carrier]`
- `26-27 [LOB] [Carrier] QUOTE $[premium]`
- `26-27 [LOB] - Proposal to Agent`
- `26-27 [LOB] - Bind Request` / `Binder` / `Policy`

## Workflow, step by step

Every file moves through the same eight steps. Matthew selects and releases quotes. Summer steps in only on the Oversight list.

```mermaid
flowchart TD
  A[Submission arrives<br/>brokerage inbox] --> B[Log in C360 + NB Log<br/>clear state]
  B --> C{Complete?}
  C -- No --> C1[Request missing items<br/>from agent]
  C1 --> B
  C -- Yes --> D[Send to markets<br/>per Marketing Matrix]
  D --> E[Quote or decline<br/>logged in C360]
  E --> F[Matthew selects quote]
  F --> G[Kheluram builds<br/>retail proposal]
  G --> H[Matthew QC]
  H --> I[Proposal to agent]
  I --> J[Follow up every<br/>3 business days]
  J --> K[Bind request]
  K --> L[Bind with carrier<br/>binder + invoice to agent]
  L --> M[Policy check, SL filing,<br/>deliver policy]
```

The left branch loops until the file is complete; nothing goes to market with missing items.

| # | Step | Who | Do this | Record |
| --- | --- | --- | --- | --- |
| 1 | Receive and log | Kheluram (Matthew backs up) | Reply to the agent that it's received. Create the C360 account and NB Log row. Check the state in the SLA Clearance Tool: no E&S in states where Carma has no surplus lines license. | C360 status, NB Log: Date Recd, Agent, LOB, Xdate, Incumbent |
| 2 | Complete the file | Kheluram | List what is missing (app, loss runs, SOV, supplementals, license) in one email to the agent. | NB Log status `Pending - Info Requested`, follow-up date |
| 3 | Market | Matthew picks markets, Kheluram sends | Choose carriers from the Marketing Matrix and Submission Routing Playbook by appetite, state and commission. Send from the brokerage inbox or the carrier portal (Blitz, LIO, Wholesure, Propeller). | `Pending - Submitted to Markets`, each submission email saved to C360 |
| 4 | Quote received | Kheluram | Log every quote or decline in C360. Chase any market that hasn't answered. | Quote PDF saved, quoted premium in NB Log |
| 5 | Select quote | Matthew | Apply the selection rules below. No email to Summer unless an Oversight item applies. | Note in C360: which quote and why |
| 6 | Build proposal | Kheluram, Matthew checks | Make the ten changes in the Retail Quote Preparation Training Guide, add the Carma Quote Cover Letter and the T&F Calculator figures. Matthew runs the Final Quality Checklist. | Proposal saved to Named Insured folder and C360 |
| 7 | Send and follow up | Kheluram | Send from the brokerage inbox with cover letter, proposal and bind requirements. Follow up every 3 business days until bound, declined or expired. | `Quoted - Awaiting Bind Request`, follow-up date |
| 8 | Bind and issue | Matthew (Kheluram assists) | Check signed quote forms, signed application, subjectivities, Diligent Effort form and payment. Send the bind order to the carrier, then send binder and invoice to the agent. When the policy arrives, check it against the quote, file surplus lines, deliver it. | `BOUND`, then `BOUND - Policy Issued`; folder moved to .BOUND BUSINESS |

**Quote selection rules (step 5)**

1. The quote matches what the agent asked for: lines, limits, and property if requested.
2. The carrier is eligible for the state, and E&S is only used where the SLA Clearance Tool allows it.
3. Among quotes that pass 1 and 2, lead with the lowest total cost after Carma taxes and fees.
4. If two quotes are close or trade coverage for price, send both with a one-page marketing summary (the format Summer shared on 9/23).
5. Anything outside these rules goes to Summer under Oversight.

**Service requests** (endorsements, cancellations, audits, loss runs) follow the same inbox rules: acknowledge the same day, submit to the carrier within 1 business day, and confirm back to the agent when the carrier responds.

## Timelines

The team is measured on these deadlines. Three come from Summer's Brokerage SOP; the rest are proposed to fill gaps and need her sign-off.

| Event | Deadline | Owner | Source |
| --- | --- | --- | --- |
| Bind request received | Confirmed to agent and bind order to carrier the same business day | Matthew | Proposed |
| Carrier binder received | Binder and invoice to agent within 1 business day | Matthew | Proposed |
| Carrier quote or decline received | Logged in C360 the same day | Kheluram | Summer's SOP |
| Carrier quote received | Retail proposal to agent within 1 business day | Kheluram builds, Matthew releases | Summer's SOP |
| Proposal sent, no bind request yet | Follow up with agent every 3 business days | Kheluram | Summer's SOP |
| New submission received | Acknowledged and logged the same business day | Kheluram | Proposed |
| Submission incomplete | One missing-items email the same business day | Kheluram | Proposed |
| Submission complete | Sent to markets within 1 business day | Matthew | Proposed |
| Market has not responded | Chase after 3 business days | Kheluram | Proposed |
| Service request received | Acknowledged same day, to carrier within 1 business day | Kheluram | Proposed |
| Policy received from carrier | Checked against quote and delivered within 2 business days | Matthew | Proposed |
| Effective date within 5 business days | Rush: moves to the top of the queue, Matthew handles | Matthew | Proposed |

Bind requests and rush files always come first. A missed deadline is flagged before it passes, per the Oversight section, not after.

## Summer's oversight

Summer approves only the items below. Everything else Matthew decides and releases himself. To ask for a decision, Matthew emails the brokerage inbox, subject `SUMMER APPROVAL – [Named Insured]`, with his recommendation. Summer answers the same business day.

**Needs Summer's approval**

- Premium of $40,000 or more. The admin fee is 3% of premium and needs management approval before the proposal goes out (Admin Fee Schedule).
- A market that is not in the Marketing Matrix, or needs a new appointment (for example, Earth Quality Products needs a Kinsale appointment).
- Leading with a quote that gives up coverage the agent asked for, such as property excluded.
- The first two files in any line the team hasn't written before. Flood for Ethos is the current one.
- Declining an account Summer brought in, or telling an agent Carma can't place it.
- Any agent complaint or relationship issue.

**Never allowed, no approval needed to say no**

- An admin fee below the band minimum.
- E&S business in a state flagged in the SLA Clearance Tool.
- Carrier contact details, carrier tax lines or total commission on a retail proposal.

**Escalation**

1. If a deadline in Timelines will be missed, Matthew tells Summer before it passes, with the file name and new date.
2. If Summer hasn't answered an approval by end of day, Matthew escalates to Jacob.
3. A system problem (C360 error, mailbox access, portal login) goes to Jacob the same day, and the file goes on in the NB Log.

**Ramp-down of Summer's review**

| Period | Summer's review |
| --- | --- |
| Weeks 1–2 | 15-minute daily check of every proposal Matthew released that day, after it is sent. Feedback in writing. |
| Weeks 3–4 | Spot-check 3 files a week, plus the approval list. |
| Week 5 on | Approval list and the weekly pipeline review only. |

## Daily and weekly cadence

The team is held to one daily report and one weekly review. The scorecard below is what Summer and Jacob check.

**Daily**

| When | Who | What |
| --- | --- | --- |
| Start of day | Matthew | Triage the brokerage inbox: bind requests and rush files first, then quotes received, then new submissions. Every new email is assigned to Matthew or Kheluram. |
| Kheluram's shift | Kheluram | Work his queue in the order above, from the NB Log follow-up dates. |
| End of day | Matthew | Every open file has a C360 status and a follow-up date. Send the end-of-day email below. |

**End-of-day email** (Matthew to Summer, cc Jacob, from the brokerage inbox)

- Bound today
- Proposals sent today
- Bind requests or quotes still open, with age in days
- Anything stuck and what is needed to unstick it

**Weekly pipeline review** (Monday, 30 minutes, Matthew, Kheluram, Summer, Jacob)

Walk the C360 pipeline report: New Business, Follow Up, Quote, Closed, Declined. Today's board shows 43 in New Business, 30 in Follow Up and 35 quoted and awaiting bind. Any file past its deadline gets an owner and a date in the meeting.

**Scorecard**

| Measure | Target |
| --- | --- |
| Bind requests not actioned the same business day | 0 |
| Carrier quotes not proposed to the agent within 1 business day | 0 |
| New submissions not logged the same day | 0 |
| Open files with no follow-up date | 0 |
| Files Summer had to work herself | 0 |

**C360 gap:** there is no C360 status for quote received, proposal pending (Matthew, 9/23). Until one is added, use `Quote Received - Proposal Pending` in the NB Log so those files show up in the daily triage.

## Backlog catch-up plan

The backlog gets cleared before anything else, including new tools. That is Summer's ask from 9/23, and it comes first in the week.

**This week, in this order**

- [ ] Give Matthew and Kheluram full access to the brokerage inbox. Jacob, Sep 24, 2026
- [ ] Work every bind order open since 9/18, oldest first, and confirm each one to the agent. Matthew, Sep 24, 2026
- [ ] Release the quote that has been ready since 9/18. Matthew, Sep 24, 2026
- [ ] Finish the Ethos flood quotes for Jodi through Wholesure. They were due 9/23. Kheluram with Summer, Sep 24, 2026
- [ ] Confirm the two rush submissions to Blitz and LIO (Summer, 9/22) went out. Kheluram, Sep 24, 2026
- [ ] Send a bind follow-up on each of the 35 quoted files. Kheluram, Sep 25, 2026
- [ ] Chase every market on the 30 Follow Up files that hasn't answered in 3 business days. Kheluram, Sep 28, 2026
- [ ] Review the 43 New Business files: marketed, waiting on info, or closed. Matthew, Sep 30, 2026

**Setup**

- [ ] Summer signs off the proposed timelines and the Oversight list. Summer, Sep 25, 2026
- [ ] First weekly pipeline review. All four, Sep 28, 2026
- [ ] Pause work on the proposal tool until the bind and quote backlog is clear. Matthew, now
- [ ] Ask the dev team for a C360 status for quote received, proposal pending, and a fix for the brokerage errors. Jacob, Sep 30, 2026

## Training library

Each step has one resource to learn from. Kheluram is signed off on a step once Matthew has checked 5 of his files at that step with no corrections.

| Step | Resource | Covers |
| --- | --- | --- |
| All | [Brokerage SOP (zip)](https://carma365-my.sharepoint.com/personal/summer_carma365_com/Documents/Microsoft%20Teams%20Chat%20Files/Brokerage%20SOP.zip) | Summer's New Business Process Flow, document control rules and timelines |
| All | [Brokerage Training recording, 9/22](https://carma365-my.sharepoint.com/:v:/p/summer/IQCmbUVaFYcFRLktA6Y2DUpLAQagXEecP8hr54SPYentW9o) | 47-minute session with Summer, Kheluram and Jacob |
| All | [Onboarding recording, 9/16](https://carma365-my.sharepoint.com/:v:/p/jacob/IQBQdghGN5cGSa7jRskVpt2rAQzx9QA_jCRewiuej4997NA) | Matthew, Kheluram and Jacob: C360, VPN, routing playbook |
| 1 | [SLA Clearance Tool](https://carma365-my.sharepoint.com/personal/summer_carma365_com/Documents/Microsoft%20Teams%20Chat%20Files/SLA_Clearance_Tool%204.html) | States where Carma cannot write E&S |
| 1, 7 | [NB Log](https://carma365.sharepoint.com/sites/Brokerage/Shared%20Documents/NB%20Log%20-%20Updated%202026-09-23.xlsx) and [C360](https://c360.carma365.com/) | Where every file is logged and tracked |
| 3 | [Marketing Matrix](https://carma365.sharepoint.com/sites/Brokerage/Shared%20Documents/Marketing%20Matrix.xlsx) | Carrier appetite, states, contacts, total and retail commission |
| 3 | [Submission Routing Playbook](https://carma365.sharepoint.com/:x:/r/sites/Brokerage/_layouts/15/Doc.aspx?sourcedoc=%7B2BC8C01D-497A-4826-A7A3-2D046B8B21CC%7D&file=CARMA_Brokerage_Submission_Routing_Playbook_2026-08-24.xlsx&action=default) | Which markets get which submissions |
| 5, 7 | [Marketing Summary example](<https://carma365-my.sharepoint.com/personal/summer_carma365_com/Documents/Microsoft%20Teams%20Chat%20Files/Marketing%20Summary%20(002).pdf>) | The side-by-side market comparison Summer wants for brokerage |
| 6 | [Retail Quote Preparation Training Guide](https://carma365-my.sharepoint.com/personal/summer_carma365_com/Documents/Microsoft%20Teams%20Chat%20Files/Retail_Quote_Preparation_Training_Guide.pdf) | The ten changes, Admin Fee Schedule, math check, filing rules, final checklist |
| 6 | [Brokerage Training – Send Quote, Conifer (zip)](https://carma365-my.sharepoint.com/personal/summer_carma365_com/Documents/Microsoft%20Teams%20Chat%20Files/Brokerage%20Training%20-%20Send%20Quote_Conifer%201.zip) | Summer's walkthrough of a Conifer quote to proposal |
| 6 | [T&F Calculator](https://carma365.sharepoint.com/sites/Brokerage/Shared%20Documents/Compliance/SLA/Carma_SLA_Master_License_and_TF.xlsx) | Surplus lines tax and fee rates by state |
| 7 | [Carma Quote Cover Letter](https://carma365-my.sharepoint.com/personal/summer_carma365_com/Documents/Microsoft%20Teams%20Chat%20Files/Carma%20Quote%20Cover%20Letter.docx) | Cover letter sent with every proposal |
| 8 | [Surplus Lines Compliance Guide](https://carma365.sharepoint.com/sites/Brokerage/Shared%20Documents/Compliance/SLA/Surplus_Lines_Compliance_Guide_CORRECTED.docx) | Filing rules after bind, all 51 jurisdictions |

## Sources

Built from Jacob's Teams chats with Summer, Matthew and Kheluram (9/11 to 9/23), the files above, and the [brokerage pipeline board](https://carma365-my.sharepoint.com/personal/matt_carma365_com/Documents/Microsoft%20Teams%20Chat%20Files/brokerage_pipeline_board_2026-09-23.xlsx) from 9/23. The 9/22 training transcript could not be read because transcript access is turned off for the Carma tenant. Only the timelines table of the Brokerage SOP zip could be read.
