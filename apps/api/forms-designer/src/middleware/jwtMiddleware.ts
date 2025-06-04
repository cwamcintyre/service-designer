import { Request, Response, NextFunction } from 'express';

// Extend the Request interface to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksClient, { SigningKey } from 'jwks-rsa';

// Configure the JWKS client
const client = jwksClient({
    jwksUri: `${process.env.AWS_OIDC_AUTHORITY}/.well-known/jwks.json`, // Replace with your JWKS URI
});

// Function to retrieve the signing key
function getKey(header: jwt.JwtHeader, callback: (err: Error | null, signingKey?: string) => void): void {
    client.getSigningKey(header.kid as string, (err, key) => {
        if (err) {
            console.error('Error retrieving signing key:', err);
            return callback(err);
        }
        if (!key) {
            return callback(new Error('Signing key not found'));
        }
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
}

// Middleware to validate JWT
export function jwtMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    
    jwt.verify(
        token,
        getKey,
        {
            issuer: process.env.AWS_OIDC_AUTHORITY, // Replace with your issuer
        },
        (err, decoded) => {
            const decodedPayload = decoded as JwtPayload | undefined;
            if (err) {
                res.status(401).json({ error: 'Unauthorized: Invalid token' });
                return;
            }

            req.user = decodedPayload;

            next();
        }
    );
}