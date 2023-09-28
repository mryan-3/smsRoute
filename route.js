const express = require('express');
const router = express.Router();
const axios = require('axios')

const credentials = {
    apiKey: '21aa8f1bea678070a5a15fadc1d8c531b7a214b2f6ad7130245e0ff67f156473',         // use your sandbox app API key for development in the test environment
    username: 'sandbox',      // use 'sandbox' for development in the test environment
};


const AfricasTalking = require('africastalking')(credentials);
const sms = AfricasTalking.SMS;

const voice = AfricasTalking.VOICE;
async function sendSMS(message, to) {
    try {
        const response = await axios.post('https://edu-hub-sms-service-1.vercel.app/send', {
            recepients: to,
            message,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// USSD route
router.post('/ussd', (req, res) => {
    const { text } = req.body;

    // Handle USSD requests asynchronously
    async function handleUSSD() {
        if (text === '') {
            // This is the first request. Present the menu.
            const response = `CON What would you like to check
            1. Send SMS
            2. Make a Voice Call`;
            res.set('Content-Type', 'text/plain');
            res.send(response);
        } else if (text === '1') {
            // User chose SMS, so send an SMS
            try {
                const smsResponse = await sendSMS(
                    "I'm a lumberjack and it's ok, I work all night and sleep all day",
                    ['+254743413621']  // Replace with the recipient's phone number
                );

                console.log(smsResponse);

                const response = `END SMS sent successfully.`;
                res.set('Content-Type', 'text/plain');
                res.send(response);
            } catch (error) {
                console.error(error);
                const errorMessage = `END Failed to send SMS. Please try again later.`;
                res.set('Content-Type', 'text/plain');
                res.send(errorMessage);
            }
        } else if (text === '2') {
            // User chose Voice, so initiate a voice call
            const voiceOptions = {
                callFrom: '+254723349768',  // Replace with your voice call source number
                callTo: '+25743413621',    // Replace with the recipient's phone number
            };

            voice.call(voiceOptions)
                .then(response => {
                    console.log(response);
                    const voiceResponse = `END Voice call initiated successfully.`;
                    res.set('Content-Type', 'text/plain');
                    res.send(voiceResponse);
                })
                .catch(error => {
                    console.log(error);
                    const errorMessage = `END Failed to initiate voice call. Please try again later.`;
                    res.set('Content-Type', 'text/plain');
                    res.send(errorMessage);
                });
        } else {
            // Handle invalid input
            const response = `END Invalid choice. Please select 1 for SMS or 2 for Voice.`;
            res.set('Content-Type', 'text/plain');
            res.send(response);
        }
    }

    // Call the async USSD handler function
    handleUSSD();
});

module.exports = router;
