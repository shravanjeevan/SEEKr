# SEEKr

## Setting up
Clone the repository:
```shell
$ git clone git@github.com:shravanjeevan/SEEKr.git
```
Navigate into the relevant directory:
```shell
$ cd SEEKr
```
Create and activate new Python virtual environment (optional):
```shell
$ virtualenv venv
$ source venv/bin/activate
```
Install dependencies:
```shell
$ pip install requirements.txt
```

## Starting things up!
### Starting up Django server
```shell
$ cd backend
$ python manage.py runserver
```
### Starting up React app
```shell
$ cd frontend
$ npm start
```
### URLs
Once each service has been started, navigate to these URLs to access them.
| Service       | URL     | 
| :------------- | :----------: | 
|  Django | http://localhost:8000 |
| React | http://localhost:3000 |