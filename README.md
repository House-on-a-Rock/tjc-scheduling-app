# rn-first-app-calendar

## How to Run for MacOS

1. On root directory, create `secrets` directory and insert `secrets.js`
2. Run `npm run set_mac_env.sh`, this will create a `.env` file.
3. Copy your `SECRET_IP` from the `.env` file
4. Replace your `.env` file with the one in `#documentation` discord channel, except replace the `SECRET_IP` with value from the previous step. If missing `SECRET_HASH`, add that as well
5. On root directory, add `tjcschedule.pem` and `tjcschedule_pub.pem` jwt public/private key files from `#documentation` discord channel
6. Run `npm i`
7. Run `npm run seed2`
8. Run `npm run server`
