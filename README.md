# Microsoft-Teams-Clone
Created by - Kaushiki Raj

Microsoft Teams Clone is a project built for Microsoft Engage'21 program. This is a platform through which different users can connect with each other through voice calls or video calls or chat, collaborate with each other and keep track of their completed and pending tasks. This application provides the user with the option to either collaborate in team or have one-to-one interation with their friends or family or colleagues.

For working prototype of the product, please visit https://msteams.games/

## Features
1. **Signup and Login feature** - Provides basic authentication
2. **Teams Section** - <br/> 1. Create a team  <br /> 2. Join a Team with Code
3. **Inside a Team** - <br /> 1. Conversation Tab - Group chat for entire team <br /> 2. General Tab - List of all ongoing calls in the team <br /> 3. Call Log Tab - List of all the previous calls of team. <br /> 4. Scheduled Calls Tab - List of all the scheduled meetings <br /> 5. Tasks Tab - List of all pending and completed tasks of the team <br /> 6. Team Participant Tab - a. List of all team participants, b. Add participant to team (**only for team admin**)
4. **Video Call Feature** - <br /> 1. Invite option with a link (**only valid for authorized members**) <br /> 2. Mute/Unmute <br /> 3. Video on/off <br /> 4. List of participants in meeting <br /> 5. Chat option <br /> 6. Screen-share option (**single-click zoom in**) <br /> 7. Dominant speaker detection (**Green border for Dominant Speaker - Not valid for peer-to-peer call**) <br /> 8. Leave call option
5. **Chat feature** -<br /> 1. Media sharing using **clipboard pasting**, **drag and drop** and **upload button** <br /> 2. Message Seen feature (**only for peer-to-peer chat**)
 <br /> 3. Realtime Unread Message count increment (**only for peer-to-peer chat**) <br /> 4. Desktop Notification for incoming call/message (**only for peer-to-peer chat**) <br /> 5. Call Ring Feature for incoming calls (**only for peer-to-peer chat**)
6. **Persistent Chatting Feature** - Every chat in the application is persistent
7. **Scheduler** - <br /> 1. End ongoing calls if no user is present for more than 5 minutes <br/> 2. Send email 30 minutes before meeting <br /> 3. Send email 12 hours before tasks deadline <br /> 4. Start scheduled calls on time
8. **Unit Tests** - Added few unit tests in the code
9. **Hosted Website** - Hosted on https port


## Technology Stack
1. Backend - Django, ExpressJS (***only for chat***)
2. Frontend - ReactJS
3. Database - SQLite
4. Redis and Celery
5. Socket.io
6. Firebase Cloud Messaging
7. Twilio Video SDK


## Instructions to Install and Setup
Install redis and run it on it's default port <br />
Install celery

### Setup and run django server - 
1. Navigate to /backend
2. Run the following command to install all the dependencies for django -> ```pip install -r requirements.txt (Python 2), or pip3 install -r requirements.txt (Python 3)```
3. Navigate to /backend/msteams
4. Run -> python3 manage.py makemigrations
5. Run -> python3 manage.py migrate
6. Note steps 5 and 6 needs to be run only once while initial setup
7. Run -> ```python3 manage.py runsslserver --certificate {PWD}/ms-teams-clone/ssl/mydomain.crt --key {PWD}/ms-teams-clone/ssl/server.key 0.0.0.0:9000```
8. Where {PWD} shall be replace with present working directory
9. Example -> ```python3 manage.py runsslserver --certificate /home/kaushiki/ms-teams-clone/ssl/mydomain.crt --key /home/kaushiki/ms-teams-clone/ssl/server.key 9000```

### Setup and run celery - 
1. Navigate to /backend/msteams
2. Run -> ```celery -A msteams worker -l info -B```

### Setup and run socket io
1. Navigate to /socket
2. Run -> ```npm insatll```
3. Run -> ```node index.js```

### Setup and run react app - 
1. Navigate to /frontend
2. Run -> ```npm install```
3. Run -> ```REACT_APP_DJANGO_URL={YOUR_DJANGO_URL} REACT_APP_SOCKET_URL={YOUR_SOCKET_URL} npm start```
4. In place of {YOUR_DJANGO_URL} insert your local django url and in place of {YOUR_SOCKET_URL} insert your local socket io url.
5. For example -> ```REACT_APP_DJANGO_URL=https://localhost:9000/ REACT_APP_SOCKET_URL=https://localhost:5000 npm start```
6. This shall run the react server on https://localhost:3000.
7. You can visit https://localhost:3000 on your browser to see the website in action. <br />
***Note - please allow the website to show notifications which is by default off in most of the broswers.***


## Screenshots

<p>
 <img src="https://user-images.githubusercontent.com/43745008/125168080-448d9800-e1c1-11eb-92e6-c2c19a7811b5.png" height="40%" width="50%"> 
 <p>Login Page</p>
</p>
<p>
 <img src="https://user-images.githubusercontent.com/43745008/125168290-718e7a80-e1c2-11eb-8ce2-69b946d4429a.png" height="40%" width="50%">
 <p>Signup Page </p>
</p>
<p>
 <img src="https://user-images.githubusercontent.com/43745008/125169385-81f52400-e1c7-11eb-8ef3-f1de2454f919.png" height="40%" width="50%">
 <p>Teams Page - Displays a list of all teams</p>
</p>

<p>
 <img src="https://user-images.githubusercontent.com/43745008/125169418-b36def80-e1c7-11eb-878a-eb9bc65d1037.png" height="40%" width="50%">
 <p>Inside Teams Page : Conversations, General, Call Log, Scheduled calls, Tasks, Team participants </p>
</p>

<p>
 <img src="https://user-images.githubusercontent.com/43745008/125169463-e31cf780-e1c7-11eb-8eb3-7185b7b02331.png" height="40%" width="50%">
 <p>Videocall page</p>
 </p>
 
 <p>
 <img src="https://user-images.githubusercontent.com/43745008/125169477-f16b1380-e1c7-11eb-9b4f-5ccf45a7136c.png" height="40%" width="50%">
 <p>UI changes on clicking chat/participants</p>
 </p>

<p>
 <img src="https://user-images.githubusercontent.com/43745008/125171971-a3a8d800-e1d4-11eb-9f22-0274423d2976.png" height="40%" width="50%">
 <p>Call Log Tab</p>
 </p>
 
 <p>
 <img src="https://user-images.githubusercontent.com/43745008/125171984-b28f8a80-e1d4-11eb-90f7-e012be8b87fa.png" height="40%" width="50%">
 <p>Schedule Meeting Modal</p>
 </p>

<p>
 <img src="https://user-images.githubusercontent.com/43745008/125171989-bc18f280-e1d4-11eb-8794-af9b042bd1df.png" height="40%" width="50%">
 <p>Tasks Section</p>
 </p>

<p>
 <img src="https://user-images.githubusercontent.com/43745008/125171997-c4712d80-e1d4-11eb-9c18-121740bf7df2.png" height="40%" width="50%">
 <p>Team Participants Tab</p>
 </p>


<p>
 <img src="https://user-images.githubusercontent.com/43745008/125172007-d0f58600-e1d4-11eb-9bf0-5ed85fe1f47e.png" height="40%" width="50%">
 <p>Personal Chitchat section</p>
 </p>

<p>
 <img src="https://user-images.githubusercontent.com/43745008/125172033-eff41800-e1d4-11eb-9250-559edd46b8ac.png" height="40%" width="50%">
 <p>Incoming Call Modal</p>
 </p>


<p>
 <img src="https://user-images.githubusercontent.com/43745008/125397345-6f4b3c80-e3cb-11eb-82b1-56aa5aa38eb1.png" height="40%" width="80%">
 <p>Email Reminder </p>
 </p>
 
 <p>
 
 <img src="https://user-images.githubusercontent.com/43745008/125192432-7821fe00-e265-11eb-9c2c-8cde5eb1d823.png" height="40%" width="50%">
 <p>View Magnified Image Modal</p>
 </p>















