'use strict';


const {Meta, Shell, St} = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;


class Extension {
    constructor() {
        this._clipboard = null;
        this._selection = null;
        this._trimId = null;
        this._settings = null;
    }


    _processClipboardContent(text) {
        if (!text) {
            return;
        }

        let trimMode = this._settings.get_int('trim-mode');
        let trimString = this._settings.get_string('trim-string');
        let trimText;

        if (trimMode === 0) {
            trimText = text.trim();
            if (trimString) {
                let regex = new RegExp(`^${trimString}|${trimString}$`);
                trimText = trimText.replace(regex, '');
            }
        } else if (trimMode === 1) {
            trimText = text.trimLeft();
            if (trimString) {
                let regex = new RegExp(`^${trimString}`);
                trimText = trimText.replace(regex, '');
            }
        } else if (trimMode === 2) {
            trimText = text.trimRight();
            if (trimString) {
                let regex = new RegExp(`${trimString}$`);
                trimText = trimText.replace(regex, '');
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
        this._settings = ExtensionUtils.getSettings();

        this._clipboard = St.Clipboard.get_default();
        this._selection = Shell.Global.get().get_display().get_selection();

        this._trimId = this._selection.connect('owner-changed', (_, selectionType) => {
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


function init() {
    return new Extension();
}
