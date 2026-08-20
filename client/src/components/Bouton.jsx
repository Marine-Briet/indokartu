import './Bouton.scss';

function Bouton({ children, onClick, type = "button", variant = "cta", actif = true }) {
    let classeBouton;

    if (variant === "filtre" && actif) {
        classeBouton = "bouton bouton--filtre-actif";
    } else if (variant === "filtre" && !actif) {
        classeBouton = "bouton bouton--filtre-inactif";
    } else {
        classeBouton = "bouton bouton--cta";
    }

  return (
    <button type={type} onClick={onClick} className={classeBouton}>
      {children}
    </button>
  );
}

export default Bouton;