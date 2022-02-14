const express = require("express");
const app = express();
const port = 3001;

const fs = require("fs");
const yaml = require("js-yaml");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.get("/:hora", async (req, res) => {
  let hora = req.params.hora;  
  try {
    let fileContents = fs.readFileSync("./data.yml", "utf8");
    let data = yaml.load(fileContents);

    function buscarTemperatura(hora) {
      return new Promise((resolve, reject) => {
        let resultado = null;

        for (let i = 0; i < data.temperature.values.length; i++) {
          if (data.temperature.values[i].time === hora) {
            resultado = data.temperature.values[i];
            break;
          }
        }
        resolve(resultado);
      });
    }

    function buscarPotencia(hora) {
      return new Promise((resolve, reject) => {
        let resultado = null;

        for (let i = 0; i < data.power.values.length; i++) {
          if (data.power.values[i].time === hora) {
            resultado = data.power.values[i];
            break;
          }
        }
        resolve(resultado);
      });
    }
    let resultadoTemperatura = await buscarTemperatura(hora);
    let resultadoPotencia = await buscarPotencia(hora);

    res.status(200).json({
      temperatura: resultadoTemperatura,
      potencia: resultadoPotencia,
    });     
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
