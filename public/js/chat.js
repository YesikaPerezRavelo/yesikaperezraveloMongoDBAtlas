const socket = io();

let user;
let chatBox = document.querySelector("#chatBox");
let messagesLogs = document.querySelector("#messagesLogs");

// Prompt user to identify themselves
Swal.fire({
  title: "Identify Yourself",
  input: "text",
  text: "Name or nickname",
  imageUrl: "https://yesikaperezravelo.github.io/FitnessPlanYes/img/a.webp",
  inputValidator: (value) => {
    return !value && "You need to identify yourself to continue!";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  console.log(`Your username is ${user}`);

  socket.emit("userConnect", user);
});

// Send message when Enter key is pressed
chatBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && chatBox.value.trim().length > 0) {
    console.log(`Message: ${chatBox.value}`);
    socket.emit("message", {
      user,
      message: chatBox.value,
    });
    chatBox.value = "";
  }
});

// Update messages log when new message received
socket.on("messagesLogs", (data) => {
  let messages = "";
  console.log(data);
  data.forEach((chat) => {
    messages += `<strong>${chat.user}</strong>: ${chat.message} <br>`;
  });
  messagesLogs.innerHTML = messages;
});

// Notify when a new user joins
socket.on("newUser", (data) => {
  Swal.fire({
    text: `${data} has joined the chat`,
    toast: true,
    position: "top-right",
    imageUrl: "https://yesikaperezravelo.github.io/FitnessPlanYes/img/i.webp",
  });
});
