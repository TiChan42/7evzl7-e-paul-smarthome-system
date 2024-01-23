import React, { Component } from 'react';
import './about.css'

class About extends Component {
  state = {
    isPopupOpen: false,
    message: '',
  };

  openPopup = () => {
    this.setState({ isPopupOpen: true, message: 'Bitte schreiben Sie uns Ihr Anliegen:' });
  };

  closePopup = () => {
    this.setState({ isPopupOpen: false });
  };

  sendEmail = () => {
    const emailBody = encodeURIComponent(this.state.message);
    const emailSubject = encodeURIComponent('E-Paul Kundensupport');
    const emailAddress = 'mddruica@gmail.com';

    // Simuliere das Öffnen des E-Mail-Clients mit vordefiniertem Betreff und Nachricht
    window.open(`mailto:${emailAddress}?subject=${emailSubject}&body=${emailBody}`);

    // Schließe das Popup nach dem Senden der E-Mail
    this.closePopup();
  };

  render() {
    return (
      <div className='background-container'>
        <h1 className='headline'>Example About Us Page</h1>
        <button className="btn btn-outline-success me-2 btn-message" onClick={this.openPopup}>Nachricht schreiben</button>

        {this.state.isPopupOpen && (
          <div className="popup">
            <p>{this.state.message}</p>
            <button onClick={this.sendEmail} className="btn btn-outline-success me-2 btn-email">Zur E-Mail</button>
            <button onClick={this.closePopup} >Schließen</button>
          </div>
        )}
      </div>
    );
  }
}

export default About;
