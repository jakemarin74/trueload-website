---
title: Can a 100-Amp Panel Handle a Heat Pump?
seoTitle: Can a 100 Amp Panel Handle a Heat Pump?
description: Usually yes. A heat pump draws less than most people expect, and most 100-amp services have more room than a worst-case calculation shows. Here are the real numbers, what actually causes problems, and how to document it for a permit.
category: panel-capacity
audience: homeowner
updated: 2026-09-21
order: 2
---

**Short answer: in most homes, yes.** The heat pump itself is rarely the problem. What pushes a 100-amp service over the line is usually large electric resistance backup heat, or a worst-case load calculation that overstates what the home already uses.

## What a heat pump actually draws

Always use the nameplate of the equipment being installed. As a rough guide:

| Equipment | Typical circuit | Approximate load |
|---|---|---|
| Single-zone mini-split | 15–20 A, 240 V | 1–3 kW |
| Multi-zone mini-split | 25–40 A, 240 V | 3–6 kW |
| Central ducted heat pump, 2–4 ton | 25–50 A, 240 V | 4–8 kW |
| Electric resistance backup strips | 30–100 A, 240 V | 5–20 kW |
| Heat pump water heater, 240 V | 30 A | up to 4.5 kW with elements on |

Two things stand out. A heat pump replacing a central air conditioner often adds very little, because the AC it replaces drew a similar amount. And the backup heat strips can draw more than the rest of the house combined.

## What a 100-amp service can deliver

100 amps at 240 volts is **24 kW**. Lawrence Berkeley National Laboratory measured the annual peak of 11,940 homes and found an average of **9.7 kW**, around 40 amps. The typical home leaves more than half of a 100-amp service unused at its busiest moment of the year.

## Running the numbers

Under [NEC 220.87](/resources/guides/nec-220-87/), the measured peak is taken at 125 percent and the new load is added:

| | Heat pump only | Heat pump + 10 kW strips |
|---|---|---|
| Measured peak, 9.7 kW at 125% | 50 A | 50 A |
| 3-ton heat pump | 30 A | 30 A |
| Backup strips | — | 42 A |
| **Total** | **80 A, fits** | **122 A, does not fit** |

Same house, same heat pump. The strips decide the outcome.

## Why the traditional calculation often says no

The [220.83 method](/resources/guides/nec-220-83-vs-220-87/) counts every appliance at nameplate and takes new heating equipment at 100 percent on top. In a home with an electric range, dryer and water heater, that commonly lands just over 100 amps even though the main breaker has never come close to tripping. That is a calculated overload, not an observed one, and it is where a measured calculation changes the answer.

## If it is close

- **Size backup heat honestly.** A cold-climate heat pump in a reasonably tight home may need small strips or none. Ask for a proper heating load calculation rather than a default 15 or 20 kW kit.
- **Stage or lock out the strips** so they cannot run alongside other big loads, where the equipment and your AHJ allow it.
- **Choose a 120-volt heat pump water heater** if water heating is part of the project.
- **Use a load-management device** on a flexible load such as an EV charger.
- **Remember what is coming out.** Removing an old AC, electric furnace or resistance water heater frees capacity.

## For contractors: documenting it for the permit

Inspectors increasingly want a formal calculation before approving a heat pump on an existing service. With twelve months of utility interval data, the 220.87 calculation takes minutes and does not require a site visit to inventory appliances. [What inspectors want to see in a 220.87 report](/resources/guides/what-inspectors-want-in-a-220-87-report/) covers the submission itself.

Want a quick check first? Try the [panel capacity calculator](/resources/calculator/).

---

Figures here are typical values for illustration. Use the nameplate data for the actual equipment, and the code edition adopted in your jurisdiction. The AHJ has the final say.
