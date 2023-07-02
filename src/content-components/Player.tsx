import * as titleBar from '../components/TitleBar'
import '../stylings/content/player.css'

export default function Player(props: { url: string }) {
  let amountOfTries = 2

  function handleLoad() {
    if (--amountOfTries === 0) {
      titleBar.handleBack()
    }
  }

  return (
    <>
      <iframe src={props.url} allowFullScreen onLoad={handleLoad}></iframe>
    </>
  )
}
