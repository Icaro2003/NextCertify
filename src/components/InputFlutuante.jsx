import Form from 'react-bootstrap/Form';
import '../css/forms.css';
import '../css/form-pages.css';

function InputFlutuante({ type, id, label, value, onChange }) {
  return (
    <div className="label-float mt-3">
      <Form.Control 
        type={type} 
        id={id} 
        placeholder=" " 
        required 
        value={value}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

export default InputFlutuante;