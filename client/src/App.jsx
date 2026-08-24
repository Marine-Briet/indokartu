import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Accueil from './pages/Accueil';
import Admin from './pages/Admin';
import CartesFiltres from './pages/CartesFiltres';
import CartesSession from './pages/CartesSession';
import TableauDeBord from './pages/TableauDeBord';
import Inscription from './pages/Inscription';
import Connexion from './pages/Connexion';
import MesInfos from './pages/MesInfos';
import MesResultats from './pages/MesResultats';
import ResultatSession from './pages/ResultatSession';
import Vocabulaire from './pages/Vocabulaire';
import NotFound from './pages/NotFound';
import AdminRoute from './routes/AdminRoute';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import { SessionProvider } from './context/SessionContext';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route element={<PublicRoute />}>
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<SessionProvider />}>
          <Route path="/cartes-filtres" element={<CartesFiltres />} />
          <Route path="/cartes-session" element={<CartesSession />} />
          <Route path="/resultat-session" element={<ResultatSession />} />
        </Route>
        <Route path="/tableau-de-bord" element={<TableauDeBord />} />
        <Route path="/mes-resultats" element={<MesResultats />} />
        <Route path="/vocabulaire" element={<Vocabulaire />} />
        <Route path="/mes-infos" element={<MesInfos />} />
      </Route>
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<Admin />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;