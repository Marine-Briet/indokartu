import './Champ.scss';

function Champ({label, type, valeur, onChange, placeholder, disabled}) {
    return (
        <div className="champ">
            <label>{label}</label>
            <input type={type} value={valeur} onChange={onChange} placeholder={placeholder} disabled={disabled}/>
        </div>
    );
}

export default Champ;
