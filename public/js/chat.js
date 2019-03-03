const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options - uzywam tej bibliotekiz  pliku html
const {username,room}= Qs.parse(location.search,{ignoreQueryPrefix:true}) //parse that whast is adress in browser, ingoreQuearyPerefx remove ?
const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)


    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight+5; //HAVE TO ADD SOMETHING beciuse somewhere is some margin or smth
    console.log( 'to', containerHeight - newMessageHeight )
    console.log( 'to2', scrollOffset )

    if (containerHeight - newMessageHeight <= scrollOffset) {
    }
}
//Listen for message
socket.on('message', (message) => {

    const html = Mustache.render(messageTemplate, {
        message:message.text,
        createdAt: moment(message.createdAt).format('HH:MM:ss'),
        username:message.username

    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll();
})

//Listen for LocationMessage
socket.on('locationMessage',( locationMessage)=>{
    const html = Mustache.render(locationMessageTemplate, {
        locationMessage:locationMessage.url,
        createdAt: moment(locationMessage.createdAt).format('HH:MM:ss'),
        username:locationMessage.username
    })
    console.log(html)
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll();
})

socket.on('roomData',({room,users})=>{

    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})
socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }

})