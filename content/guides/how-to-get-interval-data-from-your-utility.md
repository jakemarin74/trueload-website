---
title: How to Get 12 Months of Interval Data From Your Utility
seoTitle: How to Get Smart Meter Interval Data From a Utility
description: An NEC 220.87 load calculation needs a year of smart-meter interval data. Here is where to find it, what to ask the utility for, how to read the file, and the pitfalls that make an inspector push back.
category: utility-data
updated: 2026-09-21
featured: true
order: 1
---

A measured-demand load calculation under [NEC 220.87](/resources/guides/nec-220-87/) stands on one thing: a year of data showing what the service actually carried. For almost every home with a smart meter, that data already exists. The work is getting it out.

## What you are asking for

Use these words with the utility, because the first person you reach may not know what a load calculation is:

- **Interval data** (also called *interval usage*, *load profile data* or *AMI data*), not monthly billing history
- **15-minute intervals** if the meter records them, otherwise hourly
- **The most recent 12 months**, or more
- **kWh per interval** (or kW demand), with timestamps
- In **CSV, Excel or Green Button XML** format

Monthly bills and daily totals are not enough. The calculation needs the highest short-duration peak, and that is invisible in a monthly kWh figure.

## Route 1: the customer downloads it

Most large utilities offer self-service download in the online account. Look under usage, energy use or "my data" for one of these labels:

- **Green Button / Download My Data.** A national standard. The file is XML (sometimes CSV) and contains interval readings. The Green Button Alliance keeps a [list of participating utilities](https://www.greenbuttonalliance.org/green-button-download-my-data-dmd).
- **Export usage / Download usage data.** Choose the smallest interval offered and the longest date range. Some portals cap each download at a month or a quarter, so you may need several files.

This is the fastest route when it works: the homeowner can do it in five minutes and email you the file.

## Route 2: the utility sends it

Smaller utilities, co-ops and municipals often have no download option but will release the data on request. The account holder has to authorize it. A request that works:

> I am the account holder for [service address], account number [number]. I authorize [utility] to release my electric interval usage data (15-minute if available, otherwise hourly) for the most recent 12 months to [contractor name, email]. The data will be used for an electrical service load calculation under NEC 220.87. Please send it in CSV or Excel format.

Send it from the email address on the account, or have the customer call and then follow up in writing. Ask for the meter data or AMI group if customer service is unsure. TrueLoad generates this request for you from the project details, so the customer only has to approve it.

Utility-specific instructions: [Green Mountain Power](/resources/guides/green-mountain-power-interval-data/). More utilities are being added.

## Route 3: no smart meter, or no data

If there is no interval meter, or the occupants have been there less than a year, 220.87 has an exception: record demand continuously for at least 30 days with a recording ammeter or power meter on the highest-loaded phase of the service, while the building is occupied, and account for the larger of the heating or cooling load and other seasonal loads. In the 2023 and 2026 editions that exception is not allowed where the service has a solar PV or wind system, or uses any form of peak load shaving. When this route is impractical, [220.83 is the fallback](/resources/guides/nec-220-83-vs-220-87/), and TrueLoad runs it from the same project, so the job does not wait on data.

## Reading the file

- **kWh to kW.** Interval files usually give energy, not power. For 15-minute data, multiply each kWh value by 4 to get average kW for that interval. For hourly data, kWh equals average kW.
- **kW to amps.** On a 120/240-volt single-phase service, amps = kW × 1,000 ÷ 240. A 9.6 kW peak is 40 amps.
- **Find the single highest interval** across the full year. That is the maximum demand. Note the date and time, because a reviewer may ask.

## Pitfalls

- **Hourly data smooths peaks.** An hour that averaged 8 kW may have contained a 15-minute stretch at 10 kW. The one-year requirement sets no interval length, but the code's definition of maximum demand (in the 30-day exception) is a 15-minute average. Say plainly in your report which interval length you used, and expect some AHJs to ask for 15-minute data or an added margin.
- **Solar hides load.** A net meter records what the house draws from the grid after solar has covered part of it. Midday peaks can disappear. You need gross consumption: either a separate "delivered" channel plus the solar production data, or a utility file that already separates them.
- **Gaps and estimates.** Look for missing intervals, zeroes during outages and flagged estimated reads. A few are normal. A missing January is not.
- **The wrong twelve months.** If a large load was added or removed during the year, or the house sat empty, the data will not reflect how it is used now.
- **Multiple meters.** A second meter for an ADU, a well or an off-peak water heater rate means the file you have may not be the whole service.

## What TrueLoad does with it

Upload the CSV, Excel or XML file and TrueLoad reads the intervals, finds the peak, applies the 125 percent factor, adds the proposed equipment and produces a report for the AHJ. [What inspectors want to see in that report](/resources/guides/what-inspectors-want-in-a-220-87-report/) is covered separately.
