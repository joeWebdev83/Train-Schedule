//Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyDNFBRrT2vmNUN0jMNeCKgjdd3-w05M67g",
  authDomain: "trains-a4566.firebaseapp.com",
  databaseURL: "https://trains-a4566.firebaseio.com",
  projectId: "trains-a4566",
  storageBucket: "trains-a4566.appspot.com",
  messagingSenderId: "466777158619",
  appId: "1:466777158619:web:8206057897873282"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


console.log(firebase);


var database = firebase.database();


// Initial Values
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;
var currentTime = moment();
var index = 0;
var trainIDs = [];

// Show current time
var datetime = null,
date = null;

var update = function () {
date = moment(new Date())
datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function(){
datetime = $('#current-status')
update();
setInterval(update, 1000);
});


// Button Click
$("#add-train").on("click", function() {

// Grabbed values from text boxes
trainName = $("#train-name").val().trim();
destination = $("#destination").val().trim();
firstTrainTime = $("#train-time").val().trim();
frequency = $("#frequency").val().trim();


var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");


// Difference between the times
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");


// Time apart (remainder)
var tRemainder = diffTime % frequency;

// Minute Until Train
var minutesAway = frequency - tRemainder;


// Next Train
var nextTrain = moment().add(minutesAway, "minutes");

// Arrival train
var nextArrival = moment(nextTrain).format("hh:mm a");

var nextArrivalUpdate = function() {
  date = moment(new Date())
  datetime.html(date.format('hh:mm a'));
}

// Code for handling the push
database.ref().push({
  trainName: trainName,
  destination: destination,
  firstTrainTime: firstTrainTime,
  frequency: frequency,
  minutesAway: minutesAway,
  nextArrival: nextArrival,
  dateAdded: firebase.database.ServerValue.TIMESTAMP
});



// Empty text input
$("#train-name").val("");
$("#destination").val("");
$("#train-time").val("");
$("#frequency").val("");

// Don't refresh the page!
return false; 
});


database.ref().orderByChild("dateAdded").limitToLast(25).on("child_added", function(snapshot) {


  console.log("Train name: " + snapshot.val().trainName);
  console.log("Destination: " + snapshot.val().destination);
  console.log("First train: " + snapshot.val().firstTrainTime);
  console.log("Frequency: " + snapshot.val().frequency);
  console.log("Next train: " + snapshot.val().nextArrival);
  console.log("Minutes away: " + snapshot.val().minutesAway);
  console.log("==============================");


// Change the HTML to reflect
$("#new-train").append("<tr><td>" + snapshot.val().trainName + "</td>" +
  "<td>" + snapshot.val().destination + "</td>" + 
  "<td>" + "Every " + snapshot.val().frequency + " mins" + "</td>" + 
  "<td>" + snapshot.val().nextArrival + "</td>" +
  "<td>" + snapshot.val().minutesAway + " mins until arrival" + "</td>" +
 
  "</td></tr>");

index++;

// Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

//Gets the train IDs in an Array
database.ref().once('value', function(dataSnapshot){ 
  var trainIndex = 0;

    dataSnapshot.forEach(
        function(childSnapshot) {
            trainIDs[trainIndex++] = childSnapshot.key();
        }
    );
});

console.log(trainIDs);