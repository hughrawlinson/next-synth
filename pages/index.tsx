import Head from 'next/head'
import { useSynth, isLoadedSynth } from '../lib/useSynth';
import { SynthParam } from '../lib/synth';

function OscillatorTypeSelector({ param }: { param: SynthParam<OscillatorType> }) {
  return <select onChange={(event) => {
    param.setValue(event.target.value as OscillatorType)
  }}>
    <option value="sawtooth">Sawtooth</option>
    <option value="square">Square</option>
    <option value="triangle">Triangle</option>
    <option value="sin">Sine</option>
  </select>
}

export default function Home() {
  const synth = useSynth();

  if (!isLoadedSynth(synth)) {
    return <>
      <Head><title>Loading...</title></Head>
      <h1>Loading....</h1>
    </>
  }
  else {
    return (
      <>
        <Head><title>The Synthesizer</title></Head>
        <h1>The Synthesizer</h1>
        <button onClick={() => synth.playNote({ note: 50 + Math.floor(Math.random() * 24), velocity: 127, duration: 1 })}>Play Note</button>
        <pre>
          <code>
            {JSON.stringify(synth.params, null, 2)}
          </code>
        </pre>
        <OscillatorTypeSelector param={synth.params['oscillator1type']} />
        <OscillatorTypeSelector param={synth.params['oscillator2type']} />
      </>
    )
  }
}
