import './TagCategorie.scss';
import { hexToRgba } from '../utils/colors';

function TagCategorie({ couleur, children, onClick }) {
  return (
    <span style={{ 
      backgroundColor: hexToRgba(couleur, 0.1), 
      borderColor: couleur,
      color: couleur 
    }} className="tag-categorie" onClick={onClick}>
      {children}
    </span>
  );
}

export default TagCategorie;