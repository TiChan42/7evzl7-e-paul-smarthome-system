/* *******************************************************************
   Webserver

   How it all works together:

   page   0.htm         includes javascript j.js
   script j.js          the javascript requests the JSON
          json          returns data as JSON
   css    f.css         css for all on flash (program) memory
   php                  not really php - only a resource doing actions and not returning content (just http header 204 ok)
   ***************************************************************** */

void handleOtherPage()
// a very simple example how to output a HTML page from program memory
{
  String message;
  message =  F("<!DOCTYPE html>\n"
               "<html lang='en'>\n"
               "<head>\n"
               "<title>" TXT_BOARDNAME " - Board " TXT_BOARDID "</title>\n"
               "</head>\n"
               "<body>\n"
               "<h1>Your webserver on " TXT_BOARDNAME " - Board " TXT_BOARDID " is running!</h1>\n"
               "<p>This is an example how you can create a webpage.</p>\n"
               "<p>But as most of my webserver should have the same look and feel I'm using one layout for all html pages.</p>\n"
               "<p>Therefore my html pages come from the functions starting with handlePage and just share a common top and bottom.</p>\n"
               "<p>To go back to the formated pages <a href='0.htm'>use this link</a></p>\n"
               "</body>\n"
               "</html>");
  server.send(200, "text/html", message);
}


void handleNotFound() {
  // Output a "404 not found" page. It includes the parameters which comes handy for test purposes.
  Serial.println(F("D015 handleNotFound()"));
  String message;
  message += F("404 - File Not Found\n"
               "URI: ");
  message += server.uri();
  message += F("\nMethod: ");
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += F("\nArguments: ");
  message += server.args();
  message += F("\n");
  for (uint8_t i = 0; i < server.args(); i++)
  {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
}


void handle204()
{  
  server.send(204);                // this page doesn't send back content
}


void addTop(String &message)
{
  message =  F("<!DOCTYPE html>\n"
               "<html lang='en'>\n"
               "<head>\n"
               "<title>" TXT_BOARDNAME " - Board " TXT_BOARDID "</title>\n"
               "<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\">\n"
               "<meta name=\"viewport\" content=\"width=device-width\">\n"
               "<link rel='stylesheet' type='text/css' href='/f.css'>\n"
               "<script src='j.js'></script>\n"
               "</head>\n");
  message += F("<body>\n");
  //message += F("<body onload='GetSwitchState(0)'>\n");  // if you are using AJAX/XMLHttpRequest you have to add the onload request
  message += F("<header>\n<h1>" TXT_BOARDNAME " - Board " TXT_BOARDID "</h1>\n"
               "<nav><p><a href=\"/\">[Home]</a> <a href=\"1.htm\">[Page&nbsp;1]</a> <a href=\"2.htm\">[The&nbsp;Webclient]</a> <a href=\"r.htm\">[Remote&nbsp;Module]</a> <a href=\"x.htm\">[Page&nbsp;X]</a></p></nav>\n</header>\n"
               "<main>\n");
}


void addBottom(String &message) {
  message += F("</main>\n"
               "<footer>\n<p>");                 // The footer will display the uptime, the IP the version of the sketch and the compile date/time
  if (ss > 604800)
  {
    message += F("<span id='week'>");
    message +=  ((ss / 604800) % 52);
    message += F("</span> weeks ");
  }
  if (ss > 86400)
  {
    message += F("<span id='day'>");
    message += ((ss / 86400) % 7);
    message += F("</span> days ");
  }
  if (ss > 3600)
  {
    message += F("<span id='hour'>");
    message += ((ss / 3600) % 24);
    message += F("</span> hours ");
  }

  message += F("<span id='min'>");
  message += ((ss / 60) % 60);
  message += F("</span> minutes ");

  message += F("<span id='sec'>");
  message += (ss % 60);
  message += F("</span> seconds since startup | Version " VERSION " | IP: ");
  message += WiFi.localIP().toString();
  message += F(" | " __DATE__ " " __TIME__ "</p>\n</footer>\n</body>\n</html>");
  server.send(200, "text/html", message);
}


// the html output
// finally check your output if it is valid html: https://validator.w3.org
// *** HOME ***  0.htm
void handlePage()
{
  String message;
  addTop(message);

  message += F("<article>\n"
               "<h2>Homepage</h2>\n"                                                   // here you write your html code for your homepage. Let's give some examples...
               "<p>This is an example for a webserver on your ESP8266. "
               "Values are getting updated with Fetch API/JavaScript and JSON.</p>\n"
               "</article>\n");

  message += F("<article>\n"
               "<h2>Values (with update)</h2>\n");
  message += F("<p>Internal Voltage measured by ESP: <span id='internalVcc'>");        // example how to show values on the webserver
  message += ESP.getVcc();
  message += F("</span>mV</p>\n");

  message += F("<p>Button 1: <span id='button1'>");                                    // example how to show values on the webserver
  message += digitalRead(BUTTON1_PIN);
  message += F("</span></p>\n");

  message += F("<p>Output 1: <span id='output1'>");                                    // example 3
  message += digitalRead(OUTPUT1_PIN);
  message += F("</span></p>\n");

  message += F("<p>Output 2: <span id='output2'>");                                    // example 4
  message += digitalRead(OUTPUT2_PIN);
  message += F("</span></p>\n"
               "</article>\n");

  message += F("<article>\n"
               "<h2>Switch</h2>\n"                                                     // example how to switch/toggle an output
               "<p>Example how to switch/toggle outputs, or to initiate actions. The buttons are 'fake' buttons and only styled by CSS. Click to toggle the output.</p>\n"
               "<p class='off'><a href='c.php?toggle=1' target='i'>Output 1</a></p>\n"
               "<p class='off'><a href='c.php?toggle=2' target='i'>Output 2</a></p>\n"
               "<iframe name='i' style='display:none' ></iframe>\n"                    // hack to keep the button press in the window
               "</article>\n");

  addBottom(message);
  server.send(200, "text/html", message);
}


// *** Page 1 ***  1.htm
void handlePage1()
{
  String message;
  addTop(message);

  message += F("<article>\n"
               "<h2>Page 1</h2>\n"
               "<p>This is example content for [Page 1]<p>\n"
               "</article>\n"

               "<article>\n"
               "<h2>\"Mobile First\"</h2>\n"
               "<p>\"Mobile First\" means that the pages are optimized for smartphones. "
               "The content width is narrow. Each time you start a new article session, a box will be generated. "
               "This box will float: on smartphones in portrait mode they will be aligned vertically, "
               "on monitors in landscape mode, the article boxes will be aligned horizontally. "
               "If you don't like this effect, you have to adopt the stylesheet (f.css)."
               "</p>\n"
               "</article>\n"

               "<article>\n"
               "<h2>Lorem ipsum</h2>\n"
               "<p>Lorem ipsum dolor sit amet, consectetur adipisici elit, "
               "sed eiusmod tempor incidunt ut labore et dolore magna aliqua. "
               "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris "
               " nisi ut aliquid ex ea commodi consequat. "
               "Quis aute iure reprehenderit in voluptate velit esse cillum dolore "
               "eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat "
               "non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. "
               "</p>\n"
               "</article>\n"
              );
  addBottom(message);
  server.send(200, "text/html", message);
}


// *** Page 2 ***  2.htm
void handlePage2()
{
  String message;
  addTop(message);

  message += F("<article>\n"
               "<h2>The webclient</h2>\n"
               "<p>Some words about the weblient ('client'): The client will send data to a server.<p>\n"
               "<p>To be precise, the client on this module will send each ");
  message += clientIntervall;
  message += F(" seconds to a resource at<br>");
  message += sendHttpTo;
  message += F("<br>which you can set up in the configuration part. It consists of the webserver adress and a page. You must ensure, that the webserver and the called page is available, otherwise the request will fail.<p>\n"
               "<p>Optionally you can send a command to force the webclient to send manually</p>\n"
               "<p><a href='c.php?CMD=CLIENT' target='i' class='on'>Send now</a></p>\n"
               "<iframe name='i' style='display:none' ></iframe>\n"
               "<p>If the other webserver shares the same source code like this module - it should be able to collect the data from this module.</p>\n"
               "</article>\n"
              );
  addBottom(message);
  server.send(200, "text/html", message);
}

// *** Remote Page ***  r.htm
void handlePageR()
{
  String message;
  addTop(message);
  message += F("<article>\n"
               "<h2>Remote Module</h2>\n"
               "<p>This page shows values which were received from a remote module.<p>\n"
               "<table>\n"
               "<tr><th>variable</th><th>value</th></tr>\n"

               "<tr><td>remoteBoardId</td><td>");
  message += remoteBoardId;
  message += F("</td></tr>\n"

               "<tr><td>remoteVcc</td><td>");
  message += remoteVcc;
  message += F("</td></tr>\n"

               "<tr><td>remoteButton1</td><td>");
  message += remoteButton1;
  message += F("</td></tr>\n"

               "<tr><td>remoteOutput1</td><td>");
  message += remoteOutput1;
  message += F("</td></tr>\n"

               "<tr><td>remoteOutput2</td><td>");
  message += remoteOutput2;
  message += F("</td></tr>\n");

  if (remoteMessagesSucessfull > 0)
  {
    message += F("<tr><td>remoteMessagesSucessfull</td><td>");
    message += remoteMessagesSucessfull;
    message += F("</td></tr>\n"
                 "<tr><td>seconds since last message</td><td>");
    message += (millis() / 1000) - remoteLastMessage;
    message += F("</td></tr>\n");
  }
  else
  {
    message += F("<tr><td>no external data received so far</td><td>-</td>");
  }
  message += F("</table>\n"
               "<p>If this module (the 'server') receives data from another remote module (the 'client'), data will be displayed.</p>\n"
               "<p>The data for the remote module is not updated, therefore you will need to reload this page. You can modify the handleJson() and this page to add that data.</p>\n"
               "</article>\n"
              );
  addBottom(message);
  server.send(200, "text/html", message);
}


void handleCss()
{
  // output of stylesheet
  // this is a straight forward example how to generat a static page from program memory
  String message;
  message = F("*{font-family:sans-serif}\n"
              "body{margin:10px}\n"
              "h1, h2{color:white;background:" CSS_MAINCOLOR ";text-align:center}\n"
              "h1{font-size:1.2em;margin:1px;padding:5px}\n"
              "h2{font-size:1.0em}\n"
              "h3{font-size:0.9em}\n"
              "a{text-decoration:none;color:dimgray;text-align:center}\n"
              "main{text-align:center}\n"
              "article{vertical-align:top;display:inline-block;margin:0.2em;padding:0.1em;border-style:solid;border-color:#C0C0C0;background-color:#E5E5E5;width:20em;text-align:left}\n" // if you don't like the floating effect (vor portrait mode on smartphones!) - remove display:inline-block
              "article h2{margin-top:0;padding-bottom:1px}\n"
              "section {margin-bottom:0.2em;clear:both;}\n"
              "table{border-collapse:separate;border-spacing:0 0.2em}\n"
              "th, td{background-color:#C0C0C0}\n"
              "button{margin-top:0.3em}\n"
              "footer p{font-size:0.7em;color:dimgray;background:silver;text-align:center;margin-bottom:5px}\n"
              "nav{background-color:silver;margin:1px;padding:5px;font-size:0.8em}\n"
              "nav a{color:dimgrey;padding:10px;text-decoration:none}\n"
              "nav a:hover{text-decoration:underline}\n"
              "nav p{margin:0px;padding:0px}\n"
              ".on, .off{margin-top:0;margin-bottom:0.2em;margin-left:4em;font-size:1.4em;background-color:#C0C0C0;border-style:solid;border-radius:10px;border-style:outset;width:5em;height:1.5em;text-decoration:none;text-align:center}\n"
              ".on{border-color:green}\n"
              ".off{border-color:red}\n");
  server.send(200, "text/css", message);
}


void handleJson() {
  // Output: send data to browser as JSON
  // after modification always check if JSON is still valid. Just call the JSON (json) in your webbrowser and check.
  // Serial.println(F("D268 requested json"));
  String message = "";
  message = (F("{\"ss\":"));                     // Start of JSON and the first object "ss":
  message += millis() / 1000;
  message += (F(",\"internalVcc\":"));
  message += ESP.getVcc();
  message += (F(",\"button1\":"));
  message += digitalRead(BUTTON1_PIN);
  message += (F(",\"output1\":"));
  message += digitalRead(OUTPUT1_PIN);
  message += (F(",\"output2\":"));
  message += digitalRead(OUTPUT2_PIN);
  message += (F("}"));                           // End of JSON
  server.send(200, "application/json", message); // set MIME type https://www.ietf.org/rfc/rfc4627.txt
}


void handleCommand() {
  // receive command and handle accordingly
  // Serial.println(F("D322 handleCommand"));
  for (uint8_t i = 0; i < server.args(); i++) {
    Serial.print(server.argName(i));
    Serial.print(F(": "));
    Serial.println(server.arg(i));
  }
  if (server.argName(0) == "toggle")                                 // the parameter which was sent to this server
  {
    if (server.arg(0) == "1")                                        // the value for that parameter
    {
      Serial.println(F("D232 toggle output1"));
      if (digitalRead(OUTPUT1_PIN)) {                                // toggle: if the pin was on - switch it of and vice versa
        digitalWrite(OUTPUT1_PIN, LOW);
      } else {
        digitalWrite(OUTPUT1_PIN, HIGH);
      }
    }
    if (server.arg(0) == "2")                                        // the value for that parameter
    {
      Serial.println(F("D232 toggle output2"));
      if (digitalRead(OUTPUT2_PIN)) {
        digitalWrite(OUTPUT2_PIN, LOW);
      } else {
        digitalWrite(OUTPUT2_PIN, HIGH);
      }
    }
  }
  else if (server.argName(0) == "CMD" && server.arg(0) == "RESET")   // Example how to reset the module. Just send ?CMD=RESET
  {
    Serial.println(F("D238 will reset"));
    ESP.restart();
  }
  else if (server.argName(0) == "CMD" && server.arg(0) == "CLIENT")  // Example how to manually start the webclient
  {
    Serial.println(F("D321 will send data with webclient"));
    sendPost();
  }
  server.send(204);                      // this page doesn't send back content --> 204
}


void handleData() {
  // receives data from a remote board and saves data to local variables
  // it uses similar method like the command processing: we receive parameters and store them in variables
  // Serial.println(F("D366 handleData()"));
  uint8_t counter = 0;  // will count valid values, can be used for error-handling
  for (uint8_t i = 0; i < server.args(); i++) {
    Serial.print(server.argName(i));
    Serial.print(F(": "));
    Serial.println(server.arg(i));
    if (server.argName(i) == "board")
    {
      remoteBoardId = server.arg(0).toInt();
      counter++;
    }
    else if (server.argName(i) == "vcc")
    {
      remoteVcc = server.arg(i).toInt();
      counter++;
    }
    else if (server.argName(i) == "output1")
    {
      remoteOutput1 = server.arg(i).toInt();
      counter++;
    }
    else if (server.argName(i) == "output2")
    {
      remoteOutput2 = server.arg(i).toInt();
      counter++;
    }
    else if (server.argName(i) == "button1")
    {
      remoteButton1 = server.arg(i).toInt();
      counter++;
    }
  }
  //example for errorhandling
  if (counter >= 1)
  {
    remoteLastMessage = millis() / 1000;         // if ok we store the timestamp as we have received at least one valid value
    remoteMessagesSucessfull++;                  // increase successfull submits
  }
  server.send(200, "text/plain", "OK");          // this page returns just a simple OK
}


void handleJs() {
  // Output: a fetch API / JavaScript
  // a function in the JavaScript uses fetch API to request a JSON file from the webserver and updates the values on the page if the object names and ID are the same
  String message;
  message += F("const url ='json';\n"
               "function renew(){\n"
               " document.getElementById('sec').style.color = 'blue'\n"                                              // if the timer starts the request, the second gets blue
               " fetch(url)\n" // Call the fetch function passing the url of the API as a parameter
               " .then(response => {return response.json();})\n"
               " .then(jo => {\n"
               "   document.getElementById('sec').innerHTML = Math.floor(jo['ss'] % 60);\n"                         // example how to change a value in the HTML page
               "   for (var i in jo)\n"
               "    {if (document.getElementById(i)) document.getElementById(i).innerHTML = jo[i];}\n"               // as long as the JSON name fits to the HTML id, the value will be replaced
               // add other fields here (e.g. the delivered JSON name doesn't fit to the html id
               // finally, update the runtime
               "   if (jo['ss'] > 60) { document.getElementById('min').innerHTML = Math.floor(jo['ss'] / 60 % 60);}\n"
               "   if (jo['ss'] > 3600) {document.getElementById('hour').innerHTML = Math.floor(jo['ss'] / 3600 % 24);}\n"
               "   if (jo['ss'] > 86400) {document.getElementById('day').innerHTML = Math.floor(jo['ss'] / 86400 % 7);}\n"
               "   if (jo['ss'] > 604800) {document.getElementById('week').innerHTML = Math.floor(jo['ss'] / 604800 % 52);}\n"
               "   document.getElementById('sec').style.color = 'dimgray';\n"  // if everything was ok, the second will be grey again.
               " })\n"
               " .catch(function() {\n"                                        // this is where you run code if the server returns any errors
               "  document.getElementById('sec').style.color = 'red';\n"
               " });\n"
               "}\n"
               "document.addEventListener('DOMContentLoaded', renew, setInterval(renew, ");
  message += ajaxIntervall * 1000;
  message += F("));");

  server.send(200, "text/javascript", message);
}

/*
  // Output: a JavaScript for an AJAX/XMLHttpRequest
  // a function in the JavaScript uses AJAX to request a JSON file from the webserver and updates the values on the page if the object names and ID are the same
  // this function is only needed if you want to try the AJAX way.
  // it is not needed if you use the fetch API.
  // see more explanations on https://werner.rothschopf.net/201809_arduino_esp8266_server_client_2_ajax.htm
  void handleAjax() {
  String message;
  message += F("  function GetSwitchState(s) {\n"                              // 0 call function with settimeout, 1 run only once for manual update
               "   nocache = '&nocache='+ Math.random() * 1000000;\n"
               "   var request = new XMLHttpRequest(); \n"
               "   request.onreadystatechange = function() {\n"
               "   if (this.readyState == 4) {\n"
               "    if (this.status == 200) {\n"
               "     if (this.responseText != null) {\n"
               "      var jo=JSON.parse(this.responseText);\n"
               "      for (var i in jo)\n"
               "      {if(document.getElementById(i)) document.getElementById(i).innerHTML=jo[i];}\n"                // as long as the JSON name fits to the HTML ID value will be replaced
               // add other fields here
               "      document.getElementById('sec').innerHTML = Math.floor(jo['ss']%60);\n"                         // example how to change a value in the HTML page
               "      if (jo['ss']>60){document.getElementById('min').innerHTML=Math.floor(jo['ss']/60%60);}\n"
               "      if (jo['ss']>3600){document.getElementById('hour').innerHTML=Math.floor(jo['ss']/3600%24);}\n"
               "      if (jo['ss']>86400){document.getElementById('day').innerHTML=Math.floor(jo['ss']/86400%7);}\n"
               "      if (jo['ss']>604800){document.getElementById('week').innerHTML=Math.floor(jo['ss']/604800%52);}\n");
  message += F("      document.getElementById('sec').style.color = 'dimgray';\n"
               "   }}}\n"
               "   else {document.getElementById('sec').style.color = 'red';}\n"
               "   }\n"
               "   request.open('GET', 'json?p=");             // request the JSON output
  //"   request.open('GET', 'http://172.18.67.103/json?p=");             // request the JSON output
  message += server.uri();
  message += F("' + nocache, true);\n"
               "   request.send(null);\n"
               "   if (s==0) setTimeout('GetSwitchState(0)', ");
  message += ajaxIntervall * 1000;
  message += F(");\n"
               "   }");
  server.send(200, "text/javascript", message);
  }
*/
