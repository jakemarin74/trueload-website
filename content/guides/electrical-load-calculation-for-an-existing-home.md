---
title: Electrical Load Calculation for an Existing Home: The Four Methods
seoTitle: Electrical Load Calculation for an Existing Home
description: Adding a heat pump, EV charger or range to an existing service means a load calculation for the permit. The four NEC methods compared, what each one needs, how long it takes, and which to try first.
category: code
updated: 2026-09-21
order: 4
---

"Do a load calc" can mean four different things under NEC Article 220. Section numbers and percentages below are from the 2020 and 2023 editions. The 2026 edition moves all of them to Article 120 (220.83 becomes 120.83, 220.87 becomes 120.87) and changes the two optional methods. The changes are noted under each one. For an existing home, the method you pick often decides whether the job needs a service upgrade, so it is worth knowing all four.

## The four methods at a glance

| Method | NEC section | Built from | Best for |
|---|---|---|---|
| Standard | Article 220, Parts II and III | Square footage, circuits, every appliance, with separate demand factors for each category | New construction, plan review, any dwelling |
| Optional, new dwelling | 220.82 | Same inventory. First 10 kVA at 100%, remainder at 40%, plus heating or cooling | New homes, full remodels |
| Optional, existing dwelling | 220.83 | Same inventory. First 8 kVA at 100%, remainder at 40%, new heating or cooling at 100% | Adding load to a home with no usage history, any service size |
| Measured demand | 220.87 | 12 months of recorded maximum demand at 125%, plus the new load | Adding load to any existing service with interval data |

## 1. The standard method

The long-form calculation. General lighting at 3 VA per square foot, 1,500 VA per small-appliance and laundry circuit, a lighting demand factor, then ranges, dryers, fixed appliances, the larger of heating or cooling, and the largest motor, each under its own rule. It is accepted everywhere and it is the most conservative. On an older all-electric home it nearly always says the service is full.

## 2. The optional method for new dwellings, 220.82

A shortcut for a dwelling served by a single 3-wire 120/240 V or 208Y/120 V service of 100 amps or more. Total the general loads, take the first 10 kVA at 100 percent and the rest at 40 percent, then add the largest of six heating or air-conditioning selections, each with its own percentage. Less arithmetic, usually a lower answer than the standard method.

**2026 edition (120.82):** lighting drops to 2 VA per square foot, the first tier drops to 8 kVA, and EV chargers come out of the 40 percent pool and are added at 100 percent.

## 3. The optional method for existing dwellings, 220.83

Written for exactly this situation: can an existing service take additional load? It covers a dwelling unit on a 3-wire 120/240 V or 208Y/120 V service with no minimum size, so 60 A and 100 A services qualify. First 8 kVA at 100 percent, remainder at 40 percent, with new air conditioning or electric heating taken at 100 percent. It still requires an inventory of every appliance nameplate in the house, and it still models the home rather than observing it.

**2026 edition (120.83):** one table instead of two. Lighting drops to 2 VA per square foot, and new loads get their own percentages: EV chargers and central resistance heat at 80 percent, everything else new, including a heat pump, at 50 percent. For a heat pump job, that makes the traditional method noticeably friendlier than it was under 2023.

## 4. Measured demand, 220.87

The only method that uses what the home actually does. Get twelve months of maximum demand data, which for most homes means the utility's smart-meter interval file. Take the highest measured demand, multiply by 125 percent, add the new load, and compare with the service rating. The 2026 edition renumbers it 120.87 and lets you subtract any load being removed. Details are in our [plain-language guide to NEC 220.87](/resources/guides/nec-220-87/).

Lawrence Berkeley National Laboratory's analysis of 11,940 homes found an average measured peak of 9.7 kW, and 220.87 results roughly 40 percent lower than 220.83 on average. We work one house through both in [220.83 vs. 220.87](/resources/guides/nec-220-83-vs-220-87/): 106 amps one way, 81 amps the other, on the same 100-amp service.

## What each one costs you

| | Standard / 220.82 / 220.83 | 220.87 |
|---|---|---|
| Site visit to inventory appliances | Required | Not needed for the existing load |
| Information from the customer | Square footage, access to every nameplate | Authorization to release utility data |
| Waiting on others | None | Utility turnaround, often a day or so, sometimes longer |
| Time to calculate | 30–60 minutes by hand or spreadsheet | Minutes, once the data is in hand |
| Sensitive to | A missed or misread nameplate | Data gaps, solar, recent changes in the home |

## Which to try first

1. **Is there a smart meter and a year of history?** Start with 220.87. It is the most accurate picture of the home and usually the most favorable. [How to get the data.](/resources/guides/how-to-get-interval-data-from-your-utility/)
2. **No usable data?** Use 220.83.
3. **AHJ requires the standard method?** Then that is the method. It is still worth asking whether they will accept 220.87, because it is in the code they have adopted. See [what inspectors want to see](/resources/guides/what-inspectors-want-in-a-220-87-report/).
4. **Every method says no?** Look at load management, smaller or staged equipment, and what is being removed, before pricing a new service.

## Where TrueLoad fits

TrueLoad runs methods 3 and 4 from the same project. With interval data, it reads the utility's file, finds the peak, applies the 125 percent factor and adds your proposed equipment. Without data, it runs the existing-dwelling calculation from floor area, circuits and the appliance inventory, under the 2020, 2023 or 2026 edition. Either way it prints a report for the AHJ with the full worksheet, and when both have run you choose which one the report is based on. It does not do the standard method or the new-dwelling optional method. [How the two paths fit together.](/methods/)

For a fast, rough check before you request data, use the free [panel capacity calculator](/resources/calculator/).

---

This guide summarizes the methods for orientation and paraphrases the code. Demand factors and section numbers vary between NEC editions. Work from the edition your jurisdiction has adopted.
