import React, { Component } from 'react';

class SignIn extends Component {
    state = {  } 
    render() { 
        return (
            <div className="container">
                <form action="/action_page.php" method="post" target="_blank">
                    <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email Adresse</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" name="email" aria-describedby="emailHelp" placeholder="Email eingeben" />
                    </div>

                    <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label" name="password">Passwort</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Passwort eingeben" />
                    <label htmlFor="exampleInputPassword1" className="form-label" name="passwordRepeat">Passwort wiederholen</label>
                    <input type="password" className="form-control" id="exampleInputPassword2" placeholder="Passwort wiederholen" />
                    <p><a className="link-opacity-75-hover" href="/login">Bereits registriert?</a></p>
                    </div>

                    <div className="mb-3">
                    <button type="submit" className="btn btn-primary">Registrieren</button>
                    </div>
                    
                </form>
            </div>
        );
    }
}
 
export default SignIn;