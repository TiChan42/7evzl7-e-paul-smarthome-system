from ..model.log import Log

import time

class SaveRequest():
        def __init__(self, get_response):
                self.get_response = get_response

                # Filter to log all request to url's that start with any of the strings below.
                # With example below:
                # /example/test/ will be logged.
                # /other/ will not be logged.
                self.prefixs = [
                    '/api'
                ]

        def __call__(self, request):
                _t = time.time() # Calculated execution time.
                response = self.get_response(request) # Get response from view function.
                _t = int((time.time() - _t)*1000)    

                #If the url does not start with on of the prefixes above, then return response and dont save log.
                if not  list(filter(request.get_full_path().startswith, self.prefixs)):
                        return response
                        
                #Create instance of our model and assign values 
                requestLog = Log(
                        endpoint = request.get_full_path(),
                        responseCode = response.status_code,
                        method = request.method,
                        remoteAddress = self.get_client_ip(request),
                        execTime = _t,
                        bodyResponse = str(response.content),
                        bodyRequest = str(request.body)
                        )
                        
                #if not request.user.is_anonymous:
                #        requestLog.user = request.user

                requestLog.save()
                return response
                
        def get_client_ip(self,request):
                x_forward_for = request.META.get("HTTP_X_FORWARDED_FOR")
                if x_forward_for:
                        _ip = x_forward_for.split(',')[0]
                else:
                        _ip = request.META.get('REMOTE_ADDR')
                return _ip