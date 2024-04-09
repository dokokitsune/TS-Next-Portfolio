module.exports = {
  apps : [{
    script: 'npm run start',
	  name: 'wwoodportfolio.com',
	  env: {
		   NODE_ENV: 'production',
        HOST: '34.214.204.16',
        PORT: 8000
	  }
  }
  ],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
