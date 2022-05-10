let socket = new WebSocket("ws://localhost:8808/echo");

socket.onopen = () => {
    console.log("Connected to server");
}

socket.onmessage = (event) => {
    console.log("Server send " + event.data);
}


export function sendMessage(message) {
    const json = {message};
    console.log(json);
    socket.send();
}