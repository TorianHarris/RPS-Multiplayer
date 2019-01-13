// Initialize Firebase
let config = {
    apiKey: apiKey,
    authDomain: "rps-online-52e02.firebaseapp.com",
    databaseURL: "https://rps-online-52e02.firebaseio.com",
    projectId: "rps-online-52e02",
    storageBucket: "",
    messagingSenderId: "294126086039"
};

firebase.initializeApp(config);
let database = firebase.database();

let createdRoom = false;
let name = prompt("Enter Name");
let roomRef = database.ref("/rooms");
//var connectionsRef = database.ref("/connections");
//new thing
// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
 let connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
//console.log(connectionsRef.numChildren());
// connectedRef.on("value", function (snap) {
//     //$("#join-room").append($("<button>").text(snap.key));
//     // If they are connected..
//     if (snap.val()) {
//         // Add user to the connections list.
//         var con = connectionsRef.push(true);

//         // Remove user from the connection list when they disconnect.
//         con.onDisconnect().remove();
//     }
// });

roomRef.on("child_added", function (snapshot) {
    $("#join-room").append($("<button>").text(snapshot.key).attr("room-id", snapshot.key));
});

roomRef.on("child_removed", function (snapshot) {
    $(`[room-id="${snapshot.key}"]`).remove();
});

// When first loaded or when the connections list changes...
// connectionsRef.on("value", function (snapshot) {

//     // Display the viewer count in the html.
//     // The number of online users is the number of children in the connections list.
//     $("#watchers").text(snapshot.numChildren());
//     $("#status").html("Connected").addClass("text-success").removeClass("text-danger");
// });

$("#new-room").on("click", function () {
    if(!createdRoom)
    {
        createdRoom = true;
        $("#status").html("Created room");
        let room = roomRef.push();
        room.push({
            userName: name
        });
        room.onDisconnect().remove(function (err) {
            if(err) {
                console.log("error")
            }
            else {
                console.log("do stuff");
            }
        });
    };
});

$("#join-room").on("click", "button", function () {
    let roomID = $(this).attr("room-id");
    let room = roomRef.child(roomID);
    $("#status").html("Joined room " + roomID);
    room.once("value", function (snapshot) {
        if (snapshot.numChildren() < 2)
        {
            let user = room.push({
                username: name
            });
            user.onDisconnect().remove();
        }
        else
            alert("this room is full");
    });
});