---
title: Can I Install an EV Charger on a 100-Amp Service?
seoTitle: EV Charger on 100 Amp Service: No Panel Upgrade?
description: A Level 2 EV charger on a 100-amp panel is often possible without a service upgrade. See how charger size changes the math, how the NEC 220.87 load calculation works, and what to do when it is close.
category: panel-capacity
audience: homeowner
updated: 2026-09-21
order: 3
---

**Usually, yes.** Whether a Level 2 charger fits on a 100-amp service depends on two numbers: what your home already draws at its peak, and how large a charger you actually need. Both are usually smaller than people assume.

## Charger size is a choice

A Level 2 charger is not one size. Most can be set at installation to a lower output, and the circuit is sized at 125 percent of that setting because EV charging is a continuous load.

| Charger output | Breaker | Power | Range added per hour (approx.) |
|---|---|---|---|
| 16 A | 20 A | 3.8 kW | 12–15 miles |
| 24 A | 30 A | 5.8 kW | 18–22 miles |
| 32 A | 40 A | 7.7 kW | 25–30 miles |
| 40 A | 50 A | 9.6 kW | 30–37 miles |
| 48 A | 60 A | 11.5 kW | 37–45 miles |

A car that drives 40 miles a day needs roughly three hours on a 16-amp charger. The 48-amp unit is rarely necessary, and it is the one most likely to trigger an upgrade conversation.

## The load calculation

Under [NEC 220.87](/resources/guides/nec-220-87/), a contractor takes your home's highest measured 15-minute peak from the last twelve months, multiplies it by 125 percent, and adds the charger. Using the national average peak of 9.7 kW (about 40 amps) measured by Lawrence Berkeley National Laboratory:

| | 32 A charger | 48 A charger |
|---|---|---|
| Measured peak at 125% | 50 A | 50 A |
| EV charger | 32 A | 48 A |
| **Total** | **82 A, fits** | **98 A, fits, barely** |

The same home run through a traditional nameplate calculation will often come out over 100 amps before the charger is even added. That is the difference between an estimate and a measurement. Your home's real peak may be higher or lower than average, which is why it needs to be checked with your own data.

## If it is close

- **Turn the charger down.** Dropping from 48 A to 32 A frees 16 amps and still fully charges most cars overnight.
- **Use load management.** The NEC recognizes energy management systems that monitor the service and throttle or pause the charger when the house is busy. With one in place, the charger's load in the calculation is the limit the system enforces, not the charger's maximum.
- **Share a circuit.** Devices that switch a 240-volt circuit between the dryer and the charger avoid adding load at all.
- **Charge off-peak.** This does not change the code calculation, but most home peaks are in the early evening and most charging happens after midnight. Real-world overlap is small.

## What to ask your installer

1. Is the problem breaker space or service capacity?
2. Which load calculation did you use, and did it look at my actual usage?
3. Can we run a 220.87 calculation from my smart-meter data before deciding on an upgrade?
4. What charger setting do I actually need for my daily driving?

If they have not used 220.87 before, send them this page. They will need twelve months of interval data from your utility, which you can authorize. [Here is how to get it.](/resources/guides/how-to-get-interval-data-from-your-utility/)

For a quick sense of where you stand, try the [panel capacity calculator](/resources/calculator/).

---

Figures are for illustration. The calculation for a permit must be prepared by a licensed professional using the equipment nameplate and the code edition adopted locally. Your permitting authority has the final say.
