import React from "react";
import "./App.css";
import {
  State,
  Note,
  getPossibleNextNotes,
  noteStrings,
  getRandomNextNote,
  Settings,
  EquivalenceRelation,
} from "./businessLogic";
import {
  loadSettings,
  loadNoteHistory,
  saveSettings,
  saveNoteHistory,
} from "./persistentState";

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
    this.onNoteEquivalenceRelationChange =
      this.onNoteEquivalenceRelationChange.bind(this);
    this.onDisplayEquivalentNotesChange =
      this.onDisplayEquivalentNotesChange.bind(this);

    this.onOpenSettingsClick = this.onOpenSettingsClick.bind(this);
    this.onClearHistoryClick = this.onClearHistoryClick.bind(this);
    this.onNoteScreenClick = this.onNoteScreenClick.bind(this);
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
        <section className="Settings">
          <label className="Setting">
            <input
              type="checkbox"
              checked={this.state.settings.naturalsOnly}
              onChange={this.onNaturalsOnlyChange}
            />
            Naturals only
          </label>
          <label className="Setting">
            <input
              type="checkbox"
              checked={this.state.settings.allowRepeats}
              onChange={this.onAllowRepeatsChange}
            />
            Allow repeats
          </label>
          <label className="Setting">
            <input
              type="checkbox"
              checked={this.state.settings.displayEquivalentNotes}
              onChange={this.onDisplayEquivalentNotesChange}
            />
            Display equivalent notes
          </label>
          <label className="Setting Setting--dropdown">
            Note equivalence relation
            <select
              value={this.state.settings.equivalenceRelation}
              onChange={this.onNoteEquivalenceRelationChange}
            >
              <option value={EquivalenceRelation.ReflexiveOnly}>
                Reflexive only (default)
              </option>
              <option value={EquivalenceRelation.ByPitch}>By pitch</option>
              <option value={EquivalenceRelation.ByLetter}>By letter</option>
            </select>
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

  onNoteEquivalenceRelationChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const n = parseInt(event.target.value, 10);
    if (n in EquivalenceRelation) {
      this.updateSetting(
        "equivalenceRelation",
        n as unknown as EquivalenceRelation
      );
    }
  }

  onDisplayEquivalentNotesChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.updateSetting("displayEquivalentNotes", event.target.checked);
  }

  updateSetting<K extends keyof Settings>(setting: K, value: Settings[K]) {
    this.setState((prevState) => {
      const newSettings = { ...prevState.settings, [setting]: value };
      saveSettings(newSettings);
      return {
        ...prevState,
        settings: newSettings,
      };
    });
  }

  renderNotePage(): React.ReactElement {
    const currentNote: Note | undefined =
      this.state.history[this.state.history.length - 1];
    const { equivalenceRelation, displayEquivalentNotes } = this.state.settings;

    return (
      <div
        className={
          "App" +
          (getPossibleNextNotes(this.state.history, this.state.settings)
            .length === 0
            ? " LastNote"
            : "")
        }
        onClick={this.onNoteScreenClick}
      >
        <section>
          <button onClick={this.onOpenSettingsClick}>Settings</button>
          <button onClick={this.onClearHistoryClick}>Reset</button>
        </section>
        <section>
          <h2>Current note</h2>
          {currentNote !== undefined ? (
            <div className="CurrentNote">
              {noteStrings(
                currentNote,
                equivalenceRelation,
                displayEquivalentNotes
              )}
            </div>
          ) : (
            <div>Tap to generate</div>
          )}
        </section>
        <section>
          {this.state.history.map((note, i) => (
            <div className="HistoryNote" key={i}>
              {noteStrings(note, equivalenceRelation, displayEquivalentNotes)}
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

  onNoteScreenClick(event: React.MouseEvent) {
    if (event.target instanceof HTMLButtonElement) {
      return;
    }

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
