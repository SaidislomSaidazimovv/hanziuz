const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `Sen xitoy tili o'qituvchisisan. Sening ismingiz "HanziUz AI Repetitor".

MUHIM QOIDALAR:
1. DOIMO o'zbek tilida javob ber. Hech qachon ingliz tilida javob berma.
2. Foydalanuvchi xitoy tilini o'rganmoqda. Unga sabr bilan yordam ber.
3. Xatolarni muloyimlik bilan tuzat va NIMA UCHUN xato ekanligini tushuntir.
4. Har bir xitoycha so'z yoki iborani yozganda, pinyinni ham qo'sh.
5. Grammatika qoidalarini oddiy va tushunarli qilib tushuntir.
6. Misollar ko'p keltir — har bir tushuntirishda kamida 2-3 ta misol bo'lsin.
7. Foydalanuvchining darajasiga moslashtir:
   - Boshlang'ich (HSK 1-2): oddiy so'zlar, qisqa jumlalar
   - O'rta (HSK 3-4): murakkabroq grammatika, uzoqroq jumlalar
   - Yuqori (HSK 5-6): idiomalar, ilg'or grammatika

JAVOB FORMATI:
- Xitoycha matnni **qalin** qilib yoz
- Pinyinni kursiv qilib yoz
- Tarjimani oddiy yoz
- Misol: **你好** (*nǐ hǎo*) — Salom

Foydalanuvchiga xitoy tilini o'rganishda yordam ber, savollarga javob ber, va mashqlar taklif qil.`;

export async function POST(request: Request) {
  try {
    const { messages, hskLevel } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Xabarlar majburiy" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GROQ_API_KEY sozlanmagan. .env.local faylida API kalitini kiriting." },
        { status: 500 }
      );
    }

    const levelContext =
      hskLevel && hskLevel <= 2
        ? "\n\nFoydalanuvchi boshlang'ich darajada (HSK 1-2). Juda oddiy so'zlar va qisqa jumlalar ishlat."
        : hskLevel && hskLevel <= 4
          ? "\n\nFoydalanuvchi o'rta darajada (HSK 3-4). Murakkabroq grammatikadan foydalanishing mumkin."
          : "";

    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT + levelContext },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: apiMessages,
        max_tokens: 1024,
        stream: true,
      }),
    });

    if (!groqRes.ok) {
      const errBody = await groqRes.text().catch(() => "");
      console.error("Groq API error:", groqRes.status, errBody);
      return Response.json(
        { error: `AI xizmati xatosi: ${groqRes.status}` },
        { status: 502 }
      );
    }

    if (!groqRes.body) {
      return Response.json(
        { error: "Stream mavjud emas" },
        { status: 502 }
      );
    }

    // Transform Groq's OpenAI-format SSE into our simpler format
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const readable = new ReadableStream({
      async start(controller) {
        const reader = groqRes.body!.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            while (buffer.includes("\n")) {
              const newlineIdx = buffer.indexOf("\n");
              const line = buffer.slice(0, newlineIdx).trim();
              buffer = buffer.slice(newlineIdx + 1);

              if (!line || !line.startsWith("data: ")) continue;
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const text = parsed.choices?.[0]?.delta?.content;
                if (text) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                  );
                }
              } catch {
                // Skip malformed chunks
              }
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          console.error("Stream processing error:", err);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "Stream xatosi" })}\n\n`)
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("AI Tutor error:", err);
    return Response.json(
      { error: "Serverda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
