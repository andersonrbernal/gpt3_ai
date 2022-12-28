import bot from '/public/assets/bot.svg';
import user from '/public/assets/user.svg';

export function loader(element: Element): number {
    element.textContent = '';

    return setInterval(() => {
        element.textContent += '.';

        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

export function typeText(element: Element, text: string): void {
    let index: number = 1;
    let interval: number;
    'uma função';
    

    interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20);
}

export function generateUniqueId(): string {
    const timestamp = Date.now();;
    const randomNumber: number = Math.random(); 
    const hexaDecimal: string = randomNumber.toString(16);

    return `id-${timestamp}-${hexaDecimal}`;
}

type ChatStripe = { 
    isAiSpeaking: boolean, 
    value: FormDataEntryValue, 
    uniqueID: string,

};

export function chatStripe(obj: ChatStripe): string {


    return (
        `
        <div class="wrapper ${obj.isAiSpeaking && 'ai'}">
            <div class="chat">

                <div class="profile">
                    <img 
                        src="${obj.isAiSpeaking ? bot : user}"  
                        alt="${obj.isAiSpeaking ? 'bot' : 'user'}"
                    />
                </div>

                <div class="message" id=${obj.uniqueID}>
                    ${obj.value}
                </div>
            </div>
        </div>
        `
    );
}

export async function handleSubmit(e: SubmitEvent, form: HTMLFormElement, chatContainer: HTMLElement): Promise<void> {
    e.preventDefault();

    const data: FormData = new FormData(form);

    // user's chatstripe
    const userArgs: ChatStripe = {
        isAiSpeaking: false,
        value: data.get('prompt') as FormDataEntryValue,
        uniqueID: generateUniqueId()
    }

    chatContainer.innerHTML += chatStripe(userArgs);
    form.reset();

    // bot's chatstripe
    const uniqueID = generateUniqueId();
    const botArgs: ChatStripe = {
        isAiSpeaking: true,
        value: ' ',
        uniqueID: uniqueID
    }

    chatContainer.innerHTML += chatStripe(botArgs);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueID) as HTMLElement;
    loader(messageDiv);
}