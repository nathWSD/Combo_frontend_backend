import React from 'react';

const Tarif = () => {
  return (
    <div class="contenair">
      <header link rel='stylesheet' href="tarif.css">
      <video autoPlay loop muted playsInline class="video">
        <source url='https://cdn.create.vista.com/api/media/medium/93280772/stock-video-happy-couple-driving-on-country?token=' type='video/mp4'/>

      </video>
      <h1>Tarif</h1>
      <hr />
      <h3>Basis</h3>
      <br />
      <table>
        <tr>
          <th>Tarif</th>
          <th>Tarifverstrag pro Monat</th>
        </tr>

        <tr>
          <td>Basis</td>
          <td>ab 109€</td>
        </tr>
        <p>Sie zahlen nur, wenn Sie Auto fahren. Keine Grundgebühr.</p>
        <hr />
        <h3>Aktiv</h3>
        <tr>
          <th>Tarif</th>
          <th>Tarifverstrag pro Monat</th>
        </tr>

        <tr>
          <td>Aktiv</td>
          <td>ab 200€</td>
        </tr>
        <p>Für fast alle.</p>
        <p>Optionale für 60-250km pro Monat. Ob Einkauf oder Kurztrip.</p>
        <hr />
        <h3>Komfort</h3>
        <tr>
          <th>Tarif</th>
          <th>Tarifverstrag pro Monat</th>
        </tr>

        <tr>
          <td>Komfort</td>
          <td>ab 350€</td>
        </tr>
        <p>Für Vielfahrende.</p>
        <p>Günstigere Kilometerpreise. Für häufige oder lange Fahrten.</p>
      </table>
      </header>
    </div>
  );
};

export default Tarif;