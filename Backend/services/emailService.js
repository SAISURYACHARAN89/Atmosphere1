const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const getSESClient = () => {
    const config = {
        region: process.env.AWS_SES_REGION || process.env.AWS_REGION || 'ap-south-1',
    };

    // Use separate SES credentials if provided
    if (process.env.AWS_SES_ACCESS_KEY_ID && process.env.AWS_SES_SECRET_ACCESS_KEY) {
        config.credentials = {
            accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
        };
        console.log('Using dedicated SES credentials');
    } else {
        console.log('Using default AWS credential chain for SES');
    }

    return new SESClient(config);
};

const sesClient = getSESClient();

const sendEmail = async (to, subject, html) => {
    if (process.env.OTP_MODE === 'dev') {
        console.log('DEV MODE EMAIL:', { to, subject, html });
        return;
    }

    const params = {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: Array.isArray(to) ? to : [to],
        },
        Message: {
            Subject: { Data: subject, Charset: 'UTF-8' },
            Body: {
                Html: { Data: html, Charset: 'UTF-8' },
            },
        },
    };

    return sesClient.send(new SendEmailCommand(params));
};

module.exports = { sendEmail };
