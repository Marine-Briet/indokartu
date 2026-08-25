import { createContext, useState, useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const SessionContext = createContext();

export function SessionProvider() {
  const [typesSelectionnes, setTypesSelectionnes] = useState([]);
  const [categoriesSelectionnees, setCategoriesSelectionnees] = useState([]);
  const [orientation, setOrientation] = useState("fr-vers-id");
  const [nombreCartes, setNombreCartes] = useState(10);
  const [motsSession, setMotsSession] = useState([]);       // les mots tirés pour CETTE session
  const [resultatsSession, setResultatsSession] = useState([]); // le détail des réponses (mot + réussi/raté)

  return (
    <SessionContext.Provider value={{ typesSelectionnes, setTypesSelectionnes, 
    categoriesSelectionnees, setCategoriesSelectionnees, 
    orientation, setOrientation, 
    nombreCartes, setNombreCartes,
    motsSession, setMotsSession,
    resultatsSession, setResultatsSession}}>
      <Outlet/>
    </SessionContext.Provider>
  ); 
}

export function useSession() {
  return useContext(SessionContext);
}


export default SessionContext;