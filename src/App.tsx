import React from "react";
import "./App.css";
import {
  State,
  Note,
  getPool,
  noteStrings,
  getSample,
  Settings,
  SampleEquivalenceRelation,
  NoteDisplayStyle as SampleDisplayStyle,
  sampleEqRelToNoteEqRel,
  doesDisplayPitch,
  isOctaveSensitive,
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
    this.onSampleDisplayStyleChange =
      this.onSampleDisplayStyleChange.bind(this);
    this.onSampleEquivalenceRelationChange =
      this.onSampleEquivalenceRelationChange.bind(this);
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
            Display style
            <select
              value={this.state.settings.sampleDisplayStyle}
              onChange={this.onSampleDisplayStyleChange}
            >
              <option
                value={SampleDisplayStyle.Letters}
                disabled={octaveSensitive}
              >
                Letters
              </option>
              <option value={SampleDisplayStyle.Staff}>Staff</option>
              <option value={SampleDisplayStyle.StaffAndLetters}>
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
            Sample equivalence relation
            <select
              value={this.state.settings.equivalenceRelation}
              onChange={this.onSampleEquivalenceRelationChange}
            >
              <option value={SampleEquivalenceRelation.ByNameModuloOctave}>
                By name modulo octave (default)
              </option>
              <option value={SampleEquivalenceRelation.ByPitchModuloOctave}>
                By pitch modulo octave
              </option>
              <option value={SampleEquivalenceRelation.ByLetter}>
                By letter
              </option>
              <option
                value={SampleEquivalenceRelation.ByPitch}
                disabled={!displaysPitch}
              >
                By pitch (octave sensitive)
              </option>
              <option
                value={SampleEquivalenceRelation.Reflexive}
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

  onSampleDisplayStyleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const n = parseInt(event.target.value, 10);
    if (n in SampleDisplayStyle) {
      this.updateSetting(
        "sampleDisplayStyle",
        n as unknown as SampleDisplayStyle
      );
    }
  }

  onSampleEquivalenceRelationChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const n = parseInt(event.target.value, 10);
    if (n in SampleEquivalenceRelation) {
      this.updateSetting(
        "equivalenceRelation",
        n as unknown as SampleEquivalenceRelation
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
      this.state.history[this.state.history.length - 1]?.note;
    const { equivalenceRelation, displayEquivalentNotes } = this.state.settings;

    return (
      <div
        className={
          "App" +
          (getPool(this.state.history, this.state.settings).length === 0
            ? " LastNote"
            : "")
        }
        onClick={this.onNoteScreenClick}
      >
        <section>
          <button onClick={this.onOpenSettingsClick}>Settings</button>
          <button onClick={this.onClearHistoryClick}>Reset</button>
        </section>
        {this.state.settings.sampleDisplayStyle ===
        SampleDisplayStyle.Letters ? (
          <>
            <section>
              <h2>Current note</h2>
              {currentNote !== undefined ? (
                <div className="CurrentNote">
                  {noteStrings(
                    currentNote,
                    sampleEqRelToNoteEqRel(equivalenceRelation),
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
                  {noteStrings(
                    sample.note,
                    sampleEqRelToNoteEqRel(equivalenceRelation),
                    displayEquivalentNotes
                  )}
                </div>
              ))}
            </section>
          </>
        ) : (
          <section>TODO</section>
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
      const sample = getSample(prevState.history, prevState.settings);
      const newHistory =
        sample === undefined
          ? prevState.history
          : prevState.history.concat([sample]);
      saveNoteHistory(newHistory);
      return { ...prevState, history: newHistory };
    });
  }
}
