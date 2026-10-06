import { CityRecord } from "@/lib/types";

export const cities: CityRecord[] = [
  {
    slug: "london",
    name: "London",
    checkedOn: "2026-10-01",
    summary: "The capital boasts a vast and diverse collection of Wetherspoon pubs, ranging from grand former theatres to historic bank buildings. Visitors can find several distinctive locations in both central areas like Covent Garden and across the sprawling outer boroughs. With dozens of establishments scattered across the city, there's nearly always a Spoons within easy reach.",
    pubs: [
      {
        name: "The Moon Under Water",
        area: "Leicester Square",
        address: "28 Leicester Square, London, WC2H 7LE",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Sir John Oldcastle",
        area: "Farringdon",
        address: "29-35 Farringdon Road, London, EC1M 3JF",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Metropolitan Bar",
        area: "Marylebone",
        address: "7 Station Approach, Marylebone Road, London, NW1 5LA",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Crosse Keys",
        area: "City of London",
        address: "9 Gracechurch Street, London, EC3V 0DR",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Ice Wharf",
        area: "Camden",
        address: "Unit 1-2, Suffolk Wharf, 28 Jamestown Road, London, NW1 7BY",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Are there Wetherspoon pubs in Central London?",
        answer: "Yes, there are several prominent Wetherspoon pubs in Zone 1, including locations near Leicester Square, Farringdon, and the City of London."
      },
      {
        question: "Do London Wetherspoons charge different prices?",
        answer: "Prices are typical and variable by pub. Central London locations generally have higher prices compared to those in outer boroughs."
      }
    ]
  },
  {
    slug: "manchester",
    name: "Manchester",
    checkedOn: "2026-10-01",
    summary: "Manchester features a robust selection of Wetherspoon pubs that serve as popular meeting spots for locals and students alike. The city centre has a number of prominent venues, many housed in beautifully converted historic structures. Whether near Piccadilly or Deansgate, the city offers several reliable options.",
    pubs: [
      {
        name: "The Waterhouse",
        area: "City Centre",
        address: "67-71 Princess Street, Manchester, M2 4EG",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Moon Under Water",
        area: "Deansgate",
        address: "68-74 Deansgate, Manchester, M3 2FN",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Paramount",
        area: "City Centre",
        address: "33-35 Oxford Street, Manchester, M1 4BH",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Ford Madox Brown",
        area: "Rusholme",
        address: "Wilmslow Park, Wilmslow Road, Manchester, M14 6FQ",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Which is the largest Wetherspoon in Manchester?",
        answer: "The Moon Under Water on Deansgate is known for being one of the largest pubs in the UK."
      },
      {
        question: "Are there Spoons near the universities?",
        answer: "Yes, The Ford Madox Brown is conveniently situated on the Oxford Road corridor near the main university campuses."
      }
    ]
  },
  {
    slug: "birmingham",
    name: "Birmingham",
    checkedOn: "2026-10-01",
    summary: "The UK's second city is home to a fantastic variety of Wetherspoon pubs across its extensive metropolitan area. From bustling Broad Street to the historic Jewellery Quarter, there are numerous venues serving the community. Visitors can expect around a dozen options scattered throughout the city and its immediate suburbs.",
    pubs: [
      {
        name: "The Briar Rose",
        area: "City Centre",
        address: "25 Bennetts Hill, Birmingham, B2 5RE",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Square Peg",
        area: "City Centre",
        address: "115 Corporation Street, Birmingham, B4 6PH",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Figure of Eight",
        area: "Broad Street",
        address: "236-239 Broad Street, Birmingham, B1 2HG",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Arthur Robertson",
        area: "Perry Barr",
        address: "One Stop Shopping Centre, Walsall Road, Birmingham, B42 1AA",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Does Birmingham have a Wetherspoon hotel?",
        answer: "Yes, The Briar Rose on Bennetts Hill also operates as a Wetherspoon hotel."
      },
      {
        question: "Are there Wetherspoons on Broad Street?",
        answer: "The Figure of Eight is located right on Broad Street, Birmingham's main nightlife hub."
      }
    ]
  },
  {
    slug: "leeds",
    name: "Leeds",
    checkedOn: "2026-10-01",
    summary: "Leeds enjoys a lively pub scene with several prominent Wetherspoon locations integrated into its vibrant city centre. Many of these pubs occupy striking historic architecture, perfectly complementing the city's Victorian heritage. With options near the train station and the central shopping districts, they are highly convenient for both locals and visitors.",
    pubs: [
      {
        name: "The Hedley Verity",
        area: "City Centre",
        address: "43a Woodhouse Lane, Leeds, LS1 3HQ",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Cuthbert Brodrick",
        area: "Millennium Square",
        address: "99 Portland Crescent, Leeds, LS2 3AD",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Stick or Twist",
        area: "Arena Quarter",
        address: "16 Merrion Way, Leeds, LS2 8PT",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Where can I find a Spoons near Leeds Arena?",
        answer: "The Stick or Twist is located very close to the First Direct Arena on Merrion Way."
      },
      {
        question: "Is there a Wetherspoon on Millennium Square?",
        answer: "Yes, The Cuthbert Brodrick overlooks Millennium Square, making it a popular spot."
      }
    ]
  },
  {
    slug: "glasgow",
    name: "Glasgow",
    checkedOn: "2026-10-01",
    summary: "Scotland's largest city hosts an excellent array of Wetherspoon pubs known for their grand, spacious interiors. You'll find several prominent locations right in the heart of the city, particularly around George Square and Jamaica Street. These pubs are renowned for their lively atmosphere, reflecting Glasgow's welcoming spirit.",
    pubs: [
      {
        name: "The Counting House",
        area: "George Square",
        address: "2 St Vincent Place, Glasgow, G1 2DH",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Crystal Palace",
        area: "City Centre",
        address: "36 Jamaica Street, Glasgow, G1 4QD",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Hengler's Circus",
        area: "Sauchiehall Street",
        address: "351-363 Sauchiehall Street, Glasgow, G2 3HU",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Which Glasgow Spoons is near George Square?",
        answer: "The Counting House is situated right next to George Square on St Vincent Place."
      },
      {
        question: "Are there Wetherspoons on Sauchiehall Street?",
        answer: "Yes, The Hengler's Circus is located prominently on Sauchiehall Street."
      }
    ]
  },
  {
    slug: "liverpool",
    name: "Liverpool",
    checkedOn: "2026-10-01",
    summary: "Liverpool offers a rich selection of Wetherspoon venues steeped in local maritime and cultural history. The city centre and surrounding areas contain several expansive pubs, frequently occupying impressive former banks and commercial buildings. They are popular spots for those exploring Albert Dock or the vibrant shopping districts.",
    pubs: [
      {
        name: "The Fall Well",
        area: "City Centre",
        address: "Roe Street, Liverpool, L1 1LS",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Welkin",
        area: "City Centre",
        address: "7 Whitechapel, Liverpool, L1 6DS",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Richard John Blackler",
        area: "City Centre",
        address: "Units 1 & 2, Charlotte Row, Great Charlotte Street, Liverpool, L1 1HU",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Lime Kiln",
        area: "Concert Square",
        address: "Fleet Street, Liverpool, L1 4NR",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Are there Wetherspoons near Liverpool Lime Street?",
        answer: "There are several city centre options within walking distance of Lime Street station, including The Fall Well."
      },
      {
        question: "Which Spoons is closest to Liverpool's nightlife area?",
        answer: "The Lime Kiln is located near Concert Square, a major hub for nightlife."
      }
    ]
  },
  {
    slug: "bristol",
    name: "Bristol",
    checkedOn: "2026-10-01",
    summary: "Bristol's dynamic, independent spirit is matched by a steady presence of Wetherspoon pubs across the city. Many locations reflect the city's rich mercantile history, occupying grand historic premises near the harbourside and central areas. There's a strong mix of large central venues and quieter suburban spots.",
    pubs: [
      {
        name: "The Commercial Rooms",
        area: "City Centre",
        address: "43-45 Corn Street, Bristol, BS1 1HT",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The V-Shed",
        area: "Harbourside",
        address: "The Waterfront, Canons Road, Bristol, BS1 5UH",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The W. G. Grace",
        area: "Clifton",
        address: "71-73 Whiteladies Road, Bristol, BS8 2NT",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Is there a Wetherspoon on the waterfront?",
        answer: "Yes, The V-Shed is situated directly on the Harbourside with excellent waterfront views."
      },
      {
        question: "Can I find a Spoons in Clifton?",
        answer: "The W. G. Grace is located on Whiteladies Road in the Clifton area."
      }
    ]
  },
  {
    slug: "edinburgh",
    name: "Edinburgh",
    checkedOn: "2026-10-01",
    summary: "The Scottish capital offers Wetherspoon patrons a selection of magnificent pubs set against a breathtaking historical backdrop. Several venues sit in prominent locations, including those along George Street and near Waverley Station. These grand locations are well-suited for relaxing after exploring the Royal Mile or Princes Street.",
    pubs: [
      {
        name: "The Standing Order",
        area: "New Town",
        address: "62-66 George Street, Edinburgh, EH2 2LR",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Playfair",
        area: "Leith Walk",
        address: "Omni Centre, Leith Walk, Edinburgh, EH1 3AA",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Alexander Graham Bell",
        area: "New Town",
        address: "128 George Street, Edinburgh, EH2 4JZ",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Booking Office",
        area: "Old Town",
        address: "17 Waverley Bridge, Edinburgh, EH1 1BQ",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Are there Wetherspoons on George Street?",
        answer: "Yes, both The Standing Order and The Alexander Graham Bell are located on George Street."
      },
      {
        question: "Which Spoons is closest to the train station?",
        answer: "The Booking Office is situated on Waverley Bridge, right next to Waverley Station."
      }
    ]
  },
  {
    slug: "sheffield",
    name: "Sheffield",
    checkedOn: "2026-10-01",
    summary: "Sheffield's sturdy industrial heritage provides the foundation for several well-loved Wetherspoon pubs. The city features a number of expansive central locations that are extremely popular with both the large student population and local residents. There are ample choices spread around the city centre and its immediate fringes.",
    pubs: [
      {
        name: "The Bankers Draft",
        area: "City Centre",
        address: "1-3 Market Place, Sheffield, S1 2GH",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Roebuck",
        area: "City Centre",
        address: "72 Charles Street, Sheffield, S1 2NB",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Rawson Spring",
        area: "Hillsborough",
        address: "Langsett Road, Sheffield, S6 2LN",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Woodseats Palace",
        area: "Woodseats",
        address: "692 Chesterfield Road, Sheffield, S8 0SD",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Which is the main Wetherspoon in Sheffield city centre?",
        answer: "The Bankers Draft near the Market Place is one of the most prominent central locations."
      },
      {
        question: "Are there Spoons outside the city centre?",
        answer: "Yes, there are suburban locations like The Rawson Spring in Hillsborough."
      }
    ]
  },
  {
    slug: "newcastle",
    name: "Newcastle",
    checkedOn: "2026-10-01",
    summary: "Newcastle upon Tyne is famous for its vibrant nightlife, and its Wetherspoon pubs are a key part of the experience. Visitors will find several impressive venues around the Quayside and the historic city centre, blending modern amenities with classic Tyneside architecture. The pubs offer great value in a city known for having a good time.",
    pubs: [
      {
        name: "The Quayside",
        area: "Quayside",
        address: "35-37 Close, Newcastle upon Tyne, NE1 3RN",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Keel Row",
        area: "The Gate",
        address: "Newgate Street, Newcastle upon Tyne, NE1 5TG",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Mile Castle",
        area: "City Centre",
        address: "Grainger Street, Newcastle upon Tyne, NE1 5JE",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Is there a Wetherspoon on the Newcastle Quayside?",
        answer: "Yes, The Quayside pub is situated right by the river, offering excellent views."
      },
      {
        question: "Which Spoons is near Central Station?",
        answer: "The Mile Castle is located close to Central Station on Grainger Street."
      }
    ]
  },
  {
    slug: "nottingham",
    name: "Nottingham",
    checkedOn: "2026-10-01",
    summary: "Nottingham offers a strong lineup of Wetherspoon pubs set against its legendary historical backdrop. Central locations often feature grand architecture and sweeping interiors, providing a reliable meeting point in the heart of the city. With a vibrant student culture, these pubs see steady activity all year round.",
    pubs: [
      {
        name: "The Roebuck Inn",
        area: "City Centre",
        address: "9-11 St James's Street, Nottingham, NG1 6FH",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Joseph Else",
        area: "Market Square",
        address: "11-12 South Parade, Nottingham, NG1 2JS",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Company Inn",
        area: "Canalhouse",
        address: "Castle Wharf, Canal Street, Nottingham, NG1 7EH",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Is there a Wetherspoon on Old Market Square?",
        answer: "Yes, The Joseph Else is located directly on South Parade facing Old Market Square."
      },
      {
        question: "Does Nottingham have a Spoons near the canal?",
        answer: "The Company Inn sits near Castle Wharf on Canal Street."
      }
    ]
  },
  {
    slug: "leicester",
    name: "Leicester",
    checkedOn: "2026-10-01",
    summary: "Leicester boasts a collection of centrally located Wetherspoon pubs that serve as reliable fixtures for locals. Ranging from historic corn exchanges to modern refits, the city provides several welcoming spots for a drink. They are nicely spaced around the commercial centre, making them ideal rest stops.",
    pubs: [
      {
        name: "The Corn Exchange",
        area: "Market Place",
        address: "Market Place, Leicester, LE1 5GG",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The High Cross",
        area: "High Street",
        address: "103-105 High Street, Leicester, LE1 4JB",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The White House",
        area: "Scraptoft",
        address: "375 Scraptoft Lane, Leicester, LE5 2HU",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Where is the oldest Wetherspoon in Leicester?",
        answer: "The Corn Exchange occupies one of Leicester's most iconic and historic market buildings."
      },
      {
        question: "Is there a Spoons near the Highcross shopping centre?",
        answer: "The High Cross is conveniently located on High Street nearby."
      }
    ]
  },
  {
    slug: "coventry",
    name: "Coventry",
    checkedOn: "2026-10-01",
    summary: "Coventry provides a solid array of Wetherspoon venues that cater beautifully to its diverse and growing population. Visitors can find expansive pubs right in the city centre, often celebrating the area's rich automotive and medieval history. There are a handful of great locations perfect for relaxing after visiting the famous cathedral.",
    pubs: [
      {
        name: "The Flying Standard",
        area: "City Centre",
        address: "2-10 Trinity Street, Coventry, CV1 1FL",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Earl of Mercia",
        area: "High Street",
        address: "18 Broadgate, Coventry, CV1 1FS",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Spon Gate",
        area: "Skydome",
        address: "The Skydome, Croft Road, Coventry, CV1 3AZ",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Are there Wetherspoons near Coventry Cathedral?",
        answer: "Both The Flying Standard and The Earl of Mercia are within close walking distance of the cathedral."
      },
      {
        question: "Which Spoons is near the Skydome?",
        answer: "The Spon Gate is located directly within the Skydome complex."
      }
    ]
  },
  {
    slug: "cardiff",
    name: "Cardiff",
    checkedOn: "2026-10-01",
    summary: "The Welsh capital features a prominent selection of Wetherspoon pubs spread across its lively central district. Renowned for accommodating massive match-day crowds, these pubs are spacious and full of character. You'll find several superb options near the stadium, the castle, and Cardiff Bay.",
    pubs: [
      {
        name: "The Prince of Wales",
        area: "City Centre",
        address: "81-83 St Mary Street, Cardiff, CF10 1FA",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Central Bar",
        area: "Windsor Place",
        address: "39 Windsor Place, Cardiff, CF10 3BW",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Great Western",
        area: "Central Station",
        address: "64 St Mary Street, Cardiff, CF10 1FA",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Mount Stuart",
        area: "Cardiff Bay",
        address: "Stuart Terrace, Mermaid Quay, Cardiff, CF10 5BU",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Which is the largest Wetherspoon in Cardiff?",
        answer: "The Prince of Wales, housed in a magnificent former theatre, is one of the largest."
      },
      {
        question: "Is there a Spoons in Cardiff Bay?",
        answer: "Yes, The Mount Stuart offers a multi-level venue right in Mermaid Quay."
      }
    ]
  },
  {
    slug: "belfast",
    name: "Belfast",
    checkedOn: "2026-10-01",
    summary: "Belfast hosts a striking presence of Wetherspoon pubs known for their majestic architectural conversions. Operating in former churches and grand banks, these pubs offer some of the most impressive interiors in the city. There are a few select, high-quality locations situated right in the city centre.",
    pubs: [
      {
        name: "The Bridge House",
        area: "City Centre",
        address: "35-43 Bedford Street, Belfast, BT2 7EJ",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Central Bar",
        area: "City Centre",
        address: "Bankmore Square, Belfast, BT2 7BP",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Spirit Merchant",
        area: "Newtownards",
        address: "54-56 Regent Street, Newtownards, BT23 4AL",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Where is the main Wetherspoon in Belfast?",
        answer: "The Bridge House on Bedford Street is the most prominent central location."
      },
      {
        question: "Are Belfast Wetherspoons prices different?",
        answer: "Prices remain typical and variable by pub, aligning closely with regional averages."
      }
    ]
  },
  {
    slug: "southampton",
    name: "Southampton",
    checkedOn: "2026-10-01",
    summary: "Southampton features a robust collection of Wetherspoon pubs reflecting its deep maritime heritage. The venues are well-placed throughout the city, providing ample choice for students, locals, and cruise passengers alike. Several excellent locations sit proudly along the main commercial streets.",
    pubs: [
      {
        name: "The Standing Order",
        area: "High Street",
        address: "30 High Street, Southampton, SO14 2DF",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Giddy Bridge",
        area: "London Road",
        address: "10-16 London Road, Southampton, SO15 2AF",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Red Lion",
        area: "Bitterne",
        address: "448 Bitterne Road, Southampton, SO18 1EF",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Is there a Wetherspoon near Southampton High Street?",
        answer: "Yes, The Standing Order is a grand old bank building situated right on the High Street."
      },
      {
        question: "Are there Spoons outside the city centre?",
        answer: "The Red Lion offers a great suburban alternative in the Bitterne area."
      }
    ]
  },
  {
    slug: "portsmouth",
    name: "Portsmouth",
    checkedOn: "2026-10-01",
    summary: "Portsmouth's naval history provides a fitting backdrop for its busy Wetherspoon pubs. The city offers a handful of bustling locations, particularly around Southsea and the main commercial centres. These pubs serve as great local hubs, maintaining a lively atmosphere throughout the week.",
    pubs: [
      {
        name: "The Isambard Kingdom Brunel",
        area: "Guildhall Walk",
        address: "2 Guildhall Walk, Portsmouth, PO1 2DD",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Sir Alec Rose",
        area: "Port Solent",
        address: "32-33 The Boardwalk, Port Solent, Portsmouth, PO6 4TP",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The John Jacques",
        area: "Fratton",
        address: "78-82 Fratton Road, Portsmouth, PO1 5DZ",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Is there a Wetherspoon in Port Solent?",
        answer: "Yes, The Sir Alec Rose is located right on The Boardwalk in Port Solent."
      },
      {
        question: "Which Spoons is closest to the Portsmouth Guildhall?",
        answer: "The Isambard Kingdom Brunel is perfectly placed on Guildhall Walk."
      }
    ]
  },
  {
    slug: "plymouth",
    name: "Plymouth",
    checkedOn: "2026-10-01",
    summary: "Plymouth enjoys a modest but excellent selection of Wetherspoon pubs that embrace the city's rich seafaring roots. From grand historic restorations to convenient high street locations, there are several solid choices available. They are well-loved by the local naval community, students, and tourists alike.",
    pubs: [
      {
        name: "The Union Rooms",
        area: "Union Street",
        address: "19 Union Street, Plymouth, PL1 2SU",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Gog and Magog",
        area: "Barbican",
        address: "57 Southside Street, Plymouth, PL1 2LA",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Britannia Inn",
        area: "Milehouse",
        address: "1 Wolseley Road, Plymouth, PL2 3AA",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Stannary Court",
        area: "Plympton",
        address: "81-83 Ridgeway, Plympton, Plymouth, PL7 2AA",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Is there a Wetherspoon near the Barbican?",
        answer: "The Gog and Magog is situated ideally on Southside Street in the historic Barbican area."
      },
      {
        question: "Which is the largest Spoons in Plymouth?",
        answer: "The Union Rooms on Union Street is one of the most spacious venues in the city."
      }
    ]
  },
  {
    slug: "derby",
    name: "Derby",
    checkedOn: "2026-10-01",
    summary: "Derby offers a solid collection of Wetherspoon pubs steeped in the city's rich industrial past. Centrally located and traditionally styled, the pubs provide a welcoming retreat. With a handful of classic venues, there's always a reliable spot for a relaxed pint in the city.",
    pubs: [
      {
        name: "The Standing Order",
        area: "Iron Gate",
        address: "28-32 Iron Gate, Derby, DE1 3GL",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Babington Arms",
        area: "Babington Lane",
        address: "11-13 Babington Lane, Derby, DE1 1TA",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Thomas Leaper",
        area: "Iron Gate",
        address: "27 Iron Gate, Derby, DE1 3GL",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Are there Wetherspoons on Iron Gate?",
        answer: "Yes, both The Standing Order and The Thomas Leaper are conveniently located on Iron Gate."
      },
      {
        question: "Is The Babington Arms known for real ale?",
        answer: "The Babington Arms has a long-standing reputation for an excellent and rotating selection of real ales."
      }
    ]
  },
  {
    slug: "stoke-on-trent",
    name: "Stoke-on-Trent",
    checkedOn: "2026-10-01",
    summary: "Stoke-on-Trent, with its unique layout of six distinct towns, houses a handful of well-distributed Wetherspoon pubs. The locations playfully nod to the city's world-famous pottery heritage in their naming and decor. They provide essential local hubs scattered conveniently across the potteries.",
    pubs: [
      {
        name: "The Reginald Mitchell",
        area: "Hanley",
        address: "Parliament Row, Hanley, Stoke-on-Trent, ST1 1NQ",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Bradley Green",
        area: "Biddulph",
        address: "68 High Street, Biddulph, Stoke-on-Trent, ST8 6AR",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Wheatsheaf",
        area: "Stoke",
        address: "84-92 Church Street, Stoke-on-Trent, ST4 1BU",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      },
      {
        name: "The Arnold Machin",
        area: "Newcastle-under-Lyme",
        address: "37 Ironmarket, Newcastle-under-Lyme, ST5 1PB",
        status: "open",
        sourceUrl: "https://www.jdwetherspoon.com/pubs",
        checkedOn: "2026-10-01"
      }
    ],
    faqs: [
      {
        question: "Which Spoons is in the Hanley city centre?",
        answer: "The Reginald Mitchell is prominently located on Parliament Row in Hanley."
      },
      {
        question: "Is there a Wetherspoon in Newcastle-under-Lyme?",
        answer: "Yes, The Arnold Machin is located nearby in the Ironmarket."
      }
    ]
  }
];
