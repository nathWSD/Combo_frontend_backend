import CardList from "./CardList";

const Fahrzeuge = () => {
  return (
    <div className="fahrzeugeListe" style={{ height: '100%', overflowY: 'auto' }}>
      <h1>Lists of Cars</h1>
      <CardList />
    </div>
  );
};

export default Fahrzeuge;
