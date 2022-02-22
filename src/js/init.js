const prompt = require("prompt");
const axios = require("axios");
const XMLHttpRequest = require("xhr2");
const Graph = require("./graph");

const secretKey =
  "$2b$10$jxow4GADDMrolpxvMGbFcOqDcqkAYAykopUHA6Obtp9i8z0si6n3u";
const url = `https://api.jsonbin.io/b/`;

const endpoints = {
  df: `${url}62138f0aca70c44b6ea21400/latest`,
};

const options = {
  method: "GET",
  url: "https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/",
  params: { ip: "" },
  headers: {
    "x-rapidapi-host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
    "x-rapidapi-key": "aafddca794mshce78d6092dfdf9fp1c67acjsn1a08597abf8c",
  },
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

const requestGeolocation = async (publicIP) => {
  options.params.ip = publicIP;

  let result = await axios
    .request(options)
    .then((response) => response.data)
    .catch((error) => {
      console.error(error);
    });

  return { latitude: result.latitude, longitude: result.longitude };
};

const requestData = (uf) => {
  const states = Object.keys(endpoints);

  if (!states.includes(uf)) {
    console.log("Não temos dados para este estado!");
    return;
  }

  return new Promise((resolve, reject) => {
    const xml = new XMLHttpRequest();

    xml.responseType = "json";
    xml.onload = () => {
      if (xml.status === 200) resolve(xml.response);
      else reject("Erro interno!");
    };
    xml.open("GET", endpoints[uf]);
    xml.setRequestHeader("secret-key", secretKey);
    xml.send();
  });
};

const passDataToGraph = async (data, yourLatitude, yourLongitude) => {
  let g = new Graph();

  let yourNode = {
    LONGITUDE: yourLongitude,
    LATITUDE: yourLatitude,
    CNES: "9999999",
  };

  data.unshift(yourNode);

  const vertices = [];
  for (let i = 0; i < data.length; i++) {
    if (
      !isNaN(parseFloat(data[i]["LONGITUDE"])) &&
      !isNaN(parseFloat(data[i]["LATITUDE"]))
    ) {
      vertices.push(data[i]["CNES"]);
      g.addNode(vertices[i]);
    }
  }

  for (let j = 1; j < data.length; j++) {
    let distance = getDistanceFromLatLonInKm(
      parseFloat(data[0]["LATITUDE"]),
      parseFloat(data[0]["LONGITUDE"]),
      parseFloat(data[j]["LATITUDE"]),
      parseFloat(data[j]["LONGITUDE"])
    );
    if (distance != 0) g.addEdge(vertices[0], vertices[j], distance);
  }

  let ubsResultCodes = [];
  let ubsResultData = [];
  //Takes the ten first closest ubs to user location
  for (let z = 0; z < 10; z++)
    ubsResultCodes.push(g.primMST().adjacencyList["9999999"][z]["node"]);

  for (let k = 1; k < data.length; k++) {
    if (ubsResultCodes.includes(data[k]["CNES"]))
        ubsResultData.push(data[k]);
  }

  let radius = g.primMST().adjacencyList["9999999"][0]["weight"];

  console.log(`UBS MAIS PRÓXIMAS EM UM RAIO DE ${Math.round(radius)}KM`);

  console.log(ubsResultData);
};

const init = async () => {
  prompt.start();

  console.log("SEJA BEM-VINDO(A)!")
  console.log("INFORME O SEU ESTADO (APENAS SIGLA) E IP PÚBLICO (NÚMEROS E PONTUAÇÃO):");
  prompt.get(["state", "ip"], async function (err, result) {
    let location = await requestGeolocation(result.ip);

    requestData(result.state)
      .then(async (ubs_data) => {
        passDataToGraph(ubs_data, location.latitude, location.longitude);
      })
      .catch((onrejected) => console.log(onrejected));
    return;
  });
};

init();
