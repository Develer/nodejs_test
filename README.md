## DB deploy

- create postgres user "charts" with password "charts"  
- create db "charts"  
- ./node_modules/.bin/sequelize model:create --name users --attributes "login:string,password:string"  
- ./node_modules/.bin/sequelize model:create --name charts --attributes "user_id:integer,plot_exp:string"  
- ./node_modules/.bin/sequelize db:migrate  


## API curls

### user's curls

- create  
curl -H "Content-Type: application/json" -X POST -d '{"login":"igor","password":"xyz"}' http://127.0.0.1:8081/users/create

- login  
curl -H "Content-Type: application/json" -X POST -d '{"login":"igor","password":"xyz"}' http://127.0.0.1:8081/users/login

### chart's curls

- create  
curl -H "Content-Type: application/json" -X POST -d '{"user_id":2,"plot_exp":"(x - 4) * (x + 4)"}' http://127.0.0.1:8081/charts/create

- update  
curl -H "Content-Type: application/json" -X POST -d '{"user_id":2,"plot_exp":"(x - 7) * (x + 7)"}' http://127.0.0.1:8081/charts/<chart_id>/update

- list  
curl -H "Content-Type: application/json" -X POST -d '{"user_id":2}' http://127.0.0.1:8081/charts/list

- delete  
curl -H "Content-Type: application/json" -X POST -d '{"user_id":2}' http://127.0.0.1:8081/charts/<chart_id>/delete