import React from 'react';
import {Link} from 'react-router-dom';

function Home() {
  return (
    <>
      <h1>Have Fun with GOPIZZA Gobot</h1>
      <p>
        Thank you for visiting GOPIZZA Gobot Station POP-UP Store Push a one of
        3-buttons on the screen and Enjoy Gobot right now!
      </p>
      <div>
        <Link to="/drizzle">Drizzle &amp; Powder</Link>
        <Link to="/extra">Extra Sauce</Link>
        <Link to="/rockpaper">Enjoy Games</Link>
      </div>
    </>
  );
}

export default Home;
