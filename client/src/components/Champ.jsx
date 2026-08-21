import './Champ.scss';

function Champ({label, type, valeur, onChange, placeholder}) {
    return (
        <div className="champ">
            <label>{label}</label>
            <input type={type} value={valeur} onChange={onChange} placeholder={placeholder} />
        </div>
    );
}

export default Champ;
