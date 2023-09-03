import { ExtensionPreferences } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";
import Adw from "gi://Adw";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";

const trimModes = ["both", "left", "right"];

export default class TrimmerPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup();
        page.add(group);

        // Trim Mode
        const rowMode = new Adw.ActionRow({
            title: "Trim Mode",
        });
        group.add(rowMode);

        const dropdown = new Gtk.DropDown({
            valign: Gtk.Align.CENTER,
            model: Gtk.StringList.new(trimModes),
            selected: settings.get_string("trim-mode"),
        });

        settings.bind("trim-mode", dropdown, "selected", Gio.SettingsBindFlags.DEFAULT);

        rowMode.add_suffix(dropdown);
        rowMode.activatable_widget = dropdown;

        // Trim String
        const rowString = new Adw.ActionRow({
            title: "Trim String",
            subtitle: "Additionally strip a string",
        });
        group.add(rowString);

        const entry = new Gtk.Entry({
            text: settings.get_string("trim-string"),
            valign: Gtk.Align.CENTER,
            hexpand: true,
        });

        settings.bind("trim-string", entry, "text", Gio.SettingsBindFlags.DEFAULT);

        rowString.add_suffix(entry);
        rowString.activatable_widget = entry;

        window.add(page);
    }
}
