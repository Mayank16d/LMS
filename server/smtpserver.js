import { SMTPServer } from 'smtp-server';
import { simpleParser } from 'mailparser';

const server = new SMTPServer({
    authOptional: true,
    onData(stream, session, callback) {
        simpleParser(stream, {}, (err, parsed) => {
            if (err) {
                console.error('Error parsing email:', err);
            } else {
                console.log('Email received:', parsed);
            }
            callback(null, 'Message accepted');
        });
    },
    onAuth(auth, session, callback) {
        if (auth.username === 'Maynak_n' && auth.password === '123456789') {
            callback(null, { user: 'authorized_user' });
        } else {
            callback(new Error('Invalid username or password'));
        }
    }
});

server.listen(587, () => {
    console.log('SMTP server is listening on port 587');
});