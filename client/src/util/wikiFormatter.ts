import { Room } from "../types";

function hideLink(node: HTMLAnchorElement) {
  node.classList.add("link-hide");
}

function disableLink(node: HTMLAnchorElement) {
  node.addEventListener("click", (e) => {
    console.log("click");
    e.preventDefault();
  });
}

export async function anchorClickListen(callback: (pageTitle: string) => void) {
  const atags = document.querySelectorAll("a");

  for (let node of atags) {
    // node.setAttribute("data-link-remove", node.innerText);
    // node.classList.add(searchHide);
    // node.innerHTML = "";

    if (node.href.match(/^.*\.[a-zA-Z\d]+$/)) {
      hideLink(node);
      disableLink(node);
      continue;
    }

    if (node.href.includes("#")) {
      hideLink(node);
      disableLink(node);
      continue;
    }

    // Find better way of checking wiki link
    if (!node.href.includes("/wiki/")) {
      hideLink(node);
      disableLink(node);
      continue;
    }

    node.addEventListener("click", async (e) => {
      e.preventDefault();
      const target = e.target;
      if (!target) {
        return;
      }
      if (!(target instanceof HTMLAnchorElement)) {
        return;
      }

      if (target.classList.contains("link-hide")) {
        return;
      }

      const tokens = target.href.split("/");
      const pageTitle = tokens.pop();
      if (!pageTitle) {
        return;
      }
      callback(decodeURIComponent(pageTitle));
    });
  }
}

export async function applyRules(rules: Room["rules"]) {
  const atags = document.querySelectorAll("a");

  const countries = rules.excludeGroups.includes("countries");

  for (let node of atags) {
    if (countries) {
      wikipediaCountryPages.forEach((country) => {
        if (node.href.endsWith(`/wiki/${country}`)) {
          hideLink(node);
          disableLink(node);

          // add continue
        }
      });
    }
  }
}

const wikipediaCountryPages = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua_and_Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia_and_Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina_Faso",
  "Burundi",
  "Cabo_Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central_African_Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo,_Democratic_Republic_of_the",
  "Congo,_Republic_of_the",
  "Costa_Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech_Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican_Republic",
  "East_Timor",
  "Ecuador",
  "Egypt",
  "El_Salvador",
  "Equatorial_Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia_(country)",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea,_North",
  "Korea,_South",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall_Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New_Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North_Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua_New_Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint_Kitts_and_Nevis",
  "Saint_Lucia",
  "Saint_Vincent_and_the_Grenadines",
  "Samoa",
  "San_Marino",
  "Sao_Tome_and_Principe",
  "Saudi_Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra_Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon_Islands",
  "Somalia",
  "South_Africa",
  "South_Sudan",
  "Spain",
  "Sri_Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad_and_Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United_Arab_Emirates",
  "United_Kingdom",
  "United_States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican_City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

// const majorEventsUrls = [
//   "Battle_of_Thermopylae",
//   "Founding_of_Rome",
//   "Peloponnesian_War",
//   "Fall_of_Constantinople",
//   "Black_Death",
//   "Magna_Carta",
//   "Discovery_of_the_Americas",
//   "Protestant_Reformation",
//   "French_Revolution",
//   "American_Civil_War",
//   "Industrial_Revolution",
//   "Unification_of_Germany",
//   "World_War_I",
//   "World_War_II",
//   "Russian_Revolution",
//   "Great_Depression",
//   "Cold_War",
//   "Moon_landing",
//   "Fall_of_the_Berlin_Wall",
//   "September_11_attacks",
//   "COVID-19_pandemic",
//   "Assassination_of_Archduke_Franz_Ferdinand",
//   "Signing_of_the_Treaty_of_Versailles",
//   "Normandy_landings",
//   "Bombing_of_Hiroshima_and_Nagasaki",
//   "Cuban_Missile_Crisis",
//   "Watergate_scandal",
//   "Collapse_of_the_Soviet_Union",
//   "Arab_Spring",
//   "Boston_Tea_Party",
//   "Signing_of_the_Declaration_of_Independence",
//   "Storming_of_the_Bastille",
//   "Louisiana_Purchase",
//   "California_Gold_Rush",
//   "Emancipation_Proclamation",
//   "Assassination_of_Abraham_Lincoln",
//   "Battle_of_Gettysburg",
//   "Sinking_of_the_Titanic",
//   "Battle_of_Britain",
//   "D-Day",
//   "French_and_Indian_War",
//   "War_of_1812",
//   "Mexican%E2%80%93American_War",
//   "Battle_of_the_Alamo",
//   "Trail_of_Tears",
//   "Seneca_Falls_Convention",
//   "Women%27s_suffrage",
//   "Russian_Revolution_of_1917",
//   "Spanish_Civil_War",
//   "Korean_War",
//   "Vietnam_War",
//   "Civil_rights_movement",
//   "Fall_of_Saigon",
//   "Iranian_Revolution",
//   "Iran%E2%80%93Iraq_War",
//   "First_Gulf_War",
//   "Second_Gulf_War",
//   "Great_Chicago_Fire",
//   "San_Francisco_earthquake_of_1906",
//   "Spanish_flu",
//   "Hurricane_Katrina",
//   "Assassination_of_John_F._Kennedy",
//   "Assassination_of_Martin_Luther_King_Jr.",
//   "Stonewall_riots",
//   "Marbury_v._Madison",
//   "Brown_v._Board_of_Education",
//   "Roe_v._Wade",
//   "Manhattan_Project",
//   "Space_Race",
//   "Apollo_11",
//   "First_Continental_Congress",
//   "Second_Continental_Congress",
//   "Lewis_and_Clark_Expedition",
//   "Haitian_Revolution",
//   "Indian_Rebellion_of_1857",
//   "Boxer_Rebellion",
//   "Russo-Japanese_War",
//   "Battle_of_Waterloo",
//   "Opium_Wars",
//   "Scramble_for_Africa",
//   "Berlin_Conference",
//   "Meiji_Restoration",
//   "Spanish%E2%80%93American_War",
//   "Chinese_Civil_War",
//   "Mexican_Revolution",
//   "Independence_of_Brazil",
//   "Canadian_Confederation",
//   "World_War_I_casualties",
//   "World_War_II_casualties",
//   "Battle_of_Stalingrad",
//   "Battle_of_Midway",
//   "Pearl_Harbor_attack",
//   "Guadalcanal_Campaign",
//   "Yalta_Conference",
//   "Operation_Barbarossa",
//   "Nuremberg_trials",
//   "Holocaust",
//   "Siege_of_Leningrad",
//   "Invasion_of_Poland",
//   "Partition_of_India",
//   "Creation_of_Israel",
//   "Suez_Crisis",
//   "Algerian_War",
// ];
