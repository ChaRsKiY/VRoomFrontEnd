import {SignInResource} from "@clerk/types";

class AuthService {
    private signIn: SignInResource | undefined;

    constructor(signIn: SignInResource | undefined) {
        this.signIn = signIn;
    }

    public async handleLogin(
        e: any,
        email: string,
        password: string,
        setError: (error: string) => void
    ) {
        e.preventDefault();
        try {
            const result = await this.signIn?.create({
                identifier: email,
                password,
            }) as any;

            if (result?.status === 'complete') {
                window.location.href = '/';
            } else {
                console.error(result);
            }
        } catch (err) {
            setError('Invalid email or password');
            console.error(err);
        }
    }

    public async handleGoogleSignIn(setError: (error: string) => void) {
        try {
            await this.signIn?.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/',
                redirectUrlComplete: '/',
            });
        } catch (err: any) {
            setError('Too many requests.');
            console.log(err.messages);
        }
    }
}

export default AuthService;