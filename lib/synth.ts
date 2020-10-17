type OscillatorType = "custom" | "sawtooth" | "sine" | "square" | "triangle";

type SynthBaseArgs = {
  audioContext: AudioContext
}

type SynthVoiceArgs = SynthBaseArgs & {
  note: Note
  params: typeof params
}

function midiToFrequency(midiNote: number): number {
  return Math.pow(2, (midiNote - 69) / 12) * 440;
}

class SynthVoice {
  audioContext: AudioContext;
  oscillator1: OscillatorNode;
  oscillator2: OscillatorNode;
  gain: GainNode;
  limitGain: GainNode;
  note: Note;

  constructor({ audioContext, note, params }: SynthVoiceArgs) {
    this.audioContext = audioContext;
    this.note = note;
    this.oscillator1 = audioContext.createOscillator();
    params.oscillator1type.addEventListener((oscillatorType) => {
      this.oscillator1.type = oscillatorType;
    })
    this.oscillator1.frequency.value = midiToFrequency(note.note);
    this.oscillator2 = audioContext.createOscillator();
    params.oscillator2type.addEventListener((oscillatorType) => {
      this.oscillator2.type = oscillatorType;
    })
    this.oscillator2.frequency.value = midiToFrequency(note.note - 12);
    this.gain = audioContext.createGain();
    this.gain.gain.value = 1;
    this.limitGain = audioContext.createGain();
    this.limitGain.gain.value = 0.3;
    this.oscillator1.connect(this.gain);
    this.oscillator2.connect(this.gain);
    this.gain.connect(this.limitGain);
    this.limitGain.connect(this.audioContext.destination);
  }

  start() {
    this.oscillator1.start();
    this.oscillator2.start();

    if (this.note.duration) {
      this.oscillator1.stop(this.note.duration + this.audioContext.currentTime);
      this.oscillator2.stop(this.note.duration + this.audioContext.currentTime);
    }
  }

  stop() {
    this.oscillator1.stop();
    this.oscillator2.stop();
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

type SynthParamConstructorArgs<T> = {
  initialValue: T
}

export class SynthParam<T> {
  value: T;
  eventListeners: ((_: T) => void)[] = []

  constructor({ initialValue }: SynthParamConstructorArgs<T>) {
    this.value = initialValue;
  }

  addEventListener(eventListener: (_: T) => void) {
    this.eventListeners.push()
    eventListener(this.value);
    return this.eventListeners.length - 1;
  }

  removeEventListener(index: number) {
    this.eventListeners.splice(index, 1);
  }

  getValue() {
    return this.value;
  }

  setValue(v: T) {
    this.value = v;
    this.eventListeners.forEach(eventListener => {
      eventListener(this.value);
    });
  }
}

const params = {
  'oscillator1type': new SynthParam<OscillatorType>({ initialValue: "sawtooth" }),
  'oscillator2type': new SynthParam<OscillatorType>({ initialValue: "sawtooth" })
} as const;

export type Params = typeof params;

export class Synth {
  voicesInFlight: SynthVoice[] = [];
  audioContext: AudioContext;
  params: typeof params = params;
  constructor({ audioContext }: SynthArgs) {
    this.audioContext = audioContext || new AudioContext();
    this.voicesInFlight = [];
  }

  getAudioContext() {
    return this.audioContext;
  }

  playNote(note: Note) {
    console.log("Playing note: ", note)
    const voice = new SynthVoice({ audioContext: this.audioContext, note, params: this.params });
    this.voicesInFlight.push(voice);
    voice.start();
    return voice;
  }

  getParams() {
    return this.params;
  }

  panic() {
    this.voicesInFlight.forEach(note => {
      note.stop();
    });
    this.voicesInFlight = [];
  }
}