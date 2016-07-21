package com.piotwave.piotwave.util;

import android.os.StrictMode;

import org.json.JSONArray;
import org.json.JSONException;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.util.Scanner;

public class httpManager {
    private static final int CONNECTION_TIMEOUT = 30000;

    private static String URL_SERVER_HOST = "http://172.22.79.114";

    public static JSONArray requestWebServiceArray(String url) {

        // Horrific code. Shame on me ... TODO: Put this on async task
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);

        HttpURLConnection urlConnection = null;
        try {
            // create connection
            URL urlToRequest = new URL(URL_SERVER_HOST + url);
            urlConnection = (HttpURLConnection)urlToRequest.openConnection();
            urlConnection.setConnectTimeout(CONNECTION_TIMEOUT);
            urlConnection.setReadTimeout(CONNECTION_TIMEOUT);

            // create JSON object from content
            InputStream in = new BufferedInputStream(urlConnection.getInputStream());
            return new JSONArray(getResponseText(in));

        } catch (MalformedURLException e) {
            System.out.println(e.getMessage());
        } catch (SocketTimeoutException e) {
            System.out.println(e.getMessage());
        } catch (IOException e) {
            System.out.println(e.getMessage());
        } catch (JSONException e) {
            System.out.println(e.getMessage());
        } catch (Exception e) {
            System.out.println(e.getMessage());
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
        }

        return null;
    }

    public static String requestGet(String url) {

        // Horrific code. Shame on me ... TODO: Put this on async task
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);

        HttpURLConnection urlConnection = null;
        try {
            // create connection
            URL urlToRequest = new URL(URL_SERVER_HOST + url);
            urlConnection = (HttpURLConnection)urlToRequest.openConnection();
            urlConnection.setConnectTimeout(CONNECTION_TIMEOUT);
            urlConnection.setReadTimeout(CONNECTION_TIMEOUT);

            // create JSON object from content
            InputStream in = new BufferedInputStream(urlConnection.getInputStream());

            return in.toString();

        } catch (MalformedURLException e) {
            System.out.println(e.getMessage());
        } catch (SocketTimeoutException e) {
            System.out.println(e.getMessage());
        } catch (IOException e) {
            System.out.println(e.getMessage());
        } catch (Exception e) {
            System.out.println(e.getMessage());
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
        }
        return "";
    }


    private static String getResponseText(InputStream inStream) {
        // very nice trick from
        // http://weblogs.java.net/blog/pat/archive/2004/10/stupid_scanner_1.html
        return new Scanner(inStream).useDelimiter("\\A").next();
    }
}
