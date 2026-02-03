package com.example.ProyectoSpringBoot.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.util.Base64;

// Converter JPA para encriptar campos sensibles con AES-GCM
@Converter
@Component
public class EncriptadorAES implements AttributeConverter<String, String> {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128;
    private static String secretKey;

    @Value("${app.encryption.secret-key}")
    public void setSecretKey(String key) {
        EncriptadorAES.secretKey = key;
    }

    private static String getSecretKey() {
        return secretKey != null ? secretKey : "SaaSPlatform2026!";
    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null || attribute.isEmpty()) return attribute;
        try {
            return encrypt(attribute);
        } catch (Exception e) {
            throw new RuntimeException("Error al encriptar", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) return dbData;
        try {
            return decrypt(dbData);
        } catch (Exception e) {
            throw new RuntimeException("Error al desencriptar", e);
        }
    }

    public static String encrypt(String plainText) throws Exception {
        byte[] keyBytes = ajustarClave(getSecretKey());
        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
        byte[] iv = new byte[GCM_IV_LENGTH];
        new SecureRandom().nextBytes(iv);
        GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, keySpec, gcmSpec);
        byte[] encrypted = cipher.doFinal(plainText.getBytes("UTF-8"));
        ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + encrypted.length);
        byteBuffer.put(iv);
        byteBuffer.put(encrypted);
        return Base64.getEncoder().encodeToString(byteBuffer.array());
    }

    public static String decrypt(String encryptedText) throws Exception {
        byte[] decoded = Base64.getDecoder().decode(encryptedText);
        ByteBuffer byteBuffer = ByteBuffer.wrap(decoded);
        byte[] iv = new byte[GCM_IV_LENGTH];
        byteBuffer.get(iv);
        byte[] encrypted = new byte[byteBuffer.remaining()];
        byteBuffer.get(encrypted);
        byte[] keyBytes = ajustarClave(getSecretKey());
        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
        GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, keySpec, gcmSpec);
        return new String(cipher.doFinal(encrypted), "UTF-8");
    }

    private static byte[] ajustarClave(String clave) {
        byte[] keyBytes = new byte[16];
        byte[] claveBytes = clave.getBytes();
        System.arraycopy(claveBytes, 0, keyBytes, 0, Math.min(claveBytes.length, 16));
        return keyBytes;
    }
}
