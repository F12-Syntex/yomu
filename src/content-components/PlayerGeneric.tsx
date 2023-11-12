import { useEffect } from 'react';
import '../stylings/content/mangaPane.css';

interface MangaPaneProps {
  url?: string;
}

export default function playerGEneric({ url }: MangaPaneProps) {
  useEffect(() => {
    const webview = document.getElementById('mangapane-webview') as Electron.WebviewTag;
    if (webview === null) {
      return;
    }
  }, []);

  return (
    <>
      <div id='mangapane-content' style={{ overflow: 'hidden' }}>
        <webview src={url} data-home={url} id='mangapane-webview' disableblinkfeatures='OverlayScrollbars'></webview>
      </div>
    </>
  );
}
