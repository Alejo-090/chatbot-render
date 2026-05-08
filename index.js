const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// ==========================
// RED SEMÁNTICA
// ==========================

const maridajes = {
  "pescado": "vino blanco",
  "mariscos": "vino blanco",
  "carne roja": "vino tinto",
  "pasta": "vino rosado"
};

const perfiles = {
  "vino blanco": "ácido y fresco",
  "vino tinto": "tánico y robusto",
  "vino rosado": "afrutado y suave"
};

const tiposVino = {
  "cabernet reserva": "vino tinto",
  "chardonnay premium": "vino blanco"
};

const uvas = {
  "cabernet reserva": "cabernet sauvignon",
  "chardonnay premium": "chardonnay"
};

const bodegas = {
  "cabernet reserva": "Bodega Andes",
  "chardonnay premium": "Casa Grajales"
};

// ==========================
// WEBHOOK
// ==========================

app.post('/webhook', (req, res) => {

  const intentName = req.body.queryResult.intent.displayName;

  const params = req.body.queryResult.parameters;

  let responseText = "No entendí la consulta.";

  // ==========================
  // CONSULTAR MARIDAJE
  // ==========================

  if (intentName === "Consultar_maridaje") {

    const comida = params.comida.toLowerCase();

    const vino = maridajes[comida];

    if (vino) {
      responseText = `El mejor vino para ${comida} es ${vino}.`;
    } else {
      responseText = `No tengo recomendaciones para ${comida}.`;
    }
  }

  // ==========================
  // CONSULTAR PERFIL
  // ==========================

  else if (intentName === "Consultar_perfil") {

    const tipo = params.tipo_vino.toLowerCase();

    const perfil = perfiles[tipo];

    if (perfil) {
      responseText = `El ${tipo} tiene un perfil ${perfil}.`;
    } else {
      responseText = `No encontré el perfil de ${tipo}.`;
    }
  }

  // ==========================
  // CONSULTAR TIPO DE VINO
  // ==========================

  else if (intentName === "Consultar_tipo") {

    const vino = params.vino.toLowerCase();

    const tipo = tiposVino[vino];

    if (tipo) {
      responseText = `${vino} pertenece a la categoría ${tipo}.`;
    } else {
      responseText = `No encontré información sobre ${vino}.`;
    }
  }

  // ==========================
  // CONSULTAR UVA
  // ==========================

  else if (intentName === "Consultar_Uva") {

    const vino = params.vino.toLowerCase();

    const uva = uvas[vino];

    if (uva) {
      responseText = `${vino} está elaborado con uva ${uva}.`;
    } else {
      responseText = `No encontré información sobre la uva de ${vino}.`;
    }
  }

  // ==========================
  // CONSULTAR BODEGA
  // ==========================

  else if (intentName === "Consultar_bodega") {

    const vino = params.vino.toLowerCase();

    const bodega = bodegas[vino];

    if (bodega) {
      responseText = `${vino} es producido por ${bodega}.`;
    } else {
      responseText = `No encontré información sobre la bodega de ${vino}.`;
    }
  }

  // ==========================
  // RESPUESTA FINAL
  // ==========================

  res.json({
    fulfillmentText: responseText
  });

});

// ==========================
// SERVIDOR
// ==========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});