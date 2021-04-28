import React from "react";
import "./App.css";
import {
  State,
  Note,
  getPossibleNextNotes,
  noteStrings,
  getRandomNextNote,
  Settings,
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
    this.onDistinctSharpsAndFlatsChange = this.onDistinctSharpsAndFlatsChange.bind(
      this
    );

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
    const currentNote: Note | undefined = this.state.history[
      this.state.history.length - 1
    ];
    const { distinctSharpsAndFlats } = this.state.settings;

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
