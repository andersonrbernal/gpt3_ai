import { handleSubmit } from './functions';

const form = document.querySelector('#form') as HTMLFormElement;
const chatContainer = document.querySelector('#chat_container') as HTMLDivElement;

form.addEventListener('submit', (e) => handleSubmit(e, form, chatContainer));
form.addEventListener('keyup', (e: any) => {
    if (e.key === 'Enter') {
        handleSubmit(e, form, chatContainer)
    }
});