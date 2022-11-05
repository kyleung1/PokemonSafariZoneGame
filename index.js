/**
 * Name: Kyle Leung
 * Date:11/4/2022
 * Section: CSE 154 AB Donovan Kong
 *
 * This is the index.js page for my Creative Project 3 pokemon safari zone game. It
 * has js code that provides functions to the UI of the game in response to
 * events and inputs. Functions that include fetching JSON data from an api,
 * getting/calculating certain data for variables, getting src and alt for image
 * elements from the api, and toggling certain dom objects.
 */

"use strict";
(function() {
  window.addEventListener("load", init);

  let baseStat = 0;
  let pokeSprite = "";

  /**
   * When window is initialized, selects dom elements by id and adds event listeners.
   */
  function init() {
    const startBtn = id("start-btn");
    const ballBtn = id("ball-btn");
    startBtn.addEventListener("click", toggle);
    startBtn.addEventListener("click", genPoke);
    startBtn.addEventListener("click", () => {
      ballBtn.addEventListener("click", success);

      let ballAmt = id("ball-form");
      if (ballAmt.value === "") {
        id("ball-amt").textContent = 10;
      } else {
        id("ball-amt").textContent = ballAmt.value;
      }
    });
    const runBtn = id("run-btn");
    runBtn.addEventListener("click", toggle);
    const moreBalls = id("more-balls");
    const moreBalls2 = id("more-balls2");
    moreBalls.addEventListener("click", () => {
      moreBalls2.classList.toggle("hidden");
    });
  }

  /**
   * Fetches a JSON object from the pokeapi. Sends object to getSprite and getBase functions.
   */
  function genPoke() {
    const amount = Math.floor(Math.random() * 898);
    fetch("https://pokeapi.co/api/v2/pokemon/" + amount)
      .then(statusCheck)
      .then(res => res.json())
      .then(getSprite)
      .then(getBase)
      .catch((err) => {
        handleError(err);
      });

    const options = qs("#options p");
    options.textContent = "What will Trainer throw?";
  }

  /**
   * Creates and displays a p DOM object of the caught error.
   * @param {object} err - the error object of the fetch.
   */
  function handleError(err) {
    let errMsg = document.createElement("p");
    let header = qs("header");
    errMsg.textContent = err;
    errMsg.classList.add("error");
    header.appendChild(errMsg);
  }

  /**
   *Creates image of pokemon sprite and name bar and appends it to the #pokemon article.
   * @param {object} poke - the json object of the pokemon.
   * @returns {object} - the json object of the pokemon.
   */
  function getSprite(poke) {
    let encounter = id("pokemon");
    let pokemon = document.createElement("img");

    pokemon.src = poke.sprites.front_default;
    pokemon.alt = poke.sprites.front_default;
    encounter.innerHTML = "";
    encounter.appendChild(pokemon);

    let pokeName = id("name-label");
    pokeName.textContent = poke.forms[0].name;
    pokeSprite = poke.sprites.front_default;
    return poke;
  }

  /**
   * Assigns the baseStat variable of the current pokemon.
   * @param {object} poke - the json object of the pokemon.
   */
  function getBase(poke) {
    baseStat = 0;
    const statLength = poke.stats.length;
    for (let i = 0; i < statLength; i++) {
      baseStat += poke.stats[i].base_stat;
    }
  }

  /** Calculates if the ball throw was successful. */
  function success() {
    let success1 = false;
    let prob = Math.floor(Math.random() * baseStat);

    if (baseStat > 500) {
      if (prob < (baseStat * 0.07)) {
        success1 = true;
      }
    } else if (baseStat > 400) {
      if (prob < (baseStat * 0.15)) {
        success1 = true;
      }
    } else {
      if (prob < (baseStat * 0.3)) {
        success1 = true;
      }
    }
    handleSuccess(success1);
  }

  /**
   *Dom manipulation of the #game window based on whether or not the catch was successful.
   * @param {boolean} success2 - a boolean whether or not the catch was successful.
   */
  function handleSuccess(success2) {
    const options = qs("#options p");
    if (success2) {
      throwBall();
      setTimeout(() => {
        ballSuccess();
        options.textContent = "caught!";
      }, 4500);
    } else {
      throwBall();
      setTimeout(() => {
        ballFail();
        options.textContent = "ah it appeared to be caught.";
      }, 3000);
    }
  }

  /**
   *Creates image of shaking ball and appends it to the #pokemon dom object.
   *Decrements of the amount of balls.
   */
  function throwBall() {
    let encounter = id("pokemon");
    let pokeball = document.createElement("img");
    pokeball.src = "img/pokeball.gif";

    /*
     *Zapdicuno. (n.d.). Pokemon story mode plz! Retrieved November 4, 2022, from
     *https://aminoapps.com/c/pokemon/page/blog/pokemon-story-mode-plz/5GhV_uLgpZvNxe05JQngBgKB5xwoW8.
     */

    pokeball.alt = "pokeball";
    pokeball.classList.add("shaking");
    encounter.innerHTML = "";
    encounter.appendChild(pokeball);

    const ballAmt = id("ball-amt");
    ballAmt.textContent--;
  }

  /**
   * Changes image of shaking pokeball to still pokeball when pokemon is caught
   * and removes event listener for the ball button.
   */
  function ballSuccess() {
    let encounter = qs("#pokemon img");
    encounter.src = "img/still.png";

    /*
     *GuaxinocaGuido. (n.d.). pokeball. Retrieved November 4, 2022, from
     *https://www.pixilart.com/art/pokeball-bdeca8ec13f4905.
     */
    encounter.alt = "caught";

    const ballBtn = id("ball-btn");
    ballBtn.removeEventListener("click", success);
  }

  /**
   * Creates image of pokemon sprite and appends it to the #pokemon article when
   *ball fails to catch. Removes images of pokemon sprites when number of balls
   *run out.
   */
  function ballFail() {
    let encounter = id("pokemon");
    let pokemon = document.createElement("img");
    pokemon.src = pokeSprite;
    pokemon.alt = pokeSprite;
    encounter.innerHTML = "";
    encounter.appendChild(pokemon);
    setTimeout(() => {
      const options = qs("#options p");
      options.textContent = "What will Trainer throw?";
      if (id("ball-amt").textContent === "0") {
        const ballBtn = id("ball-btn");
        ballBtn.removeEventListener("click", success);
        options.textContent = "Trainer ran out of balls, it fled...";
        encounter.innerHTML = "";
      }
    }, 2000);
  }

  /** Toggles the view of the menu and game window. */
  function toggle() {
    const menu = id("menu");
    const game = id("game");
    menu.classList.toggle("hidden");
    game.classList.toggle("hidden");
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected Promise
   * result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   *Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }
})();