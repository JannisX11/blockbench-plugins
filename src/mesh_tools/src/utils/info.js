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
}
export function dontShowAgainWarning(id, title, message) {
  if (dontShowAgainInfoStorage.has(id)) {
    return true;
  }

  return new Promise((resolve) => {
    Blockbench.showMessageBox(
      {
        title,
        message,
        icon: "warning",
        checkboxes: {
          dont_show_again: { value: false, text: "dialog.dontshowagain" },
        },
        buttons: ["dialog.ok", "dialog.cancel"],
      },
      (button, { dont_show_again: dontShowAgain }) => {
        if (dontShowAgain) {
          dontShowAgainInfoStorage.set(id, true);
        }

        if (button === 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
}

/**
 *
 * @param {string} message
 * @param {?number} timeout
 * @returns {never}
 */
export function throwQuickMessage(message, timeout = 2000) {
  Blockbench.showQuickMessage(message, timeout);
  throw message;
}
