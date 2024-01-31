import React, { Component } from 'react';
import './about.css'
import './style.css'

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
      <div>
        <div className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                <path d="M25.3483 31.5C25.5557 31.0203 25.6286 30.8785 25.875 30.4794L26.4433 30.5677C27.6875 32.0012 28.5021 33.8247 29.3677 35.5035L70.3768 113.948L157.133 282.088L204.963 377.357L244.698 463.968C245.341 465.487 246.218 467.096 246.486 468.722L25.7297 231.173C24.7549 230.134 25.0756 229.068 25.0906 227.727L25.1697 52.53C25.1719 45.5838 24.7898 38.4105 25.3483 31.5Z"/>
                <path d="M265.342 469.836C265.169 470.075 264.846 470.313 264.625 470.512L264.578 470.125C265.077 465.574 273.804 447.004 275.995 442.108L285.479 421.253L344.871 302.529L418.54 159.82L429.771 136.979L479.298 41.9564C481.273 38.4482 483.278 34.221 486.129 31.375C487.907 31.0444 487.13 34.8831 487.091 36.035L487.205 229.965C487.229 230.917 486.244 231.943 485.621 232.653L386.606 337.406L297.38 433.378L265.342 469.836Z"/>
                <path d="M204.248 324.63L121.934 166.332C125.154 164.817 128.212 162.847 131.25 160.998L191.588 123.297L232.45 98.8493C236.471 96.4601 240.325 93.761 244.616 91.875C245.071 94.548 244.779 97.5734 244.774 100.277L245.279 406.027C245.039 405.402 244.843 404.875 244.406 404.355L204.248 324.63Z"/>
                <path d="M307.37 324.687L267.667 405.517L268.268 91.708C270.901 92.6367 273.46 94.5079 275.841 95.9491L381.767 161.304C384.325 162.741 387.367 164.045 389.453 166.131C386.825 172.755 382.845 178.97 379.438 185.228L307.37 324.687Z"/>
            </svg>
        </div>
        <button className="btn btn-outline-success me-2 btn-message" onClick={this.openPopup}>Nachricht schreiben</button>

        {this.state.isPopupOpen && (
          <div className="popup">
            <p>{this.state.message}</p>
            <button onClick={this.sendEmail} className="btn btn-outline-success me-2 btn-email">Zur E-Mail</button>
            <button onClick={this.closePopup} className="btn btn-outline-success me-2 btn-schliessen">Schließen</button>
          </div>
        )}
        <div className='row'>
        <p className='clmn-box'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   

Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam</p>
        <p className='clmn-box'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt</p>
        <p className='clmn-box'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt</p>
        </div>
      </div>
    );
  }
}

export default About;
