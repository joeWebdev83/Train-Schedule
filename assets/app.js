// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAPZEIkfWoGHMka-_Gifkg9Czn5oQZpOog",
    authDomain: "train-82753.firebaseapp.com",
    databaseURL: "https://train-82753.firebaseio.com",
    projectId: "train-82753",
    storageBucket: "",
    messagingSenderId: "587728696635",
    appId: "1:587728696635:web:3ddc1cbf11ab9a25"
  };

  firebase.initializeApp(config);
        let database = firebase.database();
        //enter to firebase when button is clicked
        $("#addTrain").on("click", function (event) {
            event.preventDefault();
            //assign variables from the user input
            let trainName = $("#name").val().trim();
            let destination = $("#destination").val().trim();
            let firstTrain = $("#firstTrain").val().trim();
            let frequency = $("#frequency").val().trim();
            //train data
            let tempTrain = {
                name: trainName,
                destination: destination,
                firstTrain: firstTrain,
                frequency: frequency,
            };
            //train data to add to the database
            database.ref().push(tempTrain);
            console.log("items pushed to database");
            console.log(tempTrain.name);
            console.log(tempTrain.destination);
            console.log(tempTrain.firstTrain);
            console.log(tempTrain.frequency);
            // Clears all of the text-boxes
            $("#name").val("");
            $("#destination").val("");
            $("#firstTrain").val("");
            $("#frequency").val("");
        });
        //create the even that grabs the data and puts it back to html
        database.ref().on("child_added", function (snapshot, prevChildKey) {
            console.log(snapshot.val());
            //put everything in variables
            let snapName = snapshot.val().name;
            let snapDestination = snapshot.val().destination;
            let snapFirstTrain = snapshot.val().firstTrain;
            let snapFrequency = snapshot.val().frequency;
            let timeArr = snapFirstTrain.split(":");
            let trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
            let maxMoment = moment().max(moment(), trainTime);
            let tMinutes;
            let tArrival;
            //if the first train is later than the current train, set arrival to the first train time
            if (maxMoment === trainTime) {
                tArrival = trainTime.format("hh:mm A");
                tMinutes = trainTime.diff(moment(), "minutes");
            }
            else {
                //minutes to arrival
                let differenceTimes = moment().diff(trainTime, "minutes");
                let tRemainder = differenceTimes % snapFrequency;
                tMinutes = snapFrequency - tRemainder;
                //calculating the arrival time
                tArrival = moment().add(tMinutes, "m").format("hh:mm A");
            }
            console.log("tMinutes" + tMinutes);
            console.log("tArrival" + tArrival);
            //add data to column
            $("#train-list").append(`<tr>
            <th scope = "row">${snapName}</th>
            <td>${snapDestination}</td>
            <td>${snapFrequency}</td>
            <td>${tArrival}</td>
            <td>${tMinutes}</td>
            </tr>`
            )
        })
