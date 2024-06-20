## ecdsa-node
This project is an example of using a client and server to facilitate transfers between different addresses.
By using Elliptic Curve Digital Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the associated address.

### Signature

##### Client side
We have taken private key of the user and used that key for signing the hex message that contains sender address, recipient address, amount and nonce.
nonce is used for restricting the 'Replay Attack'.

##### Server side
On server side we do not send the private key due to security concern, that's why we have sent signed message and the original hex message that will be used for recovering the account address.
After the address is retrieved, the funds can be send to the recipient address if sender has enough funds.

### Client

The client folder contains a react app using vite. To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using express. To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the depedencies 
3. Run `node index` to start the server 

The application should connect to the default server port (3042) automatically!

Hint - Use nodemon instead of node to automatically restart the server on any changes.

![pic1](https://github.com/Rahul65911/ecdsa-node/assets/94047697/94eca54a-4ca5-4e09-82f9-807d43b9976c)
