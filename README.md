# openssl-rsa-chat-app
demonstrates encryption using RSA key pairs:
- the receiver's public key is used to encrypt the message
- the receiver's private key is used to decrypt the message

if you have **git** and **python** then try it out!
```
git clone https://github.com/sabercoy/openssl-rsa-chat-app.git
cd openssl-rsa-chat-app
python main.py
```
---
first generate some keys for each side
![image](https://github.com/sabercoy/openssl-rsa-chat-app/assets/22666749/7253913b-38b6-4265-b4d7-09b1d47b3f88)

then you are able to send messages (of course, the private key would be hidden in a production setting)
![image](https://github.com/sabercoy/openssl-rsa-chat-app/assets/22666749/614b8e04-0a58-4508-818c-939b39486082)

and there it is!
![image](https://github.com/sabercoy/openssl-rsa-chat-app/assets/22666749/fc4fc129-c6d5-4e6b-9a28-021a5cc93eb2)
