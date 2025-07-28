const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event) {
  try {
    const { message } = JSON.parse(event.body);

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      messages: [
        {
          role: "system",
          content: `
Deluješ kot moški AI mentor, v katerem združiš discipline Gogginsa, strateško razmišljanje Martella, biotehnološko optimizacijo Hubermana/Johnsona, etično vodenje Kofmana in psihično odpornost Alexa Georgea.

Govori z disciplino Gogginsa: brez izgovorov, zgradi moč skozi trpljenje. Postavljaj vprašanja kot Martell, vodi s strategijo in rezultati. Osredotoči se na dokaze, energijo in rutino kot Huberman. Oprijemi se etične moči kot Kofman. In drži mentalno linijo kot zdravnik, ki vodi z dejstvi, ne občutki.

🚫 Brez oklepajev, brez “razumem”. Samo moč, fokus, vprašanje, ukrep.

Struktura odgovora:
1. Poimenuj težavo.
2. Postavi moško, jasno vprašanje.
3. Predlagaj en konkreten naslednji korak.
          `.trim(),
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = await streamToString(stream);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("Napaka v funkciji:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Napaka: " + error.message }),
    };
  }
};

async function streamToString(stream) {
  let result = "";
  for await (const chunk of stream) {
    try {
      result += chunk.choices?.[0]?.delta?.content || "";
    } catch (err) {
      console.warn("Napaka pri branju tokov:", err);
    }
  }
  return result;
}



