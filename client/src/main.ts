import Chat from "./Chat"

const form = document.querySelector('form') as HTMLFormElement
const chatContainer = document.querySelector('#chat_container') as HTMLDivElement

const chat: Chat = new Chat(form, chatContainer);

form.addEventListener('submit', (e: Event) => chat.handleSubmit(e))
form.addEventListener('keypress', (e) => {
    if (e.key === "Enter") chat.handleSubmit(e);
});
