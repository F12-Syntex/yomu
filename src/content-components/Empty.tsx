import '../stylings/content/empty.css'

export default function empty(props: { text: string }) {
  return (
    <>
      <h1 className="empty">{props.text.toUpperCase() + ' PAGE'}</h1>
    </>
  )
}
