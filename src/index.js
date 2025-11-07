// src/index.js
import { Impit } from "impit";

const gradientAIOptionsDefault = {
	model: "Qwen3 235B", // or GPT OSS 120B
	clusterMode: "hybrid",
	enableThinking: false // or true
};

const impitOptionsDefault = {
	browser: "chrome" // or firefox
};

const gradientAI = async (messageSender, gradientAIOptions, impitOptions) => {
	gradientAIOptions = gradientAIOptions || gradientAIOptionsDefault;
	impitOptions = impitOptions || impitOptionsDefault;

	const impit = new Impit({
		timeout: 9999999,
		...impitOption
	});

	const response = await impit.fetch(
		"https://chat.gradient.network/api/generate",
		{
			method: "POST",
			body: JSON.stringify({
				messages: [{ role: "user", content: messageSender }],
				stream: true,
				...gradientAIOptions
			})
		}
	);

	if (!response.body) throw new Error("Response stream not available");

	const reader = response.body.getReader();
	const decoder = new TextDecoder();

	let buffer = "";
	let fullContent = "";

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		buffer += decoder.decode(value, { stream: true });

		const lines = buffer.split("\n");
		buffer = lines.pop();

		for (const line of lines) {
			const clean = line.trim();
			if (!clean) continue;

			try {
				const data = JSON.parse(clean);
				if (data.type === "reply") {
					fullContent += data.data?.content || "";
				}
			} catch (r) {
				console.error(r);
			}
		}
	}

	return fullContent;
};

export default gradientAI;
