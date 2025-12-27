import { NextResponse } from 'next/server';

// Mock Mock "Knowledge Base" logic moved to server
// In a real app, this would use OpenAI/Gemini API to query a Vector DB
function generateResponse(query: string) {
    const lower = query.toLowerCase();

    // "Out of Scope" detection (Requirement 1)
    const isEconomics = [
        "economics", "economy", "scarcity", "choice", "cost", "market",
        "money", "trade", "price", "supply", "demand", "micro", "macro",
        "production", "labor", "capital"
    ].some(keyword => lower.includes(keyword));

    // Allow greeting
    if (lower.match(/\b(hi|hello|hey)\b/)) {
        return "Hello! I am your Economics AI tutor. Ask me anything about Chapter 1.";
    }

    if (!isEconomics) {
        return "I'm sorry, but that question seems outside the scope of Chapter 1: Introduction to Economics. Please ask about Scarcity, Opportunity Cost, or the definition of Economics.";
    }

    // Specific Responses based on PDF content
    if (lower.includes("scarcity"))
        return "Based on the chapter, **Scarcity** is defined as the fundamental economic problem of having seemingly unlimited human wants in a world of limited resources. It forces us to make choices.";

    if (lower.includes("micro") || lower.includes("macro"))
        return "**Microeconomics** focuses on individual actors (consumers, firms) and specific markets, while **Macroeconomics** looks at the economy as a whole (GDP, inflation, unemployment).";

    if (lower.includes("opportunity") || lower.includes("cost"))
        return "**Opportunity Cost** is the value of the next best alternative you forego when making a choice. For example, the cost of studying right now is the movie you aren't watching.";

    if (lower.includes("supply") || lower.includes("demand"))
        return "**Supply and Demand** describes the relationship between sellers and buyers. The Law of Demand states that as price rises, quantity demanded usually falls.";

    if (lower.includes("factor") || lower.includes("production"))
        return "The four factors of production mentioned in the text are: **Land** (natural resources), **Labor** (human work), **Capital** (tools/machines), and **Entrepreneurship** (risk-taking/innovation).";

    return "That's a great question about the chapter. Economics is essentially about resource allocation under scarcity. Could you be more specific so I can quote the relevant section?";
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages } = body;
        const lastMessage = messages[messages.length - 1];

        if (!lastMessage) {
            return NextResponse.json({ error: "No message provided" }, { status: 400 });
        }

        // Simulate AI Latency
        await new Promise(resolve => setTimeout(resolve, 800));

        const responseText = generateResponse(lastMessage.text);

        return NextResponse.json({
            role: "teacher",
            text: responseText
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
