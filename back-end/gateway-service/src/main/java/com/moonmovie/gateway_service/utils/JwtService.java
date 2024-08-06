package com.moonmovie.gateway_service.utils;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.stereotype.Service;

import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.text.ParseException;
import java.util.Base64;

@Service
public class JwtService {
    private static final String PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\n" +
            "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsKKvIPNecREo3wKjY/7z\n" +
            "nWCEbcnNqyA072T03uFIGE/clXXUd9FmikUm04MRFP6xQN6VlEFzYWpLg2/fjMUh\n" +
            "iTgX12b+sbrD/ospa94pEB6/9vdNZA5GGORFXJ6MP74Kxo1PE7NO7LX1a3RCmJh5\n" +
            "g1yVskLP+8k5A5IB5eJkSVtaZh74zDh6F/B5SQtQ2ptxX/l2MSKRojQ7AcC3m45J\n" +
            "43YXH25ut7eqPLxmAt2c37ZdY6u4xkRPmQD/Rm3WPzdwOdITt6cGiIaw2GIjMmFX\n" +
            "nAdURG1M3KtwfxQL/TAdZ5NOsJyJtQCSj6j93zLUTQAtM2UHVh3XKjkX9beeHJIe\n" +
            "VwIDAQAB\n" +
            "-----END PUBLIC KEY-----\n";

    private static RSAPublicKey getPublicKey(String key) throws NoSuchAlgorithmException, InvalidKeySpecException {
        // Remove the "BEGIN" and "END" lines, as well as any surrounding whitespace
        String publicKeyPEM = key.replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");

        // Decode the Base64 string
        byte[] encoded = Base64.getDecoder().decode(publicKeyPEM);

        // Create the public key
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(encoded);
        return (RSAPublicKey) keyFactory.generatePublic(keySpec);
    }

    public boolean validateToken(String token) {
        try {
            RSAPublicKey publicKey = getPublicKey(PUBLIC_KEY);
            SignedJWT signedJWT = SignedJWT.parse(token);

            // Verify the token
            RSASSAVerifier verifier = new RSASSAVerifier(publicKey);
            return signedJWT.verify(verifier);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public JWTClaimsSet getClaims(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet();
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }
}