import { Link } from "react-router-dom";

import files from '../data';

export function Home() {
  return <div style={{ margin: '2rem' }}>
    <h3>Show earth using test file:</h3>
    <ul>
      {Object.keys(files).map((file, i) => <li key={i}>
        <Link to={file}>{file}</Link>
      </li>)}
    </ul>
  </div>
}
