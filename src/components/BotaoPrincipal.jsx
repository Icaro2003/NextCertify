import Button from 'react-bootstrap/Button';
import '../css/forms.css';
import '../css/form-pages.css';

function BotaoPrincipal({ texto, type = "button", onClick }) {
  return (
    <div className="d-flex justify-content-center mt-3">
      <Button 
        variant="primary" 
        type={type} 
        className="w-100 form-button" 
        onClick={onClick}
      >
        {texto}
      </Button>
    </div>
  );
}

export default BotaoPrincipal;