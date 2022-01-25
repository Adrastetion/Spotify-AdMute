function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getElement(query) {
  return new Promise(async (resolve) => {
    let element = document.querySelector(query);

    if (element) {
      resolve(element);
    } else {
      await sleep(2000);
      getElement(query).then(resolve);
    }
  });
}

const config = { attributes: true };

let isMuted = false;
let adMute = false; // to keep track if the player was muted by the extension or the user
let muteBtn;
let nextBtn;
let localizedNowplaying = blowser.i18n.getMessage(localizedNowplaying);

Promise.all([getElement(".player-controls__right"), getElement(".volume-bar")])
  .then((elements) => {
    [playerControls, volumeBar] = elements;

    nextBtn = playerControls.children[0];
    muteBtn = volumeBar.children[0];
    muteBtn.addEventListener("click", function () {
      isMuted = !isMuted;
    });

    return getElement(`[aria-label*="${localizedNowplaying}"]`);
  })
  .then((trackDiv) => {
    let observer = new MutationObserver(function (mutations) {
      if (nextBtn.hasAttribute("disabled")) {
        if (isMuted === false) {
          muteBtn.click();
          adMute = true;
        }
      } else if (adMute === true && isMuted === true) {
        // unmute only if muted by extension
        muteBtn.click();
        adMute = false;
      } else {
      }
    });

    observer.observe(trackDiv, config);
  });
