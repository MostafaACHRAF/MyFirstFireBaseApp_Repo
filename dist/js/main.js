(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define("main", [], factory);
    } else if (typeof exports !== "undefined") {
        factory();
    } else {
        var mod = {
            exports: {}
        };
        factory();
        global.main = mod.exports;
    }
})(this, function () {
    'use strict';

    (function () {
        var config = {
            apiKey: "AIzaSyCQKe6GFUVisjQj5xB_AyjAN94S7wkhnJY",
            authDomain: "myfirstfirebaseproject-e5b21.firebaseapp.com",
            databaseURL: "https://myfirstfirebaseproject-e5b21.firebaseio.com",
            storageBucket: "myfirstfirebaseproject-e5b21.appspot.com",
            messagingSenderId: "776726007716"
        };
        firebase.initializeApp(config);

        var mainScreen = document.querySelector("#mainScreen");
        var ulList = document.querySelector("#mainScreen>#list");
        var buttonAdd = document.querySelector("#send");
        var buttonRemove = document.querySelector("#remove");
        var buttonCheckAll = document.querySelector("#checkAllMsg");
        var buttonControlPanel = document.querySelector("#controlPanelBtn");
        var alerts = document.querySelector("#alerts");
        var infos = document.querySelector("#infos");
        var objet = document.querySelector("#objet");
        var corps = document.querySelector("#corps");

        var dbRef = firebase.database().ref().child("messages");

        dbRef.on('value', function (snap) {});

        dbRef.on('child_added', function (snap) {
            var li = document.createElement('li');
            var h5 = document.createElement('h5');
            var input = document.createElement('input');
            var span = document.createElement('span');
            input.type = "checkbox";
            h5.innerHTML = snap.val().corps;
            span.innerHTML = snap.val().objet;
            li.classList.add('list-group-item', 'text-info', 'text-uppercase');
            li.id = snap.key;
            ulList.appendChild(li);
            li.appendChild(input);
            li.appendChild(span);
            li.appendChild(h5);
            getNbrMsg();
        });

        dbRef.on('child_removed', function (snap) {
            var liToRemove = document.getElementById(snap.key);
            liToRemove.remove();
            console.log(liToRemove.id);
            getNbrMsg();
        });

        function addMessage() {
            var msg = {
                "objet": objet.value, "corps": corps.value
            };

            if (msg.objet == "" || msg.corps == "") showAlert("Error ! All fields are required", "alert-danger");else {
                dbRef.push().set(msg);
                objet.value = "";
                corps.value = "";
                showAlert("Success. Your message has been added", "alert-success");
            }
        }

        function removeMessage() {
            var allInputs = Array.from(document.querySelectorAll('#list>li>input'));
            var rowsToRemoveExist = false;
            for (var i = 0; i < allInputs.length; i++) {
                if (allInputs[i].checked) {
                    dbRef.child(allInputs[i].parentElement.id).remove();
                    rowsToRemoveExist = true;
                    showAlert("The message has been suppressed", "alert-success");
                }
            }if (!rowsToRemoveExist) showAlert("Error ! We can not delete messages please select one", "alert-danger");
        }

        function checkAllOrNot() {
            var allInputs = Array.from(document.querySelectorAll('#list>li>input'));

            if (buttonCheckAll.textContent == "Check all") {
                buttonCheckAll.textContent = "Do not check all";
                for (var i = 0; i < allInputs.length; i++) {
                    allInputs[i].checked = true;
                }
            } else {
                buttonCheckAll.textContent = "Check all";
                for (var _i = 0; _i < allInputs.length; _i++) {
                    allInputs[_i].checked = false;
                }
            }
        }

        function showControlePanel() {
            var controlpanel = document.querySelector("#form");
            if (controlpanel.style.top == "0px") controlpanel.style.top = "-270px";else controlpanel.style.top = "0px";
        }

        function showAlert(msg, type) {
            var div = document.createElement('div');
            div.classList.add('alert', type);
            div.textContent = msg;
            alerts.appendChild(div);
            setTimeout(function () {
                div.parentElement.removeChild(div);
            }, 2000);
        }

        function getNbrMsg() {
            dbRef.once("value", function (snap) {
                var nbrMsg = snap.numChildren();
                infos.textContent = "You have ".concat(nbrMsg + " messages");
            });
        }

        buttonAdd.onclick = addMessage;
        buttonRemove.onclick = removeMessage;
        buttonCheckAll.onclick = checkAllOrNot;
        buttonControlPanel.onclick = showControlePanel;
    })();
});