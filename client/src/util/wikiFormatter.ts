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
