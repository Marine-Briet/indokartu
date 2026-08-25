import { hexToRgba } from '../utils/colors';
import './Bouton.scss';

function Bouton({ children, onClick, type = "button", variant = "cta", actif = true, couleur, className="" }) {
    let classeBouton;
    let styleInline = {};

    if (variant === "filtre" && actif) {
      classeBouton = "bouton bouton--filtre-actif";
    } else if (variant === "filtre" && !actif) {
      classeBouton = "bouton bouton--filtre-inactif";
    } else if (variant === "filtre-categorie") {
      classeBouton = "bouton bouton--filtre-categorie";
      styleInline = actif
      ? { backgroundColor: hexToRgba(couleur, 0.1), borderColor: couleur, color: couleur }
      : { backgroundColor: "transparent", borderColor: "#ccc", color: "#999" };
    } else if (variant === "ligne-categorie") {
    classeBouton = actif ? "bouton bouton--ligne-categorie-actif" : "bouton bouton--ligne-categorie-inactif";
    styleInline = actif
      ? { backgroundColor: hexToRgba(couleur, 0.15), borderColor: couleur, color: couleur }
      : { backgroundColor: "transparent", borderColor: "#ccc", color: "#999" };
    } else {
      classeBouton = "bouton bouton--cta";
    }

  return (
    <button type={type} onClick={onClick} className={`${classeBouton} ${className}`} style={styleInline}>
      {variant === "ligne-categorie" && (
        <span className="checkbox-visuelle" style={{ backgroundColor: actif ? couleur : "transparent", borderColor: actif ? couleur : "#ccc" }}>
          {actif && "✓"}
        </span>
      )}
      {children}
    </button>
  );
}

export default Bouton; 