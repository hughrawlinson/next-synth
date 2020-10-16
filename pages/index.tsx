import Head from 'next/head'
import { useSynth } from '../lib/useSynth';

export default function Home() {
  const synth = useSynth();

  if (synth.loading) {
    return <>
      <Head><title>Loading...</title></Head>
      <h1>Loading....</h1>
    </>
  }

  return (
    <>
      <Head><title>The Synthesizer</title></Head>
      <h1>The Synthesizer</h1>
      <button onClick={() => synth.loading == false && synth.playNote({ note: 60, velocity: 127, duration: 1 })}>Play Note</button>
    </>
  )
}
