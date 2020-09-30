import React, { Component } from 'react';
import * as WebMidi from "webmidi";
import Tone from 'tone'
import Note from './Note'
const meow = require('../sounds/meow.wav')
const bark = require('../sounds/bark.wav')
const CAT1 = '/cat-1.png';
const CAT2 = '/cat-2.png';
const CAT3 = '/cat-3.png';
const CAT4 = '/cat-4.png';
const CAT5 = '/cat-5.png';
const CAT6 = '/cat-6.png';
const CAT7 = '/cat-7.png';
const CAT8 = '/cat-8.png';
const CAT9 = '/cat-9.jpg';
const CAT10 = '/cat-10.jpg';
const CAT11 = '/cat-11.jpg';
const CAT12 = '/cat-12.jpg';
const CAT13 = '/cat-13.jpg';
const CAT14 = '/cat-14.jpeg';
const CAT15 = '/cat-15.jpg';
const CAT16 = '/cat-16.jpg';
const DOG1 = '/dog1.jpg';
const DOG2 = '/dog2.jpg';
const DOG3 = '/dog3.png';
const DOG4 = '/dog4.png';
const DOG5 = '/dog5.jpg';
const DOG6 = '/dog6.png';
const DOG7 = '/dog7.jpeg';
const DOG8 = '/dog8.jpg';
const DOG9 = '/dog9.jpg';
const DOG10 = '/dog10.jpg';
const DOG11 = '/dog11.jpg';
const DOG12 = '/dog12.jpeg';
const DOG13 = '/dog13.jpg';
const DOG14 = '/dog14.jpg';
const DOG15 = '/dog15.jpg';
const DOG16 = '/dog16.jpg';

class MidiBoard extends Component {
  synth = null;
  state = {
    synth: 0,
    notes: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false]
    ]
  };

  imageMap = {
    0: [
      [CAT1, CAT2, CAT3, CAT4],
      [CAT5, CAT6, CAT7, CAT8],
      [CAT9, CAT10, CAT11, CAT12],
      [CAT13, CAT14, CAT15, CAT16]
    ],
    1: [
      [DOG1, DOG2, DOG3, DOG4],
      [DOG5, DOG6, DOG7, DOG8],
      [DOG9, DOG10, DOG11, DOG12],
      [DOG13, DOG14, DOG15, DOG16]
    ],
    2: [
      [CAT1, CAT2, CAT3, CAT4],
      [CAT5, CAT6, CAT7, CAT8],
      [CAT9, CAT10, CAT11, CAT12],
      [CAT13, CAT14, CAT15, CAT16]
    ],
    3: [
      [CAT1, CAT2, CAT3, CAT4],
      [CAT5, CAT6, CAT7, CAT8],
      [CAT9, CAT10, CAT11, CAT12],
      [CAT13, CAT14, CAT15, CAT16]
    ]
  };

  noteMap = {
    // Board 1
    C3: [0, 0, 'D3#'],
    'C#3': [0, 1, 'G3'],
    D3: [0, 2, 'A3#'],
    'D#3': [0, 3, 'A2#'],

    'G#2': [1, 0, 'C3'],
    A2: [1, 1, 'G2'],
    'A#2': [1, 2, null],
    B2: [1, 3, null],

    E2: [2, 0, null],
    F2: [2, 1, null],
    'F#2': [2, 2, null],
    G2: [2, 3, null],

    C2: [3, 0, 'C2'],
    'C#2': [3, 1, 'D#2'],
    D2: [3, 2, 'F2'],
    'D#2': [3, 3, 'G2'],

    // Board 2
    E4: [0, 0, 'D3#'],
    F4: [0, 1, 'G3'],
    "F#4": [0, 2, 'A3#'],
    'G4': [0, 3, 'A2#'],

    'C4': [1, 0, 'C3'],
    'C#4': [1, 1, 'G2'],
    'D4': [1, 2, null],
    "D#4": [1, 3, null],

    "G#3": [2, 0, null],
    A3: [2, 1, null],
    'A#3': [2, 2, null],
    B3: [2, 3, null],

    E3: [3, 0, 'C2'],
    'F3': [3, 1, 'D#2'],
    "F#3": [3, 2, 'F2'],
    'G3': [3, 3, 'G2']
  };

  componentDidMount() {
    Tone.context.latencyHint = 'fastest';
    Tone.start();

    const synth1 = new Tone.Sampler(
      {
        C3: meow
      },
      {
        attack: 0,
        release: 0.05
      }
    ).toMaster();
    const synth2 = new Tone.Sampler(
      {
        C3: bark
      },
      {
        attack: 0,
        release: 1
      }
    ).toMaster();
    this.synths = [synth1, synth2, synth1, synth1];

    WebMidi.enable(err => {
      if (err) {
        console.log('WebMidi could not be enabled.', err);
      } else {
        console.log('WebMidi enabled!');

        const input = WebMidi.inputs[0];
        input.addListener('noteon', 'all', this.handleInputOn);
        input.addListener('noteoff', 'all', this.handleInputOff);
      }
    });
  }

  handleInputOn = e => {
    const note = e.note.name + e.note.octave;
    switch (note) {
      case 'C-1':
        this.setState({ synth: 0 });
        break;
      case 'C#-1':
        this.setState({ synth: 1 });
        break;
      case 'D-1':
        this.setState({ synth: 2 });
        break;
      case 'D#-1':
        this.setState({ synth: 3 });
        break;
      default:
        this.setNote(e.note.name + e.note.octave, true);
    }
  };

  handleInputOff = e => {
    this.setNote(e.note.name + e.note.octave, false);
  };

  setNote = (note, enabled) => {
    if (!this.noteMap[note]) return;
    const [i, j, alt] = this.noteMap[note];
    const notes = [...this.state.notes];
    notes[i][j] = enabled;
    if (enabled) {
      this.synths[this.state.synth].triggerAttack(alt || note);
    } else {
      this.synths[this.state.synth].triggerRelease();
    }
    setTimeout(() => {
      this.setState({ notes });
    }, 0);
  };

  render() {
    return (
      <div className={`synth--${this.state.synth}`}>
        {this.state.notes.map((row, i) => (
          <div>
            {row.map((on, j) => (
              <Note
                on={on}
                image={this.imageMap[this.state.synth][i][j]}
                i={i}
                j={j}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default MidiBoard;
