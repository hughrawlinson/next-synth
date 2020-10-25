import Head from 'next/head'
import { useSynth, isLoadedSynth } from '../lib/useSynth';
import { SynthParam, OscillatorType, OscillatorTypes } from '../lib/synth';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function OscillatorTypeSelector({ param }: { param: SynthParam<OscillatorType> }) {
  console.log(OscillatorTypes);
  return <select onChange={(event) => {
    param.setValue(event.target.value as OscillatorType)
  }}>
    {OscillatorTypes.map((type) =>
      <option key={type} value={type}>{capitalize(type)}</option>
    )}
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
