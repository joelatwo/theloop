/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * theloopja implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * theloopja.js
 *
 * theloopja user interface script
 *
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

define([
  "dojo",
  "dojo/_base/declare",
  "ebg/core/gamegui",
  "ebg/counter",
  "ebg/stock",
], function (dojo, declare) {
  return declare("bgagame.theloopja", ebg.core.gamegui, {
    constructor: function () {
      console.log("theloopja constructor");
      this.cardwidth = 200;
      this.cardheight = 275;

      // Here, you can init the global variables of your user interface
      // Example:
      // this.myGlobalValue = 0;
    },

    /*
            setup:
            
            This method must set up the game user interface according to current game situation specified
            in parameters.
            
            The method is called each time the game interface is displayed to a player, ie:
            _ when the game starts
            _ when a player refreshes the game page (F5)
            
            "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
        */

    setup: function (gamedatas) {
      console.log("Starting game setup");

      console.log(gamedatas.players);

      // Example to add a div on the game area
      document.getElementById("game_play_area").insertAdjacentHTML(
        "beforeend",
        `
                <div id="player-tables">
                   <div id="eras"></div>
                   ${Object.values(gamedatas.players).map(
                     (player, index) =>
                       `<div class="playertablename" style="color:#${player.color};"><span class="dealer_token" id="dealer_token_p${player.id}">🃏 </span>${player.name}</div>
                     <div class="playertablecard" id="playertablecard_${player.id}"></div>
                     <div class="playertablename" id="hand_score_wrap_${player.id}"><span class="hand_score_label"></span> <span id="hand_score_${player.id}"></span></div>`
                   )}
                    <div id="myhand_wrap" class="whiteblock">
                      <b id="myhand_label">${_("My hand")}</b>
                      <div id="myhand">
                        <div class="playertablecard"></div>
                      </div>
                    </div>
                </div>
            `
      );

      const eras = document.getElementById("eras");
      for (let i = 1; i < 8; i++) {
        eras.insertAdjacentHTML(
          `afterbegin`,
          `<div class="era era_${i}">
            <div class="goal"></div>
            <div class="red cubes">${gamedatas.eras[i - 1].red_cubes}</div>
            <div class="green cubes">${gamedatas.eras[i - 1].green_cubes}</div>
            <div class="heroes"><div>
            </div>`
        );
      }

      this.playerHand = new ebg.stock(); // new stock object for hand
      this.playerHand.create(
        this,
        $("myhand"),
        this.cardwidth,
        this.cardheight
      );

      // Create cards types:
      for (var color = 1; color <= 7; color++) {
        for (var value = 2; value <= 12; value++) {
          // Build card type id
          var card_type_id = this.getCardUniqueId(color, value);
          this.playerHand.addItemType(
            card_type_id,
            card_type_id,
            g_gamethemeurl + "img/cards_artifact.jpg",
            card_type_id
          );
        }
      }

      this.playerHand.image_items_per_row = 7; // 13 images per row

      this.playerHand.addToStockWithId(this.getCardUniqueId(1, 2), 42);

      dojo.connect(
        this.playerHand,
        "onChangeSelection",
        this,
        "onPlayerHandSelectionChanged"
      );

      // Setup game notifications to handle (see "setupNotifications" method below)
      this.setupNotifications();

      console.log("Ending game setup");
    },

    ///////////////////////////////////////////////////
    //// Game & client states

    // onEnteringState: this method is called each time we are entering into a new game state.
    //                  You can use this method to perform some user interface changes at this moment.
    //
    onEnteringState: function (stateName, args) {
      console.log("Entering state: " + stateName, args);

      switch (stateName) {
        case "playerTurn":
          // this.updatePossibleMoves(args.args.possibleMoves);
          break;

        case "dummy":
          break;
      }
    },

    updatePossibleMoves: function (possibleMoves) {
      // Remove current possible moves
      document
        .querySelectorAll(".possibleMove")
        .forEach((div) => div.classList.remove("possibleMove"));

      for (var x in possibleMoves) {
        for (var y in possibleMoves[x]) {
          // x,y is a possible move
          document
            .getElementById(`square_${x}_${y}`)
            .classList.add("possibleMove");
        }
      }

      this.addTooltipToClass("possibleMove", "", _("Place a disc here"));
    },

    onPlayDisc: function (evt) {
      // Stop this event propagation
      evt.preventDefault();
      evt.stopPropagation();

      // Get the cliqued square x and y
      // Note: square id format is "square_X_Y"
      var coords = evt.currentTarget.id.split("_");
      var x = coords[1];
      var y = coords[2];

      if (
        !document
          .getElementById(`square_${x}_${y}`)
          .classList.contains("possibleMove")
      ) {
        // This is not a possible move => the click does nothing
        return;
      }

      this.bgaPerformAction("actPlayDisc", {
        x: x,
        y: y,
      });
    },

    // onLeavingState: this method is called each time we are leaving a game state.
    //                 You can use this method to perform some user interface changes at this moment.
    //
    onLeavingState: function (stateName) {
      console.log("Leaving state: " + stateName);

      switch (stateName) {
        /* Example:
            
            case 'myGameState':
            
                // Hide the HTML block we are displaying only during this game state
                dojo.style( 'my_html_block_id', 'display', 'none' );
                
                break;
           */

        case "dummy":
          break;
      }
    },

    // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
    //                        action status bar (ie: the HTML links in the status bar).
    //
    // onUpdateActionButtons: function (stateName, args) {
    //   console.log("onUpdateActionButtons: " + stateName, args);

    //   if (this.isCurrentPlayerActive()) {
    //     switch (stateName) {
    //       case "playerTurn":
    //         const playableCardsIds = args.playableCardsIds; // returned by the argPlayerTurn

    //         // Add test action buttons in the action status bar, simulating a card click:
    //         playableCardsIds.forEach((cardId) =>
    //           this.addActionButton(
    //             `actPlayCard${cardId}-btn`,
    //             _("Play card with id ${card_id}").replace("${card_id}", cardId),
    //             () => this.onCardClick(cardId)
    //           )
    //         );

    //         this.addActionButton(
    //           "actPass-btn",
    //           _("Pass"),
    //           () => this.bgaPerformAction("actPass"),
    //           null,
    //           null,
    //           "gray"
    //         );
    //         break;
    //     }
    //   }
    // },

    ///////////////////////////////////////////////////
    //// Utility methods

    /*
        
            Here, you can defines some utility methods that you can use everywhere in your javascript
            script.
        
        */

    // Get card unique identifier based on its color and value
    getCardUniqueId: function (color, value) {
      return (color - 1) * 13 + (value - 2);
    },

    addDiscOnBoard: async function (x, y, player) {
      const color = this.gamedatas.players[player].color;

      document
        .getElementById("discs")
        .insertAdjacentHTML(
          "beforeend",
          `<div class="disc" data-color="${color}" id="disc_${x}${y}"></div>`
        );

      this.placeOnObject(`disc_${x}${y}`, "overall_player_board_" + player);

      const anim = this.slideToObject(`disc_${x}${y}`, "square_" + x + "_" + y);
      await this.bgaPlayDojoAnimation(anim);
    },

    ///////////////////////////////////////////////////
    //// Player's action

    onPlayerHandSelectionChanged: function () {
      var items = this.playerHand.getSelectedItems();

      if (items.length > 0) {
        if (this.checkAction("actPlayCard", true)) {
          // Can play a card

          var card_id = items[0].id;
          console.log("on playCard " + card_id);

          this.playerHand.unselectAll();
        } else if (this.checkAction("actGiveCards")) {
          // Can give cards => let the player select some cards
        } else {
          this.playerHand.unselectAll();
        }
      }
    },

    /*
        
            Here, you are defining methods to handle player's action (ex: results of mouse click on 
            game objects).
            
            Most of the time, these methods:
            _ check the action is possible at this game state.
            _ make a call to the game server
        
        */

    // Example:

    ///////////////////////////////////////////////////
    //// Reaction to cometD notifications

    /*
            setupNotifications:
            
            In this method, you associate each of your game notifications with your local method to handle it.
            
            Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                  your theloopja.game.php file.
        
        */
    setupNotifications: function () {
      console.log("notifications subscriptions setup");

      // automatically listen to the notifications, based on the `notif_xxx` function on this class.
      this.bgaSetupPromiseNotifications();
    },

    notif_playDisc: async function (args) {
      // Remove current possible moves (makes the board more clear)
      document
        .querySelectorAll(".possibleMove")
        .forEach((div) => div.classList.remove("possibleMove"));

      await this.addDiscOnBoard(args.x, args.y, args.player_id);
    },

    notif_turnOverDiscs: async function (args) {
      // Get the color of the player who is returning the discs
      const targetColor = this.gamedatas.players[args.player_id].color;

      // wait for the animations of all turned discs to be over before considering the notif done
      await Promise.all(
        args.turnedOver.map((disc) =>
          this.animateTurnOverDisc(disc, targetColor)
        )
      );
    },

    animateTurnOverDisc: async function (disc, targetColor) {
      const discDiv = document.getElementById(`disc_${disc.x}${disc.y}`);
      if (!this.bgaAnimationsActive()) {
        // do not play animations if the animations aren't activated (fast replay mode)
        discDiv.dataset.color = targetColor;
        return Promise.resolve();
      }

      // Make the disc blink 2 times
      const anim = dojo.fx.chain([
        dojo.fadeOut({ node: discDiv }),
        dojo.fadeIn({ node: discDiv }),
        dojo.fadeOut({
          node: discDiv,
          onEnd: () => (discDiv.dataset.color = targetColor),
        }),
        dojo.fadeIn({ node: discDiv }),
      ]); // end of dojo.fx.chain

      await this.bgaPlayDojoAnimation(anim);
    },

    notif_newScores: async function (args) {
      for (var player_id in args.scores) {
        var newScore = args.scores[player_id];
        this.scoreCtrl[player_id].toValue(newScore);
      }
    },

    // TODO: from this point and below, you can write your game notifications handling methods

    /*
        Example:
        
        notif_cardPlayed: function( notif )
        {
            console.log( 'notif_cardPlayed' );
            console.log( notif );
            
            // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
            
            // TODO: play the card in the user interface.
        },    
        
        */
  });
});
