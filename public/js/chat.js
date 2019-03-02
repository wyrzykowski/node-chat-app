const socket = io();
//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('#sendButton');
const $locationButton = document.querySelector('#send-location');
var buildMessage = (sendMessage)=>{
    var p = document.createElement("p");
    p.innerHTML=sendMessage;
    var conversation = document.getElementById('conversation')
    conversation.appendChild(p);
    conversation.scrollTop = conversation.scrollHeight;
}


socket.on('helloMessage',(message)=> {
console.log(message);
    document.getElementById("welcomeText").innerHTML=message;
});
var messageText;
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();//prevent to page nto refreash after click
    //disable button send
    $messageFormButton.setAttribute('disabled','disabled'); //name, value
    const messageText = e.target.elements.message.value;
    socket.emit('sendMessage',messageText,(info)=>{
        //enable button
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value='';
        $messageFormInput.focus();
        console.log(info);
        buildMessage(`<i style="color:limegreen">${info}</i>`)
    })
    console.log('message sand!')
});




socket.on('sendMessage',(sendMessage)=>{
    console.log('wiadomosc',sendMessage);
    buildMessage(sendMessage);


});



$locationButton.addEventListener('click',()=>{
    //disable button
    $locationButton.setAttribute('disabled','disabled'); //name, value

    if(!navigator.geolocation) {
        return alert('Geolocation is not supported i your browser.')
        //enable button
        $locationButton.removeAttribute('disabled');
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        $locationButton.removeAttribute('disabled');
        socket.emit('position',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },(info)=>{
            console.log(info);
            buildMessage(`<i style="color:limegreen">${info}</i>`);

        });
    })

});





