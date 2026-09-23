---
title: What Inspectors Want to See in a 220.87 Load Calculation
seoTitle: What Inspectors Want in a 220.87 Load Calculation
description: A measured-demand load calculation gets approved when the reviewer can follow it in two minutes. The eight things an AHJ looks for in a 220.87 submission for a heat pump or EV charger permit, and the questions to settle before your first one.
category: code
updated: 2026-09-21
order: 3
---

Most pushback on a [220.87 calculation](/resources/guides/nec-220-87/) is not disagreement with the code. It is a reviewer looking at an unfamiliar method with numbers they cannot trace. A plan reviewer has a few minutes per permit. The submission that gets approved is the one they can check without calling you.

## The eight things a reviewer looks for

1. **The code basis, stated up front.** "Existing load determined per NEC 220.87" with the adopted edition. Do not make them guess which method they are looking at.
2. **Where the data came from.** The utility's name, the meter or account it belongs to, and the service address. Utility revenue-meter data is more persuasive than a contractor's clamp meter because a third party recorded it.
3. **The period covered.** Start and end dates showing a full twelve months, including both the heating and the cooling season.
4. **The interval length.** 15-minute or hourly. If hourly, say so openly. Some AHJs accept it as is, some want a margin, some want 15-minute data. Hiding it is what causes a rejection.
5. **The peak, with its date and time.** One number, in kW and converted to amps, with the conversion shown. A peak at 6 pm on a January weekday is believable. A reviewer who can see it will trust it.
6. **The 125 percent factor, shown as its own line.** This is the code's safety margin and the first thing an informed reviewer checks.
7. **The new load, itemized.** Each piece of equipment with its nameplate value (MCA or kW), and any judgment you made about it. If you treated a load as non-concurrent with the measured peak, such as new air conditioning on a service that peaks in winter, say so and say why. For an EV charger under load management, note the enforced limit and the device enforcing it.
8. **The comparison and the result.** Measured peak at 125 percent, plus new load, against the service rating. State the main breaker size, the service voltage, and the remaining capacity.

Add the preparer's name, license number and date. A calculation with a name on it is treated differently from one without.

## Data-quality notes that head off questions

- Number of intervals analyzed and how many were missing or estimated
- Whether the site has solar, a battery or a generator, and how you handled it. Net-metered data understates load, so a reviewer who knows that will ask.
- Any large load added or removed during the data period
- Confirmation that the home was occupied throughout

## Before your first submission

Call or email the building department before the permit goes in, not after it bounces. Three questions cover it:

- "We'd like to use NEC 220.87 with twelve months of utility interval data for existing-service load calculations. Is there anything specific you want to see?"
- "Do you accept hourly interval data where the utility does not provide 15-minute?"
- "Can I send you a sample report for a look before we submit one on a live job?"

Inspectors are generally more receptive when asked first. Vermont's Chief State Electrical Inspector has described 220.87 as "an acceptable means of calculating an existing service load." Once a department has seen and approved one, later submissions tend to go more smoothly.

## If it is rejected

Ask for the specific objection in writing, and address that objection rather than re-arguing the method. The usual ones are data resolution, solar, or a missing item from the list above, and all three are fixable. The AHJ has final authority, and [220.83](/resources/guides/nec-220-83-vs-220-87/) remains available as the fallback.

## What a TrueLoad report contains

A TrueLoad report covers the list above:

- Project information: customer, address, jurisdiction and permit number
- Preparer information: name, title, license number and company
- Existing service: voltage, service rating and panel bus rating
- AMI data: provider, measurement period, data interval and data-quality notes
- Proposed equipment schedule, with kVA and concurrent status for each item
- The NEC 220.87 calculation, step by step: existing demand, 125 percent of it, new concurrent load, adjusted demand, service capacity and available margin
- The determination, PASS or FAIL, with utilization
- A disclaimer and a signature block

It prints from the browser, ready to attach to the permit application.

---

TrueLoad is a service adequacy evaluation aid. It does not guarantee code compliance or imply AHJ approval. Final responsibility remains with the preparer of record and the Authority Having Jurisdiction.
