import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import Meta from "gi://Meta";
import Shell from "gi://Shell";
import St from "gi://St";

export default class TrimmerExtension extends Extension {
    constructor(metadata) {
        super(metadata);
        this._clipboard = null;
        this._selection = null;
        this._trimId = null;
        this._settings = null;
    }

    _processClipboardContent(text) {
        if (!text) {
            return;
        }

        const trimMode = this._settings.get_int("trim-mode");
        const trimString = this._settings.get_string("trim-string");
        let trimText;

        if (trimMode === 0) {
            trimText = text.trim();
            if (trimString) {
                const regex = new RegExp(`^${trimString}|${trimString}$`);
                trimText = trimText.replace(regex, "");
            }
        } else if (trimMode === 1) {
            trimText = text.trimLeft();
            if (trimString) {
                const regex = new RegExp(`^${trimString}`);
                trimText = trimText.replace(regex, "");
            }
        } else if (trimMode === 2) {
            trimText = text.trimRight();
            if (trimString) {
                const regex = new RegExp(`${trimString}$`);
                trimText = trimText.replace(regex, "");
            }
        }

        if (!trimText) {
            return;
        }

        if (trimText === text) {
            return;
        }

        this._clipboard.set_text(St.ClipboardType.CLIPBOARD, trimText);
    }

    _getClipboardContent() {
        this._clipboard.get_text(St.ClipboardType.CLIPBOARD, (_, text) => {
            this._processClipboardContent(text);
        });
    }

    enable() {
        this._settings = this.getSettings();
        this._clipboard = St.Clipboard.get_default();
        this._selection = Shell.Global.get().get_display().get_selection();
        this._trimId = this._selection.connect("owner-changed", (_, selectionType) => {
            if (selectionType === Meta.SelectionType.SELECTION_CLIPBOARD) {
                this._getClipboardContent();
            }
        });
    }

    disable() {
        this._selection.disconnect(this._trimId);
        this._selection = null;
        this._trimId = null;
        this._clipboard = null;
        this._settings = null;
    }
}
