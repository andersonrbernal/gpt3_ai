import bot from '/assets/bot.svg'
import user from '/assets/user.svg'

interface Chat {
    form: HTMLFormElement;
    chatContainer: HTMLElement;
}

class Chat implements Chat {
    /**
     * Gets a form HTML element and creates 
     */
    private loadInterval: number = 0;

    constructor(form: HTMLFormElement, chatContainer: HTMLElement) {
        this.form = form;
        this.chatContainer = chatContainer;
    }

    private loader(element: HTMLElement): void {
        /**
         * Animates loading text with three dots on the given HTML element.
         */
        element.textContent = '' as string

        this.loadInterval = setInterval(() => {
            // Update the text content of the loading indicator
            element.textContent += '.';

            // If the loading indicator has reached three dots, reset it
            if (element.textContent === '....') {
                element.textContent = '';
            }
        }, 300);
    }

    private typeText(element: Element, text: string): void {
        /**
         * Types every character on the screen one by one
         */
        let index = 0
        const indexIsGreaterThanTextLength: boolean = index < text.length;

        let interval = setInterval(() => {

            if (indexIsGreaterThanTextLength) {
                element.innerHTML += text.charAt(index)
                index++
            } else {
                clearInterval(interval)
            }

        }, 20)
    }

    private generateUniqueId(): string {
        /**
         * Generates a unique ID for a div element. The ID contains a timestamp and a random number that are concatenated together.
         */
        const timestamp: number = Date.now();
        const randomNumber: number = Math.random();
        const hexadecimalString: string = randomNumber.toString(16);

        return `id-${timestamp}-${hexadecimalString}`;
    }

    private chatStripe(
        isAiSpeaking: boolean, value: FormDataEntryValue, uniqueId: string = ''
    ): string {
        /**
         * Creates a div element that contains a message. This element has a stripe style, so that every message can be distinguished by its background color.
         */

        return (`
        <div class="wrapper ${isAiSpeaking && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAiSpeaking ? bot : user} 
                      alt="${isAiSpeaking ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
        `)
    }

    handleSubmit = async (e: Event) => {
        /**
         * The user submits the message to the bot, the bot gives a response, and all of that is written on the screen.
         */
        e.preventDefault()

        const data = new FormData(this.form)

        this.chatContainer.innerHTML += this.chatStripe(false, data.get('prompt')!)

        this.form.reset()

        const uniqueId = this.generateUniqueId()
        this.chatContainer.innerHTML += this.chatStripe(true, " ", uniqueId)

        // scrolls the chat to the bottom when a new message shows up
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;

        const messageDiv = document.getElementById(uniqueId) as HTMLDivElement
        this.loader(messageDiv)

        const opt: {} = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: data.get('prompt')
            })
        }

        const response = await fetch('http://localhost:5000/', opt);

        clearInterval(this.loadInterval); // clears the loading message
        messageDiv.innerHTML = " "

        if (response.ok) {
            const data = await response.json();
            const parsedData = data.bot.trim()

            this.typeText(messageDiv, parsedData)
        } else {
            const err = await response.text()

            messageDiv.innerHTML = "Something went wrong"
            console.log(err);
        }
    }
}

export default Chat;