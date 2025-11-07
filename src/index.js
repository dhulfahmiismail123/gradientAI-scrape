// src/index.js
import { Impit } from "impit";
import { EventEmitter } from "events";

const ev = new EventEmitter();

const MODEL_PRESETS = {
	"GPT OSS 120B": {
		clusterMode: ["hybrid", "nvidia"],
		enableThinking: [false, true],
		stream: [false, true]
	},
	"Qwen3 235B": {
		clusterMode: ["hybrid"],
		enableThinking: [false, true],
		stream: [false, true]
	}
};

function assert(condition, message) {
	if (!condition) throw new Error(message);
}

function buildOptions(options = {}) {
	options.model ??= Object.keys(MODEL_PRESETS)[0];

	assert(
		MODEL_PRESETS[options.model],
		`Model "${options.model}" tidak dikenal. Pilihan: ${Object.keys(
			MODEL_PRESETS
		).join(", ")}`
	);

	const preset = MODEL_PRESETS[options.model];

	options.clusterMode ??= preset.clusterMode[0];
	assert(
		preset.clusterMode.includes(options.clusterMode),
		`clusterMode "${
			options.clusterMode
		}" tidak valid. Pilihan: ${preset.clusterMode.join(", ")}`
	);

	options.enableThinking ??= preset.enableThinking[0];
	assert(
		preset.enableThinking.includes(options.enableThinking),
		`enableThinking hanya boleh: ${preset.enableThinking.join(", ")}`
	);

	options.stream ??= preset.stream[0];
	assert(
		preset.stream.includes(options.stream),
		`stream hanya boleh: ${preset.stream.join(", ")}`
	);

	return options;
}

function buildMessages(messages) {
	if (!messages || typeof messages !== "object") {
		throw new TypeError(
			"Parameter `messages` harus berupa object dengan property `{ message, historyMessages }`."
		);
	}

	const { message, historyMessages = [] } = messages;

	if (typeof message !== "string") {
		throw new TypeError("`messages.message` harus berupa string.");
	}

	if (!Array.isArray(historyMessages)) {
		throw new TypeError("`messages.historyMessages` harus berupa array.");
	}

	messages = [...historyMessages, { role: "user", content: message }];

	return messages;
}

function buildBody(messages, options) {
	return JSON.stringify({
		model: options.model,
		clusterMode: options.clusterMode,
		messages,
		enableThinking: options.enableThinking
	});
}

async function ask(messages, options) {
	options = buildOptions(options);
	messages = buildMessages(messages);
	const body = buildBody(messages, options);

	const impit = new Impit({
		timeout: 9999999,
		browser: "chrome"
	});

	const response = await impit.fetch(
		"https://chat.gradient.network/api/generate",
		{
			method: "POST",
			body
		}
	);

	if (!response.ok) {
		ev.on("response", {
			success: false,
			status: "Request error",
			message: await response.text()
		});
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder();

	let buffer = "";
	let data = {
		role: "assistant"
	};

	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			if (options.stream)
				return ev.emit("response", { success: true, status: "done" });
			break;
		}
		buffer += decoder.decode(value, { stream: true });

		const lines = buffer.split("\n");
		buffer = lines.pop();

		for (const line of lines) {
			const clean = line.trim();
			if (!clean) continue;

			try {
				const resData = JSON.parse(clean);
				// console.log(resData);
				if (resData.type === "reply") {
					if (options.stream) {
						ev.emit("response", resData.data);
					} else if (resData.data.reasoningContent) {
						data.reasoningContent ??= "";
						data.reasoningContent += resData.data.reasoningContent;
					} else if (resData.data.content) {
						data.content ??= "";
						data.content += resData.data.content;
					}
				}
			} catch (e) {
				ev.emit("response", {
					success: false,
					status: "Code error",
					message: e.message
				});
			}
		}
	}

	messages.push(data);
	ev.emit("response", {
		success: true,
		message: data.content,
		messages
	});
}

export default {
	ask,
	ev
};
