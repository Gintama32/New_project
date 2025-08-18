declare module 'nodemailer' {
    interface TransportOptions {
        service: string;
        auth: {
            user: string;
            pass: string;
        };
    }

    interface SendMailOptions {
        from: string;
        to: string;
        subject: string;
        html: string;
    }

    interface Transporter {
        sendMail(options: SendMailOptions): Promise<any>;
    }

    function createTransport(options: TransportOptions): Transporter;

    export { createTransport, Transporter, TransportOptions, SendMailOptions };
    export default { createTransport };
}
