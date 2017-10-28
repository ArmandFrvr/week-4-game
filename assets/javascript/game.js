
// List of characters and their properties

var rey = {
  "name" : "Rey",
  "id" : "rey",
  "attackPwr" : 12,
  "healthPts" : 115,
  "counterAtkPwr" : 12,
}

var vader = {
  "name" : "Darth Vader",
  "id" : "vader",
  "attackPwr" : 25,
  "healthPts" : 180,
  "counterAtkPwr" : 25,
}

var fett = {
  "name" : "Boba Fett",
  "id" : "fett",
  "attackPwr" : 20,
  "healthPts" : 150,
  "counterAtkPwr" : 20,
}

var obiwan = {
  "name" : "Obi-Wan Kenobi",
  "id" : "obiwan",
  "attackPwr" : 10,
  "healthPts" : 120,
  "counterAtkPwr" : 10,
}

var you = ""; // your character
var them = ""; // your opponent
var characters = [rey, vader, fett, obiwan];


$(document).ready(function() {

  // initialize health values
  for(var i = 0; i < characters.length; i++) {
    $("#" + characters[i].id + " > p.health").text(characters[i].healthPts);
  }

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
    $("#" + them.id + " > p.health").text(them.healthPts);
    writeMsg("You attacked " + them.name + " for " + you.counterAtkPwr + " damage.");

    // increase your counterAtkPwr by your attackPwr base
    you.counterAtkPwr += you.attackPwr;

    // if the opponent isn't dead, they can attack back
    if(them.healthPts > 0) {
      you.healthPts -= them.counterAtkPwr;
      $("#" + you.id + " > p.health").text(you.healthPts);
      writeMsg(them.name + " attacked you back for " + them.counterAtkPwr + " damage.", "red");
    }
    else { // the opponent was dead and couldn't fight back
      writeMsg(" > You have defeated " + them.name + "!", "#006600");

      // remove them from the DOM
      $("#" + them.id).remove();

      them=""; // we no longer have a selected enemy

      // disable the attack button until a new enemy is selected
      $("#attackBtn").prop("disabled", true);

      // add enemyHandlers for any remaining enemies
      $(".enemy").on("click", enemyHandler);

      // if all enemies are dead, display "you win" message
      if($("#enemies").children().length < 1) {
        writeMsg("Congratulations!  You have defeated all of the enemies!", "#006600", "bold");
        gameOver();
      }
    }

    // if your health is 0 or below, you lose.
    if(you.healthPts <= 0) {
      writeMsg("You have been defeated... GAME OVER!", "red", "bold");
      gameOver();
    }

  });


  // Writes a message out to the combat log
  function writeMsg(msg, color, weight) {
    if(!color) {
      color = "black";
    }

    if(!weight) {
      weight = "normal";
    }

    $("#textLog").append('<p' + ' style="color: ' + color +
      '; font-weight: ' + weight + '">' + msg + "</p>");
    $("#textLog").animate({scrollTop: $("#textLog").prop("scrollHeight")}, 300);
  }

  // Replaces the attack button with a reset button
  function gameOver() {
    $("#attackBtn").remove();
    $("#fight").append("<button id='resetBtn'>Reset</button>");

    // I'm lazy so the reset button just refreshes the page.  :3
    $("#resetBtn").on("click", function() {
      location.reload();
    });
  }

});