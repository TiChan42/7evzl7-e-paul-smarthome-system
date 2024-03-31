# 7evzl7-e-paul-smarthome-system
SE-University Project for Smarthome developing

# Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm install`
Installs and uptdate all the React libraries

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.



# Setup Backend
- Create a virtual environment if you don't already have one
- Make sure to pip install the packages within the Pipfile into your virtual environment
- Change your directory to 7evzl7-e-paul-smarthome-system/backend/app
- Migrate the Django changes:
    - python manage.py makemigrations
    - python manage.py migrate
- Start your server:
    - python manage.py runserver


# Dateistruktur
```text
.
├── 7evzl7-e-paul-smarthome-system
|   └── backend
|       └──app
|           └──app
|               └──...
|           └──e-paul-smarthome-system
|               └──model
|               └──serializer
|               └──views
|               └──...
|       └──...
|   └── e-paul-frontend
|       └──src
|          ├─components
|          ├─layout
|          ├─pages
|          ├─styles
|          ├─utils
|          └─test
```