import "./App.css";
import SmartInstallationForm from "./SmartInstalationForm";

function App() {
  return (
    <div className="App">
      <div
        style={{
          textAlign: "center",
          paddingTop: "32px",
          paddingBottom: "16px",
        }}
      >
        <h1>Zużycie energii</h1>
      </div>

      <div className="background-wrapper">
        <SmartInstallationForm />
      </div>
      <div className="bottom-decoration" />
    </div>
  );
}

export default App;
