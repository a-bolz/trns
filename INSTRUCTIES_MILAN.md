Stappen voor de demo:

installeer ngrok => https://dashboard.ngrok.com/get-started

run:
./ngrok http 5000

open .env, wijzig TUNNEL var naar jouw ngrok url

in een tweede terminal start de webserver (vanuit de project root):
node index.js

activeer de authenticatie voor teamleader en gmail via:
localhost:5000/auth/teamleader
en 
localhost:5000/auth/gmail
