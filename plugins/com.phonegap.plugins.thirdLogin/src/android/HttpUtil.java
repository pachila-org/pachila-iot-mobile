package com.phonegap.plugins.thirdLogin;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.commons.httpclient.protocol.Protocol;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

public class HttpUtil {

	private HttpUtil(){}
	
	public static String httpsGet(String url){
		HttpClient client = new HttpClient();
		Protocol myhttps = new Protocol("https", new MySSLProtocolSocketFactory(), 443);
		Protocol.registerProtocol("https", myhttps);
		GetMethod getMethod = new GetMethod(url);
		getMethod.setFollowRedirects(true);
		getMethod.addRequestHeader("Content-Type","text/html;charset=UTF-8"); 
		HttpMethodParams params = new HttpMethodParams();
		params.setContentCharset("UTF-8");
		getMethod.setParams(params);
		try {
			client.executeMethod(getMethod);
			return getMethod.getResponseBodyAsString();
		} catch (HttpException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static Bitmap getBitmap(String imageUri){
		Bitmap bitmap = null;
		try {
			URL downUrl = new URL(imageUri);
			HttpURLConnection conn = (HttpURLConnection) downUrl.openConnection();
			conn.connect();
			InputStream is = conn.getInputStream();
			bitmap = BitmapFactory.decodeStream(is);
			is.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return bitmap;
	}
	
	public static String bitmapToString(Bitmap bitmap){
		String outputStr = null;
		ByteArrayOutputStream stream = new ByteArrayOutputStream();
		bitmap.compress(Bitmap.CompressFormat.JPEG, 75, stream);
		byte[] code = stream.toByteArray();
        byte[] output = Base64.encode(code, Base64.NO_WRAP);
        outputStr = new String(output);
		return outputStr;
	}
	
}
