import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Accueil from './pages/Accueil';
import AdminCategTyp from './pages/AdminCategTyp';
import AdminVocabulaire from './pages/AdminVocabulaire';
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


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route element={<PrivateRoute />}>
        <Route path="/cartes-filtres" element={<CartesFiltres />} />
        <Route path="/cartes-session" element={<CartesSession />} />
        <Route path="/tableau-de-bord" element={<TableauDeBord />} />
        <Route path="/mes-resultats" element={<MesResultats />} />
        <Route path="/resultat-session" element={<ResultatSession />} />
        <Route path="/vocabulaire" element={<Vocabulaire />} />
        <Route path="/mes-infos" element={<MesInfos />} />
      </Route>
      <Route element={<AdminRoute />}>
        <Route path="/admin-categ-typ" element={<AdminCategTyp />} />
        <Route path="/admin-vocabulaire" element={<AdminVocabulaire />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;