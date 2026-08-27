import './Card.scss';
import { hexToRgba } from '../utils/colors';

function Card({ children, className = "", onClick, couleurBordure }) {
    const styleInline = couleurBordure
    ? { 
        borderColor: hexToRgba(couleurBordure, 0.4), 
        boxShadow: `0 8px 24px ${hexToRgba(couleurBordure, 0.25)}` 
      }
    : {};

    return (
        <div className={`card ${className}`} onClick={onClick} style={styleInline}>
            {children}
        </div>
    );
}

export default Card;