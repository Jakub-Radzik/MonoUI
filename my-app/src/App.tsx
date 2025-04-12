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
      </div>

      <div className="background-wrapper">
        <SmartInstallationForm />
      </div>
      <div className="bottom-decoration" />
    </div>
  );
}

export default App;
