// when you load page
// 1. pull down tournament leaderboard
// 2. calculate player scores
// 3. display leaderboard
//first, last, score, rounds[1, 2, 3, 4], days played == length of leader rounds
const baseURL = '';//'http://localhost:8000';
let scores =
[
    JSON.stringify({
        first: "molly",
        last: "pribble",
        score: 1,
        rounds: [2, -2, 1]
    }),
    JSON.stringify({
        first: "james",
        last: "pribble",
        score: 3,
        rounds: [2, 0, 1]
    }),
    JSON.stringify({
        first: "jack",
        last: "pribble",
        score: 5,
        rounds: [2, 3]
    }),
    JSON.stringify({
        first: "amy",
        last: "longcore",
        score: 7,
        rounds: [2, 5]
    }),
    JSON.stringify({
        first: "frank",
        last: "meyer",
        score: 8,
        rounds: [3, 5]
    }),
    JSON.stringify({
        first: "jeff",
        last: "kellstrom",
        score: 10,
        rounds: [5, 5]
    }),
    JSON.stringify({
        first: "debbie",
        last: "williams-hoak",
        score: 15,
        rounds: [10, 5]
    })
];
let daysPlayed;
let topScore;
let leaderboard = [];
let numPlayers;

initPage = () => {
    leaderboard = [];

    document.getElementById('leaderboard-inner').innerHTML = ``;
    document.getElementById('add-me').innerHTML = `<!-- Add new player interface -->
    <button id="new-player" class="btn">Enter Pool</button>`

     fetch(`${baseURL}/update`)
         .then(response => response.json())
         .then(data => {
            scores = data.leaderboard;
            console.log(scores);

            daysPlayed = scores[0].rounds.length;//JSON.parse(scores[0]).rounds.length;
            topScore = scores[0].score;//JSON.parse(scores[0]).score;

            fetch(`${baseURL}/players`)
                .then(response => response.json())
                .then(data => {
                    numPlayers = data.length;
                    data.forEach(p => {
                        const resetScore = { score: 0 }
                        fetch(`${baseURL}/players/${p._id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(resetScore)
                        })
                            .then(response => response.json())
                            .then(data => {
                                let playerScore = data.score;
                                scores.forEach(s =>{
                                    let tempName = s.first_name+" "+s.last_name;//JSON.parse(s).first+" "+JSON.parse(s).last
                                    if (tempName == data.pick1 || tempName == data.pick2 || tempName == data.pick3 || tempName == data.pick4 || tempName == data.pick5){
                                        console.log(tempName);
                                        playerScore = playerScore + calcScore(daysPlayed, s.rounds, data.score); //JSON.parse(s).rounds
                                    }
                                    updateScore(p._id, playerScore);
                                });
                                leaderboard.push([p._id, playerScore, p.tiebreaker, p.name, p.pick1, p.pick2, p.pick3, p.pick4, p.pick5]);
                            })
                            .then(buildLeaderboard)
                    });
                })
                .then(attachEventHandlers);
         })    
}

const addNewPlayer = (fName, fEmail, form1, form2, form3, form4, form5, fTiebreaker) => {
    const playerData = {
        name: fName,
        email: fEmail,
        pick1: form1,
        pick2: form2,
        pick3: form3,
        pick4: form4,
        pick5: form5,
        tiebreaker: fTiebreaker
    }

    fetch(`${baseURL}/players`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playerData)
    })
        .then(response => {
            if (response.status == 400){
                document.querySelector('#add-me').innerHTML = `
                <p><i>Player already in db, please try again and enter a unique name</i></p>
                <!-- Add new player interface -->
                <button id="new-player" class="btn">Enter Pool</button>`;
                 return;
            }
            response.json();
        })
         .then(data => {
             initPage();
         });
    }

const cancelPlayer = ev => {
    //console.log("cancel");
    document.querySelector('#add-me').innerHTML = `<!-- Add new player interface -->
    <button id="new-player" class="btn">Enter Pool</button>`;
    attachEventHandlers();
}

const createFromForm = ev => {
    //console.log("create");

    let formName = document.forms["new-player-form"]["name"].value;
    let formEmail = document.forms["new-player-form"]["email"].value;
    let form1 = document.forms["new-player-form"]["pick1"].value;
    let form2 = document.forms["new-player-form"]["pick2"].value;
    let form3 = document.forms["new-player-form"]["pick3"].value;
    let form4 = document.forms["new-player-form"]["pick4"].value;
    let form5 = document.forms["new-player-form"]["pick5"].value;
    let formTiebreaker = document.forms["new-player-form"]["tiebreaker"].value;

    let errorMessage = ``;
    if (document.contains(document.getElementById("error"))) {
        document.getElementById("error").remove();
    }
    let allGood = true;

    const tiebreaker = parseInt(formTiebreaker);

    //(typeof tiebreaker, tiebreaker);

    if (tiebreaker){
        if (formName.length == 0 || formEmail.length == 0 || form1.length == 0 || form2.length == 0 || form3.length == 0 || form4.length == 0 || form5.length == 0){
            errorMessage = `
            <div id="error">
                <p><i>All fields are required</i></p>
            </div>`;
            allGood = false;
        }
        else {
            console.log("entry success");
        }
    }
    else {
        errorMessage = `
        <div id="error">
            <p><i>Tiebreaker must be an integer</i></p>
        </div>`;
        allGood = false;
    }

    if (allGood){
        //console.log("all good");
        addNewPlayer(formName, formEmail, form1, form2, form3, form4, form5, tiebreaker);
    }

    document.querySelector('#add-me').innerHTML = errorMessage + `
    <form name="new-player-form">
        <!-- Name -->
        <label for="name">Name</label>
        <input type="text" id="name">

        <!-- Email -->
        <label for="email">Email</label>
        <input type="text" id="email">
        <br>
        <p><i>For your picks, please enter their first and last name with correct spelling and case (e.g. Rory McIlroy)</i></p> 
        <!-- Pick 1 -->
        <label for="pick1">First Pick</label>
        <input type="text" id="pick1">

        <!-- Pick 2 -->
        <label for="pick2">Second Pick</label>
        <input type="text" id="pick2">

        <!-- Pick 3 -->
        <label for="pick3">Third Pick</label>
        <input type="text" id="pick3">

        <!-- Pick 4 -->
        <label for="pick4">Fourth Pick</label>
        <input type="text" id="pick4">

        <!-- Pick 5 -->
        <label for="pick5">Fifth Pick</label>
        <input type="text" id="pick5">

        <br>
        <p><i>For the tiebreaker, enter your guess at the winning score as an integer (e.g. 3, -2, 0, etc.)</i></p>

        <!-- Tiebreaker -->
        <label for="tiebreaker">Tiebreaker</label>
        <input type="text" id="tiebreaker">

        <!-- Buttons -->
        <button class="btn btn-main" id="create">Submit</button>
        <button class="btn" id="cancel">Cancel</button>
    </form>`;

    attachFormEventHandlers();
}

const attachFormEventHandlers = () => {
    document.querySelector('#create').onclick=createFromForm;
    document.querySelector('#cancel').onclick=cancelPlayer;
}

newPlayer = ev => {
    document.querySelector('#add-me').innerHTML  =  `
    <form name="new-player-form">
        <!-- Name -->
        <label for="name">Name</label>
        <input type="text" id="name">

        <!-- Email -->
        <label for="email">Email</label>
        <input type="text" id="email">
        <br>
        <p><i>For your picks, please enter their first and last name with correct spelling and case (e.g. Rory McIlroy)</i></p> 
        <!-- Pick 1 -->
        <label for="pick1">First Pick</label>
        <input type="text" id="pick1">

        <!-- Pick 2 -->
        <label for="pick2">Second Pick</label>
        <input type="text" id="pick2">

        <!-- Pick 3 -->
        <label for="pick3">Third Pick</label>
        <input type="text" id="pick3">

        <!-- Pick 4 -->
        <label for="pick4">Fourth Pick</label>
        <input type="text" id="pick4">

        <!-- Pick 5 -->
        <label for="pick5">Fifth Pick</label>
        <input type="text" id="pick5">

        <br>
        <p><i>For the tiebreaker, enter your guess at the winning score as an integer (e.g. 3, -2, 0, etc.)</i></p>

        <!-- Tiebreaker -->
        <label for="tiebreaker">Tiebreaker</label>
        <input type="text" id="tiebreaker">

        <!-- Buttons -->
        <button class="btn btn-main" id="create">Submit</button>
        <button class="btn" id="cancel">Cancel</button>
    </form>`;

    attachFormEventHandlers();
}

attachEventHandlers = () => {
    document.querySelector('#new-player').onclick=newPlayer;
}

calcScore = (days, rounds, start) => {
    let len = rounds.length;
    let score = start;
    //console.log(len, days);
    //console.log("start", start);
    if (len < days){
        let ii = 0;
        while (ii < len){
            //console.log("adding...", rounds[ii].score);
            score = score + rounds[ii].score;
            ii = ii + 1;
        }
        //console.log("adding...(cut)", days-len, rounds[len-1].score);
        score = score + ((days-len)*(rounds[len-1].score))
    }
    else {
        let jj = 0;
        while (jj < len){
            //console.log("adding...", rounds[jj].score);
            score = score + rounds[jj].score;
            jj = jj + 1;
        }
    }
    console.log("end", score);
    return score;
}

updateScore = (id, pScore) => {
    const playerData = {
        score: pScore
    }

    fetch(`${baseURL}/players/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playerData)
    })
        //.then(response => response.json())
        //.then(data => buildLeaderboard());
}

compareMe = (a, b) => {
    if (a[1] > b[1]){
        return 1;
    }
    else if (a[1] == b[1]){
        if (a[2]-topScore > b[2]-topScore){
            return 1;
        }
    }
    else {
        return -1;
    }
}

buildLeaderboard = () => {
    if (leaderboard.length != numPlayers){
        console.log("not there yet...");
        return;
    }
    else {
        leaderboard.sort(compareMe);
        console.log("SORTED", leaderboard);

        leaderboard.forEach(x => {
            document.getElementById('leaderboard-inner').innerHTML += `
            <li>
                <div>
                    <p><b>${x[3]}</b>: ${x[1]}</p>
                    <p><i>Picks</i>: ${x[4]}, ${x[5]}, ${x[6]}, ${x[7]}, ${x[8]} <i>(Tiebreaker: ${x[2]})</i></p>
                </div>
            </li>`
        })
    }
}

initPage()
