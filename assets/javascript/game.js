



// List of characters and their properties

var rey = {
  "name" : "Rey",
  "id" : "rey",
  "attackPwr" : 7,
  "healthPts" : 150,
  "counterAtkPwr" : 7,
  "classes" : "character selectable"
}

var vader = {
  "name" : "Darth Vader",
  "id" : "vader",
  "attackPwr" : 10,
  "healthPts" : 180,
  "counterAtkPwr" : 10,
  "classes" : "character selectable"
}

var fett = {
  "name" : "Boba Fett",
  "id" : "fett",
  "attackPwr" : 9,
  "healthPts" : 200,
  "counterAtkPwr" : 9,
  "classes" : "character selectable"
}

var obiwan = {
  "name" : "Obi-Wan Kenobi",
  "id" : "obiwan",
  "attackPwr" : 8,
  "healthPts" : 120,
  "counterAtkPwr" : 8,
  "classes" : "character selectable"
}

var you = ""; // your character
var them = ""; // your opponent
// var defenders = []; // list of defenders
var characters = [rey, vader, fett, obiwan];




$(document).ready(function() {



  // At the start of the game, you can pick any character
  $(".selectable").on("click", function() {

    // Set you to the character you picked
    you = window[this.id];
    $(this).addClass("selected");
    console.log("Selecting " + you.name);

    // Removing the character selection event handler cuz we don't want it anymore
    $(".selectable").off("click");

    // Move everyone else to the enemies div
    for(var i = 0; i < characters.length; i++) {
      if (characters[i].id != this.id) {
        //defenders.push(characters[i]);
        var theId = "#" + characters[i].id;
        var thisChar = $(theId).detach();
        $(thisChar).addClass("enemy");
        thisChar.appendTo("#enemies");
      }
    }

    // you're not selectable anymore
    $(this).removeClass("selectable");

    // add enemy event handler to alive enemies
    $(".enemy").on("click", enemyHandler);

  });

  function enemyHandler() {

    // set them to the opponent you chose
    them = window[this.id];
    $(this).addClass("opponent");
    console.log("Fighting " + them.name);

    // remove event handler from remaining enemies
    $(".enemy").off("click");

    // remove selectable for all enemies until the fight is done
    $(".character").removeClass("selectable");

    // enable the attack button
    $("#attackBtn").prop("disabled", false);
  }

  // Handler for Attack button
  $("#attackBtn").on("click", function() {

     // you attack first
    them.healthPts -= you.counterAtkPwr;
    writeMsg("You attacked " + them.name + " for " + you.counterAtkPwr + " damage.");

    // increase your counterAtkPwr by your attackPwr base
    you.counterAtkPwr += you.attackPwr;

    // if the opponent isn't dead, they can attack back
    if(them.healthPts > 0) {
      you.healthPts -= them.counterAtkPwr;
      writeMsg(them.name + " attacked you back for " + them.counterAtkPwr + " damage.");
    }
    else { // the opponent was dead and couldn't fight back
      writeMsg("You have defeated " + them.name + "!");

      // if all enemies are dead, you win message
      if($("#enemies").is(":empty")) {

        writeMsg("Congratulations!  You have defeated all of the enemies!");
        gameOver();
      }
      else { // just one enemy died

        // remove them from the DOM
        var theId = "#" + them.id;
        $(theId).remove();

        them=""; // we no longer have a selected enemy

        // disable the attack button until a new enemy is selected
        $("#attackBtn").prop("disabled", true);

        // add enemyHandlers for remaining enemies
        $(".enemy").on("click", enemyHandler);
      }
    }

    // if your health is 0 or below, you lose.
    if(you.healthPts <= 0) {
      writeMsg("You have been defeated... GAME OVER!");
      gameOver();
    }

  });

  // I'm lazy so the reset button just refreshes the page.  :3
  $("#resetBtn").on("click", function() {
    location.reload();
  });

  // Writes a message out to the combat log
  function writeMsg(msg) {
    $("#textLog").append("<p>" + msg + "</p>");
    $("#textLog").animate({scrollTop: $("#textLog").prop("scrollHeight")}, 500);
  }

  // Replaces the attack button with a reset button
  function gameOver() {
    $("#attackBtn").remove();
    $("#fight").append("<button id='resetBtn'>Reset</button>");
  }

});