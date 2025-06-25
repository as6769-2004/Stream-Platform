import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Host from "./pages/Host";
import Layout from "./components/Layout";
import { auth } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <SignIn onLogin={setUser} />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout user={user}>
              <Home user={user} />
            </Layout>
          }
        />
        <Route
          path="/host"
          element={
            <Layout user={user}>
              <Host user={user} />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
