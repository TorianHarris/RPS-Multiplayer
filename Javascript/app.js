// Initialize Firebase
let config = {
    apiKey: "AIzaSyCg5_dTcBwqFe48vGQBt6CPIggXYvltWXc",
    authDomain: "rps-online-52e02.firebaseapp.com",
    databaseURL: "https://rps-online-52e02.firebaseio.com",
    projectId: "rps-online-52e02",
    storageBucket: "",
    messagingSenderId: "294126086039"
};

firebase.initializeApp(config);

let database = firebase.database();

var connectionsRef = database.ref("/connections");
var roomRef = database.ref("/rooms");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
let connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
//console.log(connectionsRef.numChildren());
connectedRef.on("value", function (snap) {

    // If they are connected..
    if (snap.val()) {
        // Add user to the connections list.
        var con = connectionsRef.push(true);

        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
    }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function (snapshot) {

    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
    $("#watchers").text(snapshot.numChildren());
    if (snapshot.numChildren() < 3)
        $("#status").html("Connected").addClass("text-success").removeClass("text-danger");
});

let name = prompt("Enter Name")

$("#new-room").on("click", function () {
    let room = roomRef.push(name);
});