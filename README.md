# jPetStore Performance Test Setup

This document outlines the steps to set up the jPetStore application environment using Apache Tomcat, MySQL, MySQL Connector/J, and the jPetStore WAR file.  This setup is a prerequisite for running JMeter performance tests (covered below as a separate document).

## 🪶 JMEter Demonstration

This JMX file, `jpetstore.jmx`, contains a performance test suite designed to stress test the jPetStore web application running locally on `http://localhost:8080/jpetstore-6.1.0`.  This test plan simulates a variety of user interactions to evaluate the application's performance under load.

The test covers all key user scenarios, including:

* User Login
* Product Search
* Adding Items to Cart
* Checkout Process

The test employs a Thread Group configured to simulate a substantial number of concurrent users to generate a realistic load.  The ramp-up period allows the load to gradually increase, preventing an abrupt spike.  The test also includes multiple iterations (loops) to capture performance data over a sustained period. *(Note: You will need to adjust the number of threads, ramp-up time, and loop count within the JMX file itself to meet your specific testing requirements.)*

The JMeter test plan utilizes a range of elements, including:

* **HTTP Request Samplers:** To simulate the various HTTP requests associated with each user scenario.
* **Thread Group:** To manage the concurrent users and control the test execution.
* **Listeners (e.g., Aggregate Report, View Results Tree):** To collect and visualize the performance metrics.
* **Assertions (e.g., Response Assertions):** To validate the correctness of the application's responses.
* **Timers (e.g., Constant Timer, Gaussian Timer):** To introduce realistic delays between requests, simulating user behavior.

### 🚀 Running JMX (for JMeter Monitoring)
---

This section describes how to monitor JMeter itself using JMX (Java Management Extensions).  This allows you to gather performance metrics and other information about JMeter's operation.
Refer to the JMeter documentation for more details. Or you can just simply run from your JMeter app.

**Prerequisites:**

*   JMeter installed.

**Steps:**

1.  **Start JMeter.** JMeter generally has JMX enabled by default. You can specify the JMX port when starting JMeter using the `-Jjmeter.rmi.port` property. For example:

    ```bash
    ./jmeter -Jjmeter.rmi.port=1099
    ```
    If you don't specify the port, JMeter will use a dynamic port.  It will print the port number to the console during startup, so you'll need to look for it there.

2.  **Launch your JMX client.** Popular options include JVisualVM, JConsole, and Mission Control.

3.  **Connect to JMeter.**  In your JMX client, connect to `localhost:<PORT>`, replacing `<PORT>` with the port JMeter is using. If you specified a port with `-Jjmeter.rmi.port`, use that port. Otherwise, use the port JMeter printed to the console.

4.  **Monitor JMeter.** Once connected, you can browse the MBeans exposed by JMeter to monitor various metrics, such as active threads, requests per second, and resource utilization.  Look for MBeans under the `jmeter` domain.

**Example (using JVisualVM):**

1.  Start JMeter with `-Jjmeter.rmi.port=1099`.
2.  Open JVisualVM.
3.  In JVisualVM, go to "File" -> "Add JMX Connection...".
4.  Enter `localhost:1099` and click "OK".
5.  You should now see JMeter in the JVisualVM "Applications" list. Double-click it to start monitoring.

**Key JMeter MBeans:**

While the available MBeans can vary slightly between JMeter versions, some common and useful MBeans to look for include:

*   `jmeter.threads`: Provides information about thread activity.
*   `jmeter.test`: Contains general test statistics.

**Troubleshooting:**

*   **Connection refused:** Double-check that JMeter is running and that the port you're using is correct. Check for firewalls that might be blocking the connection.
*   **Cannot find JMeter in JVisualVM:**  Make sure you've added the JMX connection correctly in JVisualVM.

This test plan is intended to gather performance data related to response times, throughput, and error rates under stress, enabling identification of potential bottlenecks or areas for optimization within the jPetStore application.


## ⚠️ Warning: Before diving into the Database Management
- Since i used MySQL just today after decades, some instructions may be unclear about SQL management. I was able to connect DB but i was not able to update my database from web app changes. Since this test doesnt rely on the database, you can easily skip database parts.
i will mark unnecessary lines with ℹ️ 

## Dependencies 📦

1. **Apache Tomcat 9.0.100:**  The web server environment.
    * Download: [https://archive.apache.org/dist/tomcat/tomcat-9/v9.0.100/bin/apache-tomcat-9.0.100-windows-x64.zip](https://archive.apache.org/dist/tomcat/tomcat-9/v9.0.100/bin/apache-tomcat-9.0.100-windows-x64.zip) 
    * Extract the zip file to your desired location (e.g., `C:\apache-tomcat-9.0.100`).  We'll refer to this as `$CATALINA_HOME` from now on.

2. ℹ️ **MySQL Community Edition:** The database server.
    * Download: [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/) (Download and install the appropriate version for your operating system.)
    * After installation, create a database named `jpetstore`. You can use MySQL Workbench or the command line for this.

3. ℹ️ **MySQL Connector/J 8.2.0:** The JDBC driver for connecting to the MySQL database.
    * Download: [https://dev.mysql.com/downloads/connector/j/](https://dev.mysql.com/downloads/connector/j/) (Choose the platform-independent "Platform Independent" version as a `.zip` or `.tar.gz` and extract it)
    * Copy the `mysql-connector-j-8.2.0.jar` (or similar file name depending on the downloaded version) from the extracted folder to `$CATALINA_HOME/lib`.

4. **jPetStore WAR File:** The packaged jPetStore application.
    * Place the `jpetstore.war` file in the `$CATALINA_HOME/webapps` directory.  This will create a `jpetstore-6.1.0` (or similar) directory under `webapps` when Tomcat starts.

## Tomcat Setup on Windows 🪟

1. ℹ️ **MySQL Database Setup:**
    * Start your MySQL server.
    * Import the database schema:
        * Open a MySQL client (e.g., MySQL Workbench or the command line).
        * Connect to your MySQL server.
        * Execute the SQL script:  `source C:\apache-tomcat-9.0.100\webapps\jpetstore-6.1.0\WEB-INF\classes\database\jpetstore-hsqldb-schema.sql;`  (Adjust the path if your jpetstore version is different). This will create the necessary tables in the `jpetstore` database.  Note: This script is originally for HSQLDB, but it is compatible with MySQL for the basic JPetstore schema.

2. **JDK Installation and Configuration:** Java Development Kit (JDK) is required to run Tomcat.
    * Install either JDK 17 or 21. You can download it from: [https://adoptium.net/](https://adoptium.net/) (Recommended) or [https://www.oracle.com/java/technologies/downloads/](https://www.oracle.com/java/technologies/downloads/)
    * Set the `JAVA_HOME` environment variable:
        * Open the Start Menu and search for "Environment Variables".
        * Click on "Edit the system environment variables".
        * Click "Environment Variables...".
        * Under "System variables", click "New..." and add:
            * Variable name: `JAVA_HOME`
            * Variable value:  (The path to your JDK installation directory, e.g., `C:\Program Files\Java\jdk-17.0.8`)
        * Click "OK" on all dialog boxes.

3. **CATALINA_HOME Setup (If not already done):**
    * If you haven't already defined `CATALINA_HOME`, follow the same procedure as with `JAVA_HOME`:
        * Variable name: `CATALINA_HOME`
        * Variable value: (The path to your Tomcat installation directory, e.g., `C:\apache-tomcat-9.0.100`)

4. **Add to PATH:** Add the JDK and Tomcat bin directories to the `PATH` environment variable.
    * Edit the `PATH` variable (same procedure as above).
    * Add these two entries (if they don't exist):
        * `%JAVA_HOME%\bin`
        * `%CATALINA_HOME%\bin`
    * Click "OK" on all dialog boxes.

5. ℹ️ **Configure Database Connection in `applicationContext.xml`:**
    * Edit the `applicationContext.xml` file located at `C:\apache-tomcat-9.0.100\webapps\jpetstore-6.1.0\WEB-INF\applicationContext.xml`.
    * Add the following bean definition within the `<beans>` tags, replacing `your_db_username` and `your_db_pass` with your actual MySQL username and password:

    ```xml
    <bean id="dataSource" class="org.apache.commons.dbcp2.BasicDataSource">
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://localhost:3306/jpetstore?useSSL=false&serverTimezone=UTC"/>
        <property name="username" value="your_db_username"/>
        <property name="password" value="your_db_pass"/>
        <property name="initialSize" value="5"/>
        <property name="maxTotal" value="100"/>
    </bean>
    ```

6. **Running Tomcat:**
    * Open a new command prompt (cmd.exe).
    * Navigate to the Tomcat bin directory: `cd C:\apache-tomcat-9.0.100\bin`
    * Start Tomcat: `startup.bat`

7. **Accessing Tomcat Manager:**
    * Open your web browser and go to: `http://localhost:8080/manager/html`
    * You'll be prompted for a username and password.  These are **not** your database credentials. You need to configure them in the `tomcat-users.xml` file.

8. **Configuring Tomcat Manager Users:**
    * Open the `C:\apache-tomcat-9.0.100\conf\tomcat-users.xml` file in a text editor.
    * Add a user within the `<tomcat-users>` tags, like this (replace with your desired username and password):

    ```xml
    <tomcat-users>
        <user username="your_tomcat_manager_user" password="your_tomcat_manager_password" roles="manager-gui,admin-gui"/>
    </tomcat-users>
    ```

    * **Important:**  Replace `your_tomcat_manager_user` and `your_tomcat_manager_password` with the credentials you want to use to access the Tomcat Manager.  These are separate from your database credentials.
    * Save the `tomcat-users.xml` file.
    * **Restart Tomcat:** Stop Tomcat (`shutdown.bat` in the Tomcat bin directory) and start it again (`startup.bat`) for the changes to take effect.

## 🏃‍♂️Running App 
- Go to the `http:localhost:8080/jpetstore-6.1.0` to see the actual site.

Now you should be able to access the Tomcat Manager and the jPetStore application should be running and connected to your MySQL database.  You are ready to run your JMeter performance tests.

## 📜 License
This project is licensed under the [Apache License.](LICENSE) See the LICENSE file for details.

## 🙌 Contributing
Feel free to open issues or submit pull requests for improvements. Contributions are welcome!
