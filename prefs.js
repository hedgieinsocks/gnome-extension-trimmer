'use strict';


const {Adw, Gio, Gtk} = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;

const trimModes = ['both', 'left', 'right'];


function init() {
}


function fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings();

    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);

    // Trim Mode
    const rowMode = new Adw.ActionRow({
        title: 'Trim Mode',
    });
    group.add(rowMode);

    const dropdown = new Gtk.DropDown({
        valign: Gtk.Align.CENTER,
        model: Gtk.StringList.new(trimModes),
        selected: settings.get_string('trim-mode'),
    });

    settings.bind(
        'trim-mode',
        dropdown,
        'selected',
        Gio.SettingsBindFlags.DEFAULT
    );

    rowMode.add_suffix(dropdown);
    rowMode.activatable_widget = dropdown;

    // Trim String
    const rowString = new Adw.ActionRow({
        title: 'Trim String',
        subtitle: 'Additionally strip a string',
    });
    group.add(rowString);

    const entry = new Gtk.Entry({
        text: settings.get_string('trim-string'),
        valign: Gtk.Align.CENTER,
        hexpand: true,
    });

    settings.bind(
        'trim-string',
        entry,
        'text',
        Gio.SettingsBindFlags.DEFAULT
    );

    rowString.add_suffix(entry);
    rowString.activatable_widget = entry;

    window.add(page);
}
