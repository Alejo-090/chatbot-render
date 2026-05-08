const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// ==========================
// RED SEMÁNTICA
// ==========================
const recomendaciones = {
  "vino tinto": "carne roja, quesos maduros y pasta",
  "vino blanco": "pescado, mariscos y ensaladas",
  "vino rosado": "pasta, pollo y aperitivos"
};

const recomendacionDelDia = [
  "Hoy te recomendamos un Cabernet Reserva, perfecto para una noche especial.",
  "Prueba hoy un Chardonnay Premium, ideal para acompañar mariscos.",
  "Nuestra recomendación del día es un vino rosado, fresco y afrutado."
];

const perfilesRecomendados = {
  "ácido y fresco": "vino blanco",
  "tánico y robusto": "vino tinto",
  "afrutado y suave": "vino rosado"
};
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


const imagenesVino = {
  "vino tinto":   "https://images.vivino.com/thumbs/ApnIiXjcT5Kc33OHgNb9dA_pb_x600.png",
  "vino blanco":  "https://images.vivino.com/thumbs/aA4o41YFiHnbm48FMp4ikQ_pb_x600.png",
  "vino rosado":  "https://images.vivino.com/thumbs/u7TBDKFo6KHJN_BNBgUXOw_pb_x600.png"
};

const linksVino = {
  "vino tinto":  "https://www.vivino.com/explore?e=eJwFwUEKgCAQAMCv7LkH6C_aS0iiRa0ou2HQx3f3BjMDAAAAAA==",
  "vino blanco": "https://www.vivino.com/explore?e=eJwFwTEKgDAMBdCrZO4B9CP2IoVoWQ0apBiK8e5u78EAAAAAAAAg",
  "vino rosado": "https://www.vivino.com/explore?e=eJwFwTEOgCAMBdCrNHcP4Ec0RgotJUGBkBiP727fAwAAAAAAAAA="
};


// HELPER: Construir Rich Response


function buildRichResponse(text, tipo) {
  const img = imagenesVino[tipo];
  const link = linksVino[tipo];

  // Si no hay imagen/link, solo texto
  if (!img || !link) {
    return { fulfillmentText: text };
  }

  return {
    fulfillmentText: text,
    fulfillmentMessages: [
      // 1. Texto principal
      {
        text: { text: [text] }
      },
      // 2. Card con imagen y botón
      {
        card: {
          title: tipo.charAt(0).toUpperCase() + tipo.slice(1),
          subtitle: text,
          imageUri: img,
          buttons: [
            {
              text: "Ver más vinos 🍷",
              postback: link
            }
          ]
        }
      }
    ]
  };
}


// WEBHOOK


app.post('/webhook', (req, res) => {

  const intentName = req.body.queryResult.intent.displayName;

  const params = req.body.queryResult.parameters;

  let responseText = "No entendí la consulta.";

  
  // CONSULTAR MARIDAJE
 

  if (intentName === "Consultar_maridaje") {

    const comida = params.comida.toLowerCase();

    const vino = maridajes[comida];

    if (vino) {
      responseText = `El mejor vino para ${comida} es ${vino}.`;
    } else {
      responseText = `No tengo recomendaciones para ${comida}.`;
    }
  }

  // CONSULTAR PERFIL
 

  else if (intentName === "Consultar_perfil") {

    const tipo = params.tipo_vino.toLowerCase();

    const perfil = perfiles[tipo];

    if (perfil) {
      responseText = `El ${tipo} tiene un perfil ${perfil}.`;
    } else {
      responseText = `No encontré el perfil de ${tipo}.`;
    }
  }

 
  // CONSULTAR TIPO DE VINO
 

  else if (intentName === "Consultar_tipo") {

    const vino = params.vino.toLowerCase();

    const tipo = tiposVino[vino];

    if (tipo) {
      responseText = `${vino} pertenece a la categoría ${tipo}.`;
    } else {
      responseText = `No encontré información sobre ${vino}.`;
    }
  }

  
  // CONSULTAR UVA
 

  else if (intentName === "Consultar_Uva") {

    const vino = params.vino.toLowerCase();

    const uva = uvas[vino];

    if (uva) {
      responseText = `${vino} está elaborado con uva ${uva}.`;
    } else {
      responseText = `No encontré información sobre la uva de ${vino}.`;
    }
  }

 
  // CONSULTAR BODEGA


  else if (intentName === "Consultar_bodega") {

    const vino = params.vino.toLowerCase();

    const bodega = bodegas[vino];

    if (bodega) {
      responseText = `${vino} es producido por ${bodega}.`;
    } else {
      responseText = `No encontré información sobre la bodega de ${vino}.`;
    }
  }





else if (intentName === "Recomendacion_Comida") {

  const vino = params.vino.toLowerCase();

  const recomendacion = recomendaciones[vino];

  if (recomendacion) {
    responseText = `El ${vino} combina muy bien con ${recomendacion}.`;
  } else {
    responseText = `No tengo recomendaciones para ${vino}.`;
  }
}

else if (intentName === "Recomendacion_Deldia") {

  const random =
    recomendacionDelDia[
      Math.floor(Math.random() * recomendacionDelDia.length)
    ];

  responseText = random;
}

else if (intentName === "Recomendacion_perfil") {

  const perfil = params.perfil_gusto.toLowerCase();

  const vino = perfilesRecomendados[perfil];

  if (vino) {
    responseText = `Te recomiendo un ${vino} porque tiene un perfil ${perfil}.`;
  } else {
    responseText = `No encontré recomendaciones para el perfil ${perfil}.`;
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