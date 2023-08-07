const mobileToggle = document.querySelector("#title i");
const defaultToggle = document.querySelector("#container-toggler");
const sendBtn = document.querySelector("#send-btn");
const input = document.querySelector("#input-box textarea");
const chatBox = document.querySelector("#chat-box");
const inputInitSize = input.scrollHeight;

const toggleContainer = (e) => {
  document.body.classList.toggle("show-container");
};

const sendMessage = async (inputValue, lastBotThinking) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const API_KEY = "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";
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: inputValue }],
    }),
  };

  fetch(API_URL, requestOptions)
    .then((response) => response.json())
    .then((response) => {
      lastBotThinking.innerText = response.choices[0].message.content;
    })
    .catch((error) => {
      console.log(error);
      lastBotThinking.classList.add("error");
      lastBotThinking.innerText =
        "Oops! Algo deu errado. Favor tente novamente";
    })
    .finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
};

const createMessage = (inputValue, type) => {
  const message = document.createElement("li");
  message.classList.add("message", type);

  if (type === "bot") {
    const botIcon = `<i class="material-symbols-outlined">smart_toy</i>`;
    message.innerHTML = botIcon;
  }

  message.innerHTML += `<p></p>`;
  message.querySelector("p").textContent = inputValue;
  chatBox.appendChild(message);
};

const enterMessage = (e) => {
  const inputValue = input.value.trim();
  // Se o input for vazio, retornar
  if (!inputValue) return;

  input.value = "";
  createMessage(inputValue, "user");
  chatBox.scrollTo(0, chatBox.scrollHeight);

  setTimeout(() => {
    createMessage("Digitando...", "bot");
    const lastBotThinking = document.querySelector(".bot.message:last-child p");
    chatBox.scrollTo(0, chatBox.scrollHeight);
    sendMessage(inputValue, lastBotThinking);
  }, 600);
};

input.addEventListener("input", () => {
  input.style.height = `${inputInitSize}px`;
  input.style.height = `${input.scrollHeight}px`;
});

sendBtn.addEventListener("click", enterMessage);
mobileToggle.addEventListener("click", toggleContainer);
defaultToggle.addEventListener("click", toggleContainer);
