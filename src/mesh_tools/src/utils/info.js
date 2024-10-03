import { storage } from "../globals.js";

const dontShowAgainInfoStorage = storage.in("dont_show_again_info_storage");
export function dontShowAgainInfo(id, title, message) {
  if (dontShowAgainInfoStorage.has(id)) {
    return;
  }

  const messageBox = Blockbench.showMessageBox(
    {
      title,
      message,
      icon: "info",
      checkboxes: {
        dont_show_again: { value: false, text: "dialog.dontshowagain" },
      },
      buttons: ["dialog.ok"],
    },
    (_, { dont_show_again: dontShowAgain }) => {
      if (dontShowAgain) {
        dontShowAgainInfoStorage.set(id, true);
      }
    }
  );
  messageBox.object.querySelector(".dialog_content").style.overflow = "auto";
}

/**
 *
 * @param {string} message
 * @param {?number} timeout
 * @returns {never}
 */
export function throwQuickMessage(message, timeout) {
  Blockbench.showQuickMessage(message, timeout);
  throw message;
}
