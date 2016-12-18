setup:
	npm install --save

init-db:
	@echo "***********************************************************"
	@echo "*  Creating PostgreSQL user 'charts'                      *"
	@echo "*  Please enter 'charts' as password when prompted        *"
	@echo "***********************************************************"
	sudo -u postgres createuser charts --pwprompt
	sudo -u postgres createdb charts -O charts
	setup-db

setup-db:
	node_modules/.bin/sequelize db:migrate