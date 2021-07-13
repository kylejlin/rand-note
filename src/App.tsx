import React from "react";
import "./App.css";
import {
  State,
  NoteName,
  getPossibleRandomNextNotes,
  nameStrings,
  getRandomNote,
  Settings,
  NoteEquivalenceRelation,
  NoteDisplayStyle,
  noteEqRelToNoteNameEqRel,
  doesDisplayPitch,
  isOctaveSensitive,
  getNotationWithLetters,
  getNotationWithoutLetters,
  Pitch,
  pitchToNoteNames,
  nameString,
  getOctave,
} from "./businessLogic";
import {
  loadSettings,
  loadNoteHistory,
  saveSettings,
  saveNoteHistory,
} from "./persistentState";
import { Notation } from "react-abc";

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
    this.onNoteDisplayStyleChange = this.onNoteDisplayStyleChange.bind(this);
    this.onNoteEquivalenceRelationChange =
      this.onNoteEquivalenceRelationChange.bind(this);
    this.onDisplayEquivalentNoteNamesChange =
      this.onDisplayEquivalentNoteNamesChange.bind(this);
    this.onMinPitchChange = this.onMinPitchChange.bind(this);
    this.onMaxPitchChange = this.onMaxPitchChange.bind(this);

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
    const octaveSensitive = isOctaveSensitive(
      this.state.settings.equivalenceRelation
    );
    const displaysPitch = doesDisplayPitch(
      this.state.settings.sampleDisplayStyle
    );
    return (
      <div className="App">
        <section>
          <button onClick={this.onCloseSettingsClick}>Close</button>
        </section>
        <section className="Settings">
          <label className="Setting Setting--checkbox">
            <input
              type="checkbox"
              checked={this.state.settings.naturalsOnly}
              onChange={this.onNaturalsOnlyChange}
            />
            Naturals only
          </label>
          <label className="Setting Setting--checkbox">
            <input
              type="checkbox"
              checked={this.state.settings.allowRepeats}
              onChange={this.onAllowRepeatsChange}
            />
            Allow repeats
          </label>
          <label className="Setting Setting--checkbox">
            <input
              type="checkbox"
              checked={this.state.settings.displayEquivalentNoteNames}
              onChange={this.onDisplayEquivalentNoteNamesChange}
            />
            Display equivalent notes
          </label>
          <label className="Setting Setting--dropdown">
            Display style
            <select
              value={this.state.settings.sampleDisplayStyle}
              onChange={this.onNoteDisplayStyleChange}
            >
              <option
                value={NoteDisplayStyle.Letters}
                disabled={octaveSensitive}
              >
                Letters
              </option>
              <option value={NoteDisplayStyle.Staff}>Staff</option>
              <option value={NoteDisplayStyle.StaffAndLetters}>
                Staff and letters
              </option>
            </select>
            {octaveSensitive && (
              <p>
                (To enable the first option, set your equivalence relation to
                any non-octave-sensitive relation)
              </p>
            )}
          </label>
          <label className="Setting Setting--dropdown">
            Note equivalence relation
            <select
              value={this.state.settings.equivalenceRelation}
              onChange={this.onNoteEquivalenceRelationChange}
            >
              <option value={NoteEquivalenceRelation.ByNameModuloOctave}>
                By name modulo octave (default)
              </option>
              <option value={NoteEquivalenceRelation.ByPitchModuloOctave}>
                By pitch modulo octave
              </option>
              <option value={NoteEquivalenceRelation.ByLetter}>
                By letter
              </option>
              <option
                value={NoteEquivalenceRelation.ByPitch}
                disabled={!displaysPitch}
              >
                By pitch (octave sensitive)
              </option>
              <option
                value={NoteEquivalenceRelation.ByNameAndPitch}
                disabled={!displaysPitch}
              >
                Reflexive (i.e., by pitch and name, octave sensitive)
              </option>
            </select>
            {!displaysPitch && (
              <p>
                (To enable the last two options, set your Display Style to
                "Staff" or "Staff and Letters")
              </p>
            )}
          </label>
          <label className="Setting Setting--slider">
            <span className="Setting__Label">Lowest pitch:</span>
            <input
              type="range"
              min={Pitch.E2}
              max={Pitch.E6}
              value={this.state.settings.minPitch}
              onChange={this.onMinPitchChange}
            />
            <span className="Setting__Label">
              {pitchToNoteNames(this.state.settings.minPitch)
                .map(nameString)
                .join("/") + getOctave(this.state.settings.minPitch)}
            </span>
          </label>
          <label className="Setting Setting--slider">
            <span className="Setting__Label">Highest pitch: </span>
            <input
              type="range"
              min={Pitch.E2}
              max={Pitch.E6}
              value={this.state.settings.maxPitch}
              onChange={this.onMaxPitchChange}
            />
            <span className="Setting__Label">
              {pitchToNoteNames(this.state.settings.maxPitch)
                .map(nameString)
                .join("/") + getOctave(this.state.settings.maxPitch)}
            </span>
          </label>
        </section>
      </div>
    );
  }

  onCloseSettingsClick(): void {
    this.setState({ isSettingsOpen: false });
  }

  onNaturalsOnlyChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.updateSetting("naturalsOnly", event.target.checked);
  }

  onAllowRepeatsChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.updateSetting("allowRepeats", event.target.checked);
  }

  onNoteDisplayStyleChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    const n = parseInt(event.target.value, 10);
    if (n in NoteDisplayStyle) {
      this.updateSetting(
        "sampleDisplayStyle",
        n as unknown as NoteDisplayStyle
      );
    }
  }

  onNoteEquivalenceRelationChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ): void {
    const n = parseInt(event.target.value, 10);
    if (n in NoteEquivalenceRelation) {
      this.updateSetting(
        "equivalenceRelation",
        n as unknown as NoteEquivalenceRelation
      );
    }
  }

  onDisplayEquivalentNoteNamesChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    this.updateSetting("displayEquivalentNoteNames", event.target.checked);
  }

  onMinPitchChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const n = parseInt(event.target.value, 10);
    if (n in Pitch && n <= this.state.settings.maxPitch) {
      this.updateSetting("minPitch", n);
    } else {
      event.preventDefault();
    }
  }

  onMaxPitchChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const n = parseInt(event.target.value, 10);
    if (n in Pitch && n >= this.state.settings.minPitch) {
      this.updateSetting("maxPitch", n);
    } else {
      event.preventDefault();
    }
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
    const currentNote: NoteName | undefined =
      this.state.history[this.state.history.length - 1]?.name;
    const {
      equivalenceRelation,
      displayEquivalentNoteNames: displayEquivalentNotes,
    } = this.state.settings;

    return (
      <div
        className={
          "App" +
          (getPossibleRandomNextNotes(this.state.history, this.state.settings)
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
        {this.state.settings.sampleDisplayStyle === NoteDisplayStyle.Letters ? (
          <>
            <section>
              <h2>Current note</h2>
              {currentNote !== undefined ? (
                <div className="CurrentNote">
                  {nameStrings(
                    currentNote,
                    noteEqRelToNoteNameEqRel(equivalenceRelation),
                    displayEquivalentNotes
                  )}
                </div>
              ) : (
                <div>Tap to generate</div>
              )}
            </section>
            <section>
              {this.state.history.map((sample, i) => (
                <div className="HistoryNote" key={i}>
                  {nameStrings(
                    sample.name,
                    noteEqRelToNoteNameEqRel(equivalenceRelation),
                    displayEquivalentNotes
                  )}
                </div>
              ))}
            </section>
          </>
        ) : (
          <section>
            <Notation
              notation={
                this.state.settings.sampleDisplayStyle ===
                NoteDisplayStyle.StaffAndLetters
                  ? getNotationWithLetters(this.state.history)
                  : getNotationWithoutLetters(this.state.history)
              }
            />
          </section>
        )}
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
      const sample = getRandomNote(prevState.history, prevState.settings);
      const newHistory =
        sample === undefined
          ? prevState.history
          : prevState.history.concat([sample]);
      saveNoteHistory(newHistory);
      return { ...prevState, history: newHistory };
    });
  }
}
