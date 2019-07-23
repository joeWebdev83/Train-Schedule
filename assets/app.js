// Initialize Firebase
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
//var database = firebase.database();

  var database = firebase.database();

  
  
  $("#submit").on("click", function() {
    console.log("input");
    // take user input
    var trainName = $("#trainName")
      .val()
      .trim();
    var trainDest = $("#trainDest")
      .val()
      .trim();
    var trainStart = moment(
      $("#trainStart")
        .val()
        .trim(),
      "HH:mm"
    ).format("HH:mm");
    var trainFreq = $("#trainFreq")
      .val()
      .trim();

    // to create local temporary object to hold train data
    var newTrain = {
      name: trainName,
      place: trainDest,
      strain: trainStart,
      freq: trainFreq
    };
    // uploads train data to the database
    database.ref().push(newTrain);
    console.log(newTrain.name);
    // clears all the text-boxes
    $("#trainName").val("");
    $("#trainDest").val("");
    $("#trainStart").val("");
    $("#trainFreq").val("");
    // Prevents moving to new page
    return false;
  });

  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());


    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().place;
    var trainStart = childSnapshot.val().strain;
    var trainFreq = childSnapshot.val().freq;

    var firstConvert = moment(trainStart, "HH:mm");
    console.log(firstConvert);
    var currentTime = moment().format("HH:mm");
    console.log("CURRENT TIME: " + currentTime);

    var timeDifference = moment().diff(moment(firstConvert), "minutes");
    console.log(trainStart);
    var timeRemainder = timeDifference % trainFreq;
    console.log(timeRemainder);

    var minsTilTrain = trainFreq - timeRemainder;

    var nextTrn = moment()
      .add(minsTilTrain, "minutes")
      .format("HH:mm");

    $("#trainData>tbody").append(
      "<tr><td>" +
        trainName +
        "</td><td>" +
        trainDest +
        "</td><td>" +
        nextTrn +
        "</td><td>" +
        trainFreq +
        "</td><td>" +
        minsTilTrain +
        "</tr></td>"
    );
  });

