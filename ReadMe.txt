All the feature of this application can only work if you set up the environment using ubuntu.

For setting up the environment for the application to run,
Come the current directory and execute the setupcommands.sh in the commands folder "Without changing the directory"

The setupcommands.sh has all the dependencies listed in it which needs to be downloaded before for running the application 
and it will download them automatically upon running as stated in the above sentence

Once the setupcommmands.sh has completed it's execution, enter the following comming in the terminal
source env/bin/activate
python app.py
This will start the application

To enable mailing functions of the application, execute the commands in setupcommands.txt along with this start thre redis server.
