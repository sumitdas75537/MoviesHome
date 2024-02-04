import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Appv1 from './App - v1';
import StarRating from './StarRating';
import './custom.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
function Test() {
  const [movieRating, setMovieRating] = useState(0)
  return (
    <div>
      <StarRating color='blue' maxRating={12} onSetRating={setMovieRating} />
      <p>The movie is rated {movieRating}</p>
    </div>
  )
}
root.render(
  <React.StrictMode>
    <Appv1 />

    {/* <StarRating className="customfont" messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]} />
    <StarRating defaultRating={3} color='green' />
    <Test /> */}
  </React.StrictMode>
);
