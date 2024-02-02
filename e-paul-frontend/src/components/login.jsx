import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './login.css'

class Login extends Component {
    state = {  } 
    render() { 
        return (
            <div className="container">
                <form>
                    <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email Adresse</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email eingeben" />
                    </div>

                    <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Passwort</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Passwort eingeben" />
                    <p><a className="link-opacity-75-hover" href="">Passwort vergessen</a></p>
                    <Link to="/signin"> Jetzt registieren! </Link>
                    </div>

                    <div className="mb-3">
                    <Link to="/chooseuser">
                    <button type="submit" className="btn btn-primary">Anmelden</button>
                    </Link>
                    </div>
                    
                </form>
            </div>
            
        );
    }
}
 
export default Login;