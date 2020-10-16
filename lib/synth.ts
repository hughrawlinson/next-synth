type SynthBaseArgs = {
  audioContext: AudioContext
}

type SynthVoiceArgs = SynthBaseArgs & {
  note: Note
}

class SynthVoice {
  audioContext: AudioContext;
  oscillator: OscillatorNode;
  gain: GainNode;
  note: Note;

  constructor({ audioContext, note }: SynthVoiceArgs) {
    this.audioContext = audioContext;
    this.note = note;
    this.oscillator = audioContext.createOscillator();
    this.oscillator.frequency.value = Math.pow(2, (note.note - 69) / 12) * 440;
    this.gain = audioContext.createGain();
    this.gain.gain.value = 1;
    this.oscillator.connect(this.gain);
    this.gain.connect(audioContext.destination)
  }

  start() {
    this.oscillator.start();

    if (this.note.duration) {
      this.oscillator.stop(this.note.duration + this.audioContext.currentTime);
    }
  }

  stop() {
    this.oscillator.stop();
  }
}

type SynthArgs = {
  audioContext?: AudioContext
}

export type Note = {
  note: number,
  velocity: number,
  duration?: number
}

export class Synth {
  voicesInFlight: SynthVoice[] = [];
  audioContext: AudioContext;

  constructor({ audioContext }: SynthArgs) {
    this.audioContext = audioContext || new AudioContext();
    this.voicesInFlight = [];
  }

  getAudioContext() {
    return this.audioContext;
  }

  playNote(note: Note) {
    console.log("Playing note: ", note)
    const voice = new SynthVoice({ audioContext: this.audioContext, note });
    this.voicesInFlight.push(voice);
    voice.start();
    return voice;
  }

  panic() {
    this.voicesInFlight.forEach(note => {
      note.stop();
    });
    this.voicesInFlight = [];
  }
}