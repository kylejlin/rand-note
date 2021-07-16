import React from "react";
import "./App.css";
import {
  State,
  NoteName,
  getPossibleRandomNextNotes,
  nameStrings,
  getRandomNote,
  Settings,
  NoteDisplayStyle,
  getNotationWithLetters,
  getNotationWithoutLetters,
  Pitch,
  pitchToNoteNames,
  nameString,
  getOctave,
  NoteNameEquivalenceRelation,
} from "./businessLogic";
import {
  loadSettings,
  loadNoteHistory,
  saveSettings,
  saveNoteHistory,
} from "./persistentState";
import { Notation } from "react-abc";
import { BorderedFittedSection } from "./components/BorderedFittedSection";
import { IndentedSection } from "./components/IndentedSection";

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
    this.onEqRelIsOctaveSensitiveChange =
      this.onEqRelIsOctaveSensitiveChange.bind(this);
    this.onEqRelNameEqRelChange = this.onEqRelNameEqRelChange.bind(this);
    this.onDisplayEquivalentNoteNamesChange =
      this.onDisplayEquivalentNoteNamesChange.bind(this);
    this.onDisplayOctaveChange = this.onDisplayOctaveChange.bind(this);
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
            Display equivalent note names
          </label>
          <label className="Setting Setting--checkbox">
            <input
              type="checkbox"
              checked={this.state.settings.displayOctave}
              onChange={this.onDisplayOctaveChange}
            />
            Display octave
          </label>
          <BorderedFittedSection>
            <label>Display style</label>
            <select
              className="Dropdown__Input"
              value={this.state.settings.sampleDisplayStyle}
              onChange={this.onNoteDisplayStyleChange}
            >
              <option value={NoteDisplayStyle.Letters}>Letters</option>
              <option value={NoteDisplayStyle.Staff}>Staff</option>
              <option value={NoteDisplayStyle.StaffAndLetters}>
                Staff and letters
              </option>
            </select>
          </BorderedFittedSection>
          <BorderedFittedSection>
            <header>Note equivalence</header>
            <IndentedSection>
              <BorderedFittedSection>
                <label className="Setting Setting--checkbox Setting--no-top-margin">
                  <input
                    type="checkbox"
                    checked={
                      this.state.settings.equivalenceRelation.isOctaveSensitive
                    }
                    onChange={this.onEqRelIsOctaveSensitiveChange}
                  />
                  Octave sensitive
                </label>
              </BorderedFittedSection>
              <BorderedFittedSection>
                <label>Note name equivalence</label>
                <select
                  className="Dropdown__Input"
                  value={this.state.settings.equivalenceRelation.nameEqRel}
                  onChange={this.onEqRelNameEqRelChange}
                >
                  <option value={NoteNameEquivalenceRelation.Reflexive}>
                    By name
                  </option>
                  <option value={NoteNameEquivalenceRelation.ByPitch}>
                    By pitch
                  </option>
                  <option value={NoteNameEquivalenceRelation.ByLetter}>
                    By letter
                  </option>
                </select>
              </BorderedFittedSection>
            </IndentedSection>
          </BorderedFittedSection>
          <table className="SettingsTable">
            <tbody>
              <tr>
                <td>
                  <span className="ForceNewline">Lowest</span>
                  <span className="ForceNewline">pitch:</span>
                </td>
                <td>
                  <input
                    type="range"
                    min={Pitch.E2}
                    max={Pitch.E6}
                    value={this.state.settings.minPitch}
                    onChange={this.onMinPitchChange}
                  />
                </td>
                <td>
                  {pitchToNoteNames(this.state.settings.minPitch)
                    .map(nameString)
                    .join("/") + getOctave(this.state.settings.minPitch)}
                </td>
              </tr>
              <tr>
                <td>
                  <span className="ForceNewline">Highest</span>
                  <span className="ForceNewline">pitch:</span>
                </td>
                <td>
                  <input
                    type="range"
                    min={Pitch.E2}
                    max={Pitch.E6}
                    value={this.state.settings.maxPitch}
                    onChange={this.onMaxPitchChange}
                  />
                </td>
                <td>
                  {pitchToNoteNames(this.state.settings.maxPitch)
                    .map(nameString)
                    .join("/") + getOctave(this.state.settings.maxPitch)}
                </td>
              </tr>
            </tbody>
          </table>
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

  onEqRelIsOctaveSensitiveChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    this.setState((prevState) => {
      const newSettings: Settings = {
        ...prevState.settings,
        equivalenceRelation: {
          ...prevState.settings.equivalenceRelation,
          isOctaveSensitive: event.target.checked,
        },
      };
      saveSettings(newSettings);
      return {
        ...prevState,
        settings: newSettings,
      };
    });
  }

  onEqRelNameEqRelChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    const n = parseInt(event.target.value, 10);
    if (n in NoteNameEquivalenceRelation) {
      this.setState((prevState) => {
        const newSettings: Settings = {
          ...prevState.settings,
          equivalenceRelation: {
            ...prevState.settings.equivalenceRelation,
            nameEqRel: n,
          },
        };
        saveSettings(newSettings);
        return {
          ...prevState,
          settings: newSettings,
        };
      });
    }
  }

  onDisplayEquivalentNoteNamesChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    this.updateSetting("displayEquivalentNoteNames", event.target.checked);
  }

  onDisplayOctaveChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.updateSetting("displayOctave", event.target.checked);
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

  updateSetting<K extends keyof Settings>(
    setting: K,
    value: Settings[K]
  ): void {
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
                    equivalenceRelation.nameEqRel,
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
                    equivalenceRelation.nameEqRel,
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
                  ? getNotationWithLetters(
                      this.state.history,
                      this.state.settings
                    )
                  : getNotationWithoutLetters(
                      this.state.history,
                      this.state.settings
                    )
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

  componentDidUpdate() {
    console.log("u");
    const svg = document.querySelector("svg");
    if (svg === null) {
      return;
    }
    const oldViewBox = svg.getAttribute("viewBox");
    if ("string" === typeof oldViewBox && oldViewBox.length > 0) {
      return;
    }

    // This type cast is not sound (i.e., the value could be null),
    // but `parseInt` can safely accept `null` (it correctly returns `NaN`).
    const width = parseInt(svg.getAttribute("width") as string);
    if (isNaN(width)) {
      return;
    }
    // Again, this type cast is also not sound (i.e., the value could be null),
    // but `parseInt` can safely accept `null` (it correctly returns `NaN`).
    const height = parseInt(svg.getAttribute("height") as string);
    if (isNaN(height)) {
      return;
    }

    const box = svg.getBoundingClientRect();
    const trueRight = box.left + width;

    const { innerWidth: windowWidth } = window;
    if (trueRight > windowWidth) {
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.setAttribute("width", "" + (windowWidth - box.left));
    }
  }
}
