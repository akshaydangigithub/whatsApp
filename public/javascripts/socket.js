axios.get("/dashboard").then(function (response) {

    var LoggedInUser = response.data.loggedInuser
    var sender_id = LoggedInUser._id;
    var receiver_id;

    var socket = io("/user-namespace", {
        auth: {
            token: LoggedInUser._id
        }
    });

    var userList = document.querySelectorAll(".chat-tile");
    userList.forEach((user) => {
        user.addEventListener("click", async () => {
            var userId = user.getAttribute('data-id')
            receiver_id = userId


            const response = await axios.get('/dashboard');
            const alluser = response.data.allUserWithoutLoggedInUser;
            alluser.forEach(function (user) {
                if (user._id === receiver_id) {
                    let onlineStatus = user.is_online == 1 ? "online" : "offline";

                    let clutter = `
                        <img src="/images/uploads/${user.Profile_photo}" alt="" class="avatar" id="profile-image">
                        <div id="active-chat-details">
                            <h4>${user.name} ${user.LastName}</h4>
                            <div class="info-${onlineStatus}">${onlineStatus}</div>
                        </div>
                        <img src="/images/icons/search.svg" alt="" class="icon">
                        <div class="dropdown">
                            <img src="/images/icons/menu.svg" alt="" class="icon dropdown-button">
                            <div class="dropdown-content contact-menu">
                                <a href="#">Contact info</a>
                                <a href="#">Select messages</a>
                                <a href="#">Close chat</a>
                                <a href="#">Mute notifications</a>
                                <a href="#">Disappearing messages</a>
                                <a href="#">Clear messages</a>
                                <a href="#">Delete chat</a>
                                <a href="#">Report</a>
                                <a href="#">Block</a>
                            </div>
                        </div>`;

                    document.querySelector("#chat-window-header").innerHTML = clutter;
                }
            });

            socket.emit("existsChat", { sender_id: sender_id, receiver_id: receiver_id })
        })
        document.querySelectorAll('.chat-tile').forEach(function (chat_tile) {
            chat_tile.addEventListener('click', function () {
                document.querySelector('.before-chat').style.display = "none"
            })
        })
    })


    // chat save of the user for one to one chat
    let chatForm = document.querySelector("#chat-form");
    chatForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // handle the form submission data using JavaScript
        var messageInput = document.querySelector("#compose-chat-box");
        let messageInputValue = messageInput.value;

        try {
            const formData = new FormData(chatForm);
            formData.append("sender_id", sender_id);
            formData.append("receiver_id", receiver_id);
            formData.append("message", messageInputValue);

            const formDataObj = Object.fromEntries(formData.entries());

            // console.log("Form Data:", formDataObj);

            const response = await axios.post("/saveChat", formDataObj);

            // console.log("Response:", response.data.data.message);

            let chat = response.data.data;

            let html = `<div class="current-message-group">
                            <div class="current-user-chat">
                                <div class="chat-message">
                                <div class="chat-message-sender">You</div>
                                   ${chat.message}
                                   
                                </div>
                            </div>
                           
                        </div>`


            document.querySelector(".allChatsContaines").innerHTML += html;

            response.data.data.sender_id = sender_id;
            response.data.data.receiver_id = receiver_id;
            socket.emit("newChat", response.data.data)

            messageInput.value = "";

            const chatContainer = document.querySelector("#chat-window-contents");
            chatContainer.scrollTop = chatContainer.scrollHeight;


        } catch (error) {
            console.error(error);
        }
    });


    //recieving the broadcast message for one to one chat
    socket.on("loadNewChat", function (data) {
        if (sender_id == data.receiver_id && receiver_id == data.sender_id) {
            let html = `<div class="distance-message-group" id="${data._id}">
                            <img src="https://picsum.photos/50" alt="" class="chat-message-avatar">
                            <div class="chat-messages">
                                <div class="chat-message">
                                    ${data.message}
                                    <span class="chat-message-time">${new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                </div>
                            </div>
                        </div>`
            document.querySelector(".allChatsContaines").innerHTML += html;
        }

        const chatContainer = document.querySelector("#chat-window-contents");
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });


    //load old chats for one to one chat
    socket.on("loadChats", function (data) {
        document.querySelector(".allChatsContaines").innerHTML = "";

        var chats = data.chats

        chats.forEach(function (chat) {
            let html = ""
            let addClass = "";
            let addClass2 = "";

            if (chat.sender_id == sender_id) {
                addClass = "current-user-chat"
                addClass2 = "current-message-group"
            }
            else {
                addClass = "chat-messages"
                addClass2 = "distance-message-group"
            }
            const senderText = chat.sender_id == sender_id ? 'You' : '';


            html = `<div class="${addClass2}" id="${chat._id}">
                        <div class="${addClass}">
                            <div class="chat-message">
                                <div class="chat-message-sender">${senderText}</div>
                                ${chat.message}
                                <span class="chat-message-time">${new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                            </div>
                        </div>
                    </div>`;

            document.querySelector(".allChatsContaines").innerHTML += html;

            const chatContainer = document.querySelector("#chat-window-contents");
            chatContainer.scrollTop = chatContainer.scrollHeight;

        })
    })
})