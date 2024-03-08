from django.core.mail import BadHeaderError, send_mail
from django.http import HttpResponse, HttpResponseRedirect
from rest_framework.response import Response
from django.conf import settings

def send_email(data):
    subject = data["subject"]
    message = data["message"]
    receiver = data["receiver"]
    test = settings.EMAIL_HOST_USER
    if subject and message:
        try:
            send_mail(subject, message, from_email = settings.EMAIL_HOST_USER  ,recipient_list = [receiver])
        except BadHeaderError:
            return Response("Invalid header found.", status = 400)
        return Response("Email sent successfully.", status = 204)
    else:
        return Response("Make sure all fields are entered and valid.", status = 400)