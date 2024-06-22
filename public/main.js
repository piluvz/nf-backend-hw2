const socket = io()

const clientsTotal = document.getElementById('clients-total')

const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')


messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()

})

socket.on('client-total', (data) => {
    clientsTotal.innerText = `Total clients connected: ${data}`
}) 

function sendMessage() {
    // console.log(messageInput.value)
    if(messageInput.value === '') return
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }
    socket.emit('message', data)
    addMessageToUI(true, data )
    messageInput.value = ''

}

socket.on('chat-message', (data) => {
    // console.log(data)
    addMessageToUI(false, data)
})

function addMessageToUI(isOwnMessage, data){
    let dateTimeText;
    try {
        dateTimeText = moment(data.dateTime).fromNow();
    } catch (error) {
        console.error('Error parsing date:', error);
        dateTimeText = new Date(data.dateTime).toLocaleString();
    }

    clearFeedback()
    const element = `
        <li class="${isOwnMessage ? "message-right" : "message-left"}">
            <p class="message">${data.message}</p>
            <span>${data.name}. ${dateTimeText}</span>
        </li>
        `

    messageContainer.innerHTML += element;
    scrollToBottom();
}

function scrollToBottom(){
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message...`
    })
})

messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message...`
    })
})
messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: '',
    })
})

socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
            <li class="message-feedback">
                <p class="feedback" id="feedback">${data.feedback}</p>
            </li>
    `
    messageContainer.innerHTML += element;
})

function clearFeedback(){   
    document.querySelectorAll('li.message-feedback').forEach(e => {
        e.parentNode.removeChild(e)
    })
}