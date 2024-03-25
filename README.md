# Global Rates Trading Application with Solace PubSub+
This project showcases the use of Solace PubSub+ for Global Rates Trading. The application is divided into three main components, each residing in its own folder:

 * infrastructure-scripts: This folder contains scripts for setting up the brokers and cache instance in the cloud. These scripts automate the process of spinning up necessary infrastructure for the application.

 * rates-subscription-manager: This is a Java application that leverages Solace's Subscription Manager capabilities to inject subscriptions into a user's session. It is responsible for managing the subscriptions for the market data.

 * rates-ui-and-simulator: This is a web application used for subscribing to simulated market data. It also includes a simulator for generating the market data. The UI provides a visual representation of the market data, while the simulator allows for testing and demonstration purposes.

To get started, navigate to each folder and follow the instructions in the respective README files.