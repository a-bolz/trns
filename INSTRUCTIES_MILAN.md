Stappen voor de demo:

update het .env bestand in de project root.
specifiek deze velden:
TL_CLIENT_ID=b138169390d54709e8d1cfc8092c55fb
TL_CLIENT_SECRET=9230e1f03e0723765354693ed390ebe0
GMAIL_CLIENT_ID=267854626182-5n7jricsdmq3iiub38uqer8s7usvstit.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=vx6fS4-jJyAZcSqyWPrG2us-
TUNNEL=https://9acb89f8.ngrok.io/


installeer ngrok => https://dashboard.ngrok.com/get-started

run:
./ngrok http 5000

daar zie je dan de url voor TUNNEL. 

De rest op teamleader en gmail testaccounts.

dan:

in een tweede terminal start de webserver (vanuit de project root):
node index.js

activeer de authenticatie voor teamleader en gmail via:
localhost:5000/auth/teamleader
en 
localhost:5000/auth/gmail

Vervolgens kun je deals updaten op teamleader: het resultaat van de
calls is dan te bewonderen in je terminal. 


