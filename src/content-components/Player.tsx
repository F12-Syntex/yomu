import '../stylings/content/empty.css';

export default function player(props: {url: string}) {  

  return (
    <>
        <iframe src={props.url} allowFullScreen></iframe>
    </>
  );
}
