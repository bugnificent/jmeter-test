# jPetStore Performance Test Setup

This document outlines the steps to set up the jPetStore application environment using Apache Tomcat, MySQL Connector/J, and the jPetStore WAR file.  This setup is a prerequisite for running JMeter performance tests (covered in a separate document).

## Dependencies 📦

1. **Apache Tomcat 9.0.100:**  The web server environment.
    * Download: [https://archive.apache.org/dist/tomcat/tomcat-9/v9.0.100/bin/apache-tomcat-9.0.100-windows-x64.zip](https://archive.apache.org/dist/tomcat/tomcat-9/v9.0.100/bin/apache-tomcat-9.0.100-windows-x64.zip) 
    * Extract the zip file to your desired location (e.g., `C:\apache-tomcat-9.0.100`).  We'll refer to this as `$CATALINA_HOME` from now on.

2. **MySQL Connector/J 8.2.0:** The JDBC driver for connecting to the MySQL database.
    * Download: [https://dev.mysql.com/downloads/connector/j/](https://dev.mysql.com/downloads/connector/j/) (Choose the platform-independent "Platform Independent" version as a `.zip` or `.tar.gz` and extract it)
    * Copy the `mysql-connector-j-8.2.0.jar` (or similar file name depending on the downloaded version) from the extracted folder to `$CATALINA_HOME/lib`.

3. **jPetStore WAR File:** The packaged jPetStore application.
    * Place the `jpetstore.war` file in the `$CATALINA_HOME/webapps` directory.

## Tomcat Setup on Windows 🪟

1. **JDK Installation and Configuration:** Java Development Kit (JDK) is required to run Tomcat.
    * Install either JDK 17 or 21. You can download it from: [https://adoptium.net/](https://adoptium.net/) (Recommended) or [https://www.oracle.com/java/technologies/downloads/](https://www.oracle.com/java/technologies/downloads/)
    * Set the `JAVA_HOME` environment variable:
        * Open the Start Menu and search for "Environment Variables".
        * Click on "Edit the system environment variables".
        * Click "Environment Variables...".
        * Under "System variables", click "New..." and add:
            * Variable name: `JAVA_HOME`
            * Variable value:  (The path to your JDK installation directory, e.g., `C:\Program Files\Java\jdk-17.0.8`)
        * Click "OK" on all dialog boxes.

2. **CATALINA_HOME Setup (If not already done):**
    * If you haven't already defined `CATALINA_HOME`, follow the same procedure as with `JAVA_HOME`:
        * Variable name: `CATALINA_HOME`
        * Variable value: (The path to your Tomcat installation directory, e.g., `C:\apache-tomcat-9.0.100`)

3. **Add to PATH:** Add the JDK and Tomcat bin directories to the `PATH` environment variable.
    * Edit the `PATH` variable (same procedure as above).
    * Add these two entries (if they don't exist):
        * `%JAVA_HOME%\bin`
        * `%CATALINA_HOME%\bin`
    * Click "OK" on all dialog boxes.

4. **Running Tomcat:**
    * Open a new command prompt (cmd.exe).
    * Navigate to the Tomcat bin directory: `cd %CATALINA_HOME%\bin`
    * Start Tomcat: `startup.bat`

5. **Accessing Tomcat Manager:**
    * Open your web browser and go to: `http://localhost:8080/manager/html`
    * You'll be prompted for a username and password.  These are **not** your database credentials. You need to configure them in the `tomcat-users.xml` file.

6. **Configuring Tomcat Manager Users:**
    * Open the `$CATALINA_HOME/conf/tomcat-users.xml` file in a text editor.
    * Add a user within the `<tomcat-users>` tags, like this (replace with your desired username and password):

    ```xml
    <tomcat-users>
        <user username="your_db_user" password="your_db_password" roles="manager-gui,admin-gui"/>
    </tomcat-users>
    ```

    * **Important:**  Replace `your_db_user` and `your_db_password` with the credentials you want to use to access the Tomcat Manager.  These are separate from your database credentials.
    * Save the `tomcat-users.xml` file.
    * **Restart Tomcat:** Stop Tomcat (`shutdown.bat` in the Tomcat bin directory) and start it again (`startup.bat`) for the changes to take effect.

Now you should be able to access the Tomcat Manager using the username and password you configured.  You are ready to deploy your jPetstore application and then run your JMeter performance tests.
