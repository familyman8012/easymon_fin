import useTimeExceed from '../../hook/useTimeExceed';

function TimeExceed() {
  useTimeExceed(5, '/');
  return (
    <>
      <h1>Drizzle &amp; Powder - Mission 1</h1>
      <p>Input time expired Thank you for using Gobot! See you next time!</p>
    </>
  );
}

export default TimeExceed;
