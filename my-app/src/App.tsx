import './App.css';
import SmartInstallationForm from './SmartInstalationForm';

function App() {
  return (
    <div className="App">
      <div style={{ textAlign: "center", paddingTop: "32px", paddingBottom: "16px" }}>
        <img
          src="logo.png"
          alt="Logo"
          style={{ height: "180px", marginBottom: "12px" }}
        />
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "500", color: "#333" }}>
          Zużycie Prądu
        </h1>
      </div>

      <div className="background-wrapper">
        <SmartInstallationForm />
      </div>
      <div className="bottom-decoration" />
    </div>
  );
}

export default App;
