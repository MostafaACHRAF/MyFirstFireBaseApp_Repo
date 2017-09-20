(() => {
    // Initialize Firebase
    let config = {
        apiKey: "AIzaSyCQKe6GFUVisjQj5xB_AyjAN94S7wkhnJY",
        authDomain: "myfirstfirebaseproject-e5b21.firebaseapp.com",
        databaseURL: "https://myfirstfirebaseproject-e5b21.firebaseio.com",
        storageBucket: "myfirstfirebaseproject-e5b21.appspot.com",
        messagingSenderId: "776726007716"
    };
    firebase.initializeApp(config);

    // Get DOM elements
    let mainScreen = document.querySelector("#mainScreen");
    let ulList = document.querySelector("#mainScreen>#list");
    let buttonAdd = document.querySelector("#send");
    let buttonRemove = document.querySelector("#remove");
    let buttonCheckAll = document.querySelector("#checkAllMsg");
    let buttonControlPanel = document.querySelector("#controlPanelBtn");
    let alerts = document.querySelector("#alerts");
    let infos = document.querySelector("#infos");
    let objet = document.querySelector("#objet");
    let corps = document.querySelector("#corps");

    // Get database reference
    let dbRef = firebase.database().ref().child("messages");

    /**
     * Whene the value of a child changed we display data at the new data
     * This function listen to the value event
     * @author: Mostafa ASHARF
     */
    dbRef.on('value', snap => {
    });

    // When a child added we call this method
    // This method display the list of all messages
    // And display the number of messages by calling (getNbrMsg)
    dbRef.on('child_added', snap => {
        const li = document.createElement('li');
        const h5 = document.createElement('h5');
        const input = document.createElement('input');
        const span = document.createElement('span');
        input.type = "checkbox";
        h5.innerHTML = snap.val().corps;
        span.innerHTML=snap.val().objet;
        li.classList.add('list-group-item', 'text-info', 'text-uppercase');
        li.id = snap.key;
        ulList.appendChild(li);
        li.appendChild(input);
        li.appendChild(span);
        li.appendChild(h5);
        getNbrMsg();
    });

    // Here we are listen to remove event, this method remove the DOM child from the screen
    dbRef.on('child_removed', snap => {
        let liToRemove = document.getElementById(snap.key);
        liToRemove.remove();
        console.log(liToRemove.id);
        getNbrMsg();
    });

    /**
     * With this function we can add a new message
     * First we create an object (msg)
     * Every message has an objet and a body
     * Newt we check if we have a validate data, else we call (showAlert)
     * If all right we push data the object at firebase and we display a scuccess alert
     * @author: Mostafa ASHARF
     */
    function  addMessage () {
        let msg = {
            "objet" : objet.value, "corps" : corps.value
        };

        if (msg.objet == "" || msg.corps == "")
            showAlert("Error ! All fields are required", "alert-danger");
        else {
            dbRef.push().set(msg);
            objet.value = "";
            corps.value = "";
            showAlert("Success. Your message has been added", "alert-success");
        }
    }

    /**
     * On click at remove button we call this function
     * First we get all rows, we put them at an array (allInputs)
     * for each element tha are checked, we delete it from the database
     * Next if the operation success with display a green alert
     * else a red!!! alert :)
     * @author: Mostafa ASHARF
     */
    function removeMessage () {
        let allInputs = Array.from(document.querySelectorAll('#list>li>input'));
        let rowsToRemoveExist = false;
        for (let i = 0; i < allInputs.length; i++)
            if (allInputs[i].checked) {
                dbRef.child(allInputs[i].parentElement.id).remove();
                rowsToRemoveExist = true;
                showAlert("The message has been suppressed", "alert-success");
            }

            if (!rowsToRemoveExist)
                showAlert("Error ! We can not delete messages please select one", "alert-danger");

    }

    /**
     * This function called when you click at checkAll button
     * In the beginning text content of button is 'check all'
     * first click the text content changed to 'do not check all'
     * at the same moment for each input we change checked attribute to true
     * Seconde click we do the opposite...etc.
     * @author: Mostafa ASHARF
     */
    function checkAllOrNot () {
        let allInputs = Array.from(document.querySelectorAll('#list>li>input'));

        if (buttonCheckAll.textContent == "Check all") {
            buttonCheckAll.textContent = "Do not check all";
            for (let i = 0; i < allInputs.length; i++)
                allInputs[i].checked = true;
        }

        else {
            buttonCheckAll.textContent = "Check all";
            for (let i = 0; i < allInputs.length; i++)
                allInputs[i].checked = false;
        }
    }

    /**
     * Here we have a small javascript and css animation
     * We display and hide a control panel
     * this control panel contain the form by which the user will add messages
     * @author: Mostafa ASHARF
     */
    function showControlePanel () {
        let controlpanel = document.querySelector("#form");
        if (controlpanel.style.top == "0px")
            controlpanel.style.top = "-270px";

        else
            controlpanel.style.top = "0px";
    }

    /**
     * This function create an alert with bootstrap3
     * @param msg (string - the text to display)
     * @param type (string - class bootstrap3)
     */
    function showAlert(msg, type) {
        let div = document.createElement('div');
        div.classList.add('alert', type);
        div.textContent = msg;
        alerts.appendChild(div);
        setTimeout(() => {
            div.parentElement.removeChild(div);
        }, 2000)
    }


    /**
     * This function get the number of children at firbase
     * We put this value in a h1 tag
     */
    function getNbrMsg () {
        dbRef.once("value", snap => {
            let nbrMsg = snap.numChildren();
            infos.textContent = "You have ".concat(nbrMsg + " messages");
        });
    }

    // Here we call our functions when the user click at buttons
    buttonAdd.onclick = addMessage;
    buttonRemove.onclick = removeMessage;
    buttonCheckAll.onclick = checkAllOrNot;
    buttonControlPanel.onclick = showControlePanel;
})();



