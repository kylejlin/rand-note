import React from "react";
import "./App.css";

export default class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isSettingsOpen: false,
      settings: loadSettings(),
      history: loadNoteHistory(),
    };

    this.bindMethods();
  }

  bindMethods() {
    this.onCloseSettingsClick = this.onCloseSettingsClick.bind(this);
    this.onNaturalsOnlyChange = this.onNaturalsOnlyChange.bind(this);
    this.onAllowRepeatsChange = this.onAllowRepeatsChange.bind(this);
    this.onDistinctSharpsAndFlatsChange = this.onDistinctSharpsAndFlatsChange.bind(
      this
    );

    this.onOpenSettingsClick = this.onOpenSettingsClick.bind(this);
    this.onClearHistoryClick = this.onClearHistoryClick.bind(this);
    this.onNextNoteClick = this.onNextNoteClick.bind(this);
  }

  render() {
    if (this.state.isSettingsOpen) {
      return this.renderSettingsPage();
    } else {
      return this.renderNotePage();
    }
  }

  renderSettingsPage(): React.ReactElement {
    return (
      <div className="App">
        <section>
          <button onClick={this.onCloseSettingsClick}>Close</button>
        </section>
        <section>
          <label>
            Naturals only:{" "}
            <input
              type="checkbox"
              checked={this.state.settings.naturalsOnly}
              onChange={this.onNaturalsOnlyChange}
            />
          </label>
          <label>
            Allow repeats:{" "}
            <input
              type="checkbox"
              checked={this.state.settings.allowRepeats}
              onChange={this.onAllowRepeatsChange}
            />
          </label>
          <label>
            Distinct sharps and flats:{" "}
            <input
              type="checkbox"
              checked={this.state.settings.distinctSharpsAndFlats}
              onChange={this.onDistinctSharpsAndFlatsChange}
            />
          </label>
        </section>
      </div>
    );
  }

  onCloseSettingsClick() {
    this.setState({ isSettingsOpen: false });
  }

  onNaturalsOnlyChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.updateSetting("naturalsOnly", event.target.checked);
  }

  onAllowRepeatsChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.updateSetting("allowRepeats", event.target.checked);
  }

  onDistinctSharpsAndFlatsChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.updateSetting("distinctSharpsAndFlats", event.target.checked);
  }

  updateSetting<K extends keyof Settings>(setting: K, value: Settings[K]) {
    this.setState((prevState) => ({
      ...prevState,
      settings: { ...prevState.settings, [setting]: value },
    }));
  }

  renderNotePage(): React.ReactElement {
    const currentNote: Note | undefined = this.state.history[
      this.state.history.length - 1
    ];
    const { distinctSharpsAndFlats } = this.state.settings;

    return (
      <div className="App">
        <section>
          <button onClick={this.onOpenSettingsClick}>Settings</button>
          <button onClick={this.onClearHistoryClick}>Reset</button>
        </section>
        <section
          onClick={this.onNextNoteClick}
          className={
            getPossibleNextNotes(this.state.history, this.state.settings)
              .length === 0
              ? "LastNote"
              : ""
          }
        >
          <h2>Current note</h2>
          {currentNote !== undefined && (
            <div className="CurrentNote">
              {noteStrings(currentNote, distinctSharpsAndFlats)}
            </div>
          )}
        </section>
        <section>
          {this.state.history.map((note) => (
            <div className="HistoryNote">
              {noteStrings(note, distinctSharpsAndFlats)}
            </div>
          ))}
        </section>
      </div>
    );
  }

  onOpenSettingsClick() {
    this.setState({ isSettingsOpen: true });
  }

  onClearHistoryClick() {
    this.setState({ history: [] });
    saveNoteHistory([]);
  }

  onNextNoteClick() {
    this.setState((prevState) => {
      const nextNote = getRandomNextNote(prevState.history, prevState.settings);
      const newHistory =
        nextNote === undefined
          ? prevState.history
          : prevState.history.concat([nextNote]);
      saveNoteHistory(newHistory);
      return { ...prevState, history: newHistory };
    });
  }
}

interface State {
  isSettingsOpen: boolean;
  settings: Settings;
  history: Note[];
}

interface Settings {
  naturalsOnly: boolean;
  allowRepeats: boolean;
  distinctSharpsAndFlats: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  naturalsOnly: true,
  allowRepeats: false,
  distinctSharpsAndFlats: true,
};

enum Note {
  A,
  ASharp,
  BFlat,
  B,
  C,
  CSharp,
  DFlat,
  D,
  DSharp,
  EFlat,
  E,
  F,
  FSharp,
  GFlat,
  G,
  GSharp,
  AFlat,
}

enum Natural {
  A,
  B,
  C,
  D,
  E,
  F,
  G,
}

enum Modification {
  None,
  Sharp,
  Flat,
}

function natural(note: Note): Natural {
  switch (note) {
    case Note.A:
      return Natural.A;
    case Note.ASharp:
      return Natural.A;
    case Note.AFlat:
      return Natural.A;

    case Note.B:
      return Natural.B;
    case Note.BFlat:
      return Natural.B;

    case Note.C:
      return Natural.C;
    case Note.CSharp:
      return Natural.C;

    case Note.DFlat:
      return Natural.D;
    case Note.D:
      return Natural.D;
    case Note.DSharp:
      return Natural.D;

    case Note.EFlat:
      return Natural.E;
    case Note.E:
      return Natural.E;

    case Note.F:
      return Natural.F;
    case Note.FSharp:
      return Natural.F;

    case Note.GFlat:
      return Natural.G;
    case Note.G:
      return Natural.G;
    case Note.GSharp:
      return Natural.G;
  }
}

function modification(note: Note): Modification {
  switch (note) {
    case Note.A:
    case Note.B:
    case Note.C:
    case Note.D:
    case Note.E:
    case Note.F:
    case Note.G:
      return Modification.None;

    case Note.ASharp:
    case Note.CSharp:
    case Note.DSharp:
    case Note.FSharp:
    case Note.GSharp:
      return Modification.Sharp;

    case Note.AFlat:
    case Note.BFlat:
    case Note.DFlat:
    case Note.EFlat:
    case Note.GFlat:
      return Modification.Flat;
  }
}

/**
  * Non-natural notes have two names (e.g., C sharp and D flat).
  * If the provided note is not natural, the other name will be returned.
  * If it is natural, the original note will be returned.

  * ## Example
  * ```typescript
  * assert(Note.DFlat === alternativeName(Note.CSharp));
  * assert(Note.C === alternativeName(Note.C));
  * ```
  */
function alternativeName(note: Note): Note {
  switch (note) {
    case Note.AFlat:
      return Note.GSharp;
    case Note.ASharp:
      return Note.BFlat;
    case Note.BFlat:
      return Note.ASharp;
    case Note.CSharp:
      return Note.DFlat;
    case Note.DFlat:
      return Note.CSharp;
    case Note.DSharp:
      return Note.EFlat;
    case Note.EFlat:
      return Note.DSharp;
    case Note.FSharp:
      return Note.GFlat;
    case Note.GFlat:
      return Note.FSharp;
    case Note.GSharp:
      return Note.ASharp;

    case Note.A:
    case Note.B:
    case Note.C:
    case Note.D:
    case Note.E:
    case Note.F:
    case Note.G:
      return note;
  }
}

enum LocalStorageKey {
  Settings = "RandNote.Settings",
  NoteHistory = "RandNote.NoteHistory",
}

function loadSettings(): Settings {
  const s = localStorage.getItem(LocalStorageKey.Settings);
  if (s === null) {
    return DEFAULT_SETTINGS;
  }

  try {
    const parsed = JSON.parse(s);
    if (isValidSettings(parsed)) {
      return parsed;
    }
  } catch {}

  return DEFAULT_SETTINGS;
}

function isValidSettings(x: unknown): x is Settings {
  return (
    "object" === typeof x &&
    x !== null &&
    "boolean" === typeof (x as any).naturalsOnly &&
    "boolean" === typeof (x as any).allowRepeats &&
    "boolean" === typeof (x as any).distinctSharpsAndFlats
  );
}

function loadNoteHistory(): Note[] {
  const s = localStorage.getItem(LocalStorageKey.NoteHistory);
  if (s === null) {
    return [];
  }

  try {
    const parsed = JSON.parse(s);
    if (isValidNoteList(parsed)) {
      return parsed;
    }
  } catch {}

  return [];
}

function isValidNoteList(x: unknown): x is Note[] {
  return Array.isArray(x) && x.every(isNote);
}

function isNote(x: unknown): x is Note {
  return "number" === typeof Note[x as any];
}

function saveNoteHistory(history: Note[]) {
  const s = JSON.stringify(history);
  localStorage.setItem(LocalStorageKey.NoteHistory, s);
}

function noteStrings(note: Note, distinctSharpsAndFlats: boolean): string {
  const alt = alternativeName(note);
  if (alt === note || distinctSharpsAndFlats) {
    return noteString(note);
  } else {
    return noteString(note) + "/" + noteString(alt);
  }
}

function noteString(note: Note): string {
  return naturalString(natural(note)) + modificationString(modification(note));
}

function naturalString(nat: Natural): string {
  return Natural[nat];
}

function modificationString(mod: Modification): string {
  switch (mod) {
    case Modification.None:
      return "";
    case Modification.Sharp:
      return "♯";
    case Modification.Flat:
      return "♭";
  }
}

function getRandomNextNote(prev: Note[], settings: Settings): undefined | Note {
  const possibleNextNotes = getPossibleNextNotes(prev, settings);
  return randomElement(possibleNextNotes);
}

function getPossibleNextNotes(prev: Note[], settings: Settings): Note[] {
  let possible = [
    Note.A,
    Note.ASharp,
    Note.BFlat,
    Note.B,
    Note.C,
    Note.CSharp,
    Note.DFlat,
    Note.D,
    Note.DSharp,
    Note.EFlat,
    Note.E,
    Note.F,
    Note.FSharp,
    Note.GFlat,
    Note.G,
    Note.GSharp,
    Note.AFlat,
  ];

  if (settings.naturalsOnly) {
    possible = possible.filter(
      (note) => modification(note) === Modification.None
    );
  }

  if (settings.allowRepeats) {
    return possible;
  }

  if (settings.distinctSharpsAndFlats) {
    possible = possible.filter((note) => !prev.includes(note));
  } else {
    possible = possible.filter(
      (note) => !prev.includes(note) && !prev.includes(alternativeName(note))
    );
  }

  return possible;
}

function randomElement<T>(arr: T[]): undefined | T {
  if (arr.length === 0) {
    return undefined;
  } else {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
