package com.phonegap.plugins.thirdLogin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.AlertDialog.Builder;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ProgressBar;

import com.tencent.connect.UserInfo;
import com.tencent.connect.auth.QQToken;
import com.tencent.tauth.IUiListener;
import com.tencent.tauth.Tencent;
import com.tencent.tauth.UiError;

/**
 * This class echoes a string called from JavaScript.
 */
public class ThirdLogin extends CordovaPlugin {
	public static final String TAG = "ThirdLogin";
	public static final String APPID = "1105314802";
	private Tencent mTencent = null;

	public static final int REQUEST_CODE = 0x0ba7c0de;

	private static final String QQLOGIN_INTENT = "com.phonegap.plugins.thirdLogin.QQLOGIN";
	private static final String WXLOGIN_INTENT = "com.phonegap.plugins.thirdLogin.WXLOGIN";
	private static final String JDLOGIN_INTENT = "com.phonegap.plugins.thirdLogin.JDLOGIN";
	private static final String WBLOGIN_INTENT = "com.phonegap.plugins.thirdLogin.WBLOGIN";
	private static final String TOKEN = "accesstoken";
	private static final String UID = "uid";
	private static final String NICKNAME = "nickname";
	private static final String AVATAR = "avatar";

	private CallbackContext callbackContext;

	/**
	 * Constructor.
	 */
	public ThirdLogin() {
	}

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		this.callbackContext = callbackContext;
		if (action.equals("qqLogin")) {
//			// qq();
			ssoLogin();
			return true;

		}
		if (action.equals("wxLogin")) {
			wx();
			return true;
		}
		if (action.equals("jdLogin")) {
			jd();
			return true;
		}
		if (action.equals("wbLogin")) {
			wb();
			return true;
		}
		return false;
	}
	
	

	public void qq() {
		Intent intentLogin = new Intent(QQLOGIN_INTENT);
		intentLogin.addCategory(Intent.CATEGORY_DEFAULT);
		// avoid calling other phonegap apps
		intentLogin.setPackage(this.cordova.getActivity()
				.getApplicationContext().getPackageName());
		this.cordova.startActivityForResult((CordovaPlugin) this, intentLogin,
				REQUEST_CODE);
	}

	public void wx() {
		Intent intentLogin = new Intent(WXLOGIN_INTENT);
		intentLogin.addCategory(Intent.CATEGORY_DEFAULT);
		// avoid calling other phonegap apps
		intentLogin.setPackage(this.cordova.getActivity()
				.getApplicationContext().getPackageName());
		this.cordova.startActivityForResult((CordovaPlugin) this, intentLogin,
				REQUEST_CODE);
	}

	public void jd() {
		Intent intentLogin = new Intent(JDLOGIN_INTENT);
		intentLogin.addCategory(Intent.CATEGORY_DEFAULT);
		// avoid calling other phonegap apps
		intentLogin.setPackage(this.cordova.getActivity()
				.getApplicationContext().getPackageName());

		this.cordova.startActivityForResult((CordovaPlugin) this, intentLogin,
				REQUEST_CODE);
	}

	public void wb() {
		Intent intentLogin = new Intent(WBLOGIN_INTENT);
		intentLogin.addCategory(Intent.CATEGORY_DEFAULT);
		// avoid calling other phonegap apps
		intentLogin.setPackage(this.cordova.getActivity()
				.getApplicationContext().getPackageName());
		this.cordova.startActivityForResult((CordovaPlugin) this, intentLogin,
				REQUEST_CODE);
	}

	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent intent) {
		if (requestCode == REQUEST_CODE) {
			if (resultCode == Activity.RESULT_OK) {
				JSONObject obj = new JSONObject();
				try {
					obj.put(TOKEN, intent.getStringExtra("ACCESSTOKEN"));
					obj.put(UID, intent.getStringExtra("UID"));
					obj.put(NICKNAME, intent.getStringExtra("NICKNAME"));
					obj.put(AVATAR, intent.getStringExtra("AVATAR"));
					this.callbackContext.success(obj);
					Log.e(TAG, obj.toString());
				} catch (JSONException e) {
					this.callbackContext.error("JSONException error");
				}
				this.callbackContext.success(obj);
			} else if (resultCode == Activity.RESULT_CANCELED) {
				JSONObject obj = new JSONObject();
				this.callbackContext.success(obj);
			} else {
				this.callbackContext.error("Unexpected error");
			}
		}
	}

	//
	public void ssoLogin() {

		final Activity activity = this.cordova.getActivity();

		Context context = this.cordova.getActivity().getApplicationContext();
		mTencent = Tencent.createInstance(APPID, context);

		final IUiListener listener = new BaseUiListener() {
			@Override
			protected void doComplete(JSONObject values) {

			}

		};

		this.cordova.getActivity().runOnUiThread(new Runnable() {
			@Override
			public void run() {
				mTencent.login(activity, "all", listener);
			}
		});

	}

	//
	private class BaseUiListener implements IUiListener {
		String uid;
		String token;
		String nickname;
		String avatarUrl;

		public String getUid() {
			return uid;
		}

		public String getToken() {
			return token;
		}

		@Override
		public void onComplete(Object response) {
			uid = mTencent.getOpenId();
			token = mTencent.getAccessToken();
			Log.e("uid", uid);
			Log.e("token", token);
			final QQToken qqToken = mTencent.getQQToken();
			UserInfo info = new UserInfo(ThirdLogin.this.cordova.getActivity(),
					qqToken);
			info.getUserInfo(new IUiListener() {

				@Override
				public void onError(UiError arg0) {
					// TODO Auto-generated method stub

				}

				@Override
				public void onComplete(Object response) {
					// TODO Auto-generated method stu
					JSONObject responseJsonObject = (JSONObject) response;
					Log.e(TAG, response.toString());
					nickname = responseJsonObject.optString("nickname");
					avatarUrl = responseJsonObject.optString("figureurl_qq_2");
//					new Thread(new Runnable() {
//						
//						@Override
//						public void run() {
//							// TODO Auto-generated method stub
//							Bitmap avatar = HttpUtil.getBitmap(avatarUrl);
//							JSONObject res = new JSONObject();
//							try {
//								res.put(UID, uid);
//								res.put(TOKEN, token);
//								res.put(NICKNAME, nickname);
//								res.put(AVATAR, HttpUtil.bitmapToString(avatar));
//								callbackContext.success(res);
////								Log.e(TAG, res.toString());
//							} catch (JSONException e) {
//								// TODO Auto-generated catch block
//								e.printStackTrace();
//							}
//						}
//					}).start();
					JSONObject res = new JSONObject();
					try {
						res.put(UID, uid);
						res.put(TOKEN, token);
						res.put(NICKNAME, nickname);
						res.put(AVATAR, avatarUrl);
						callbackContext.success(res);
						Log.e(TAG, res.toString());
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}

				@Override
				public void onCancel() {
					// TODO Auto-generated method stub

				}
			});
		}

		protected void doComplete(JSONObject values) {

		}

		@Override
		public void onError(UiError e) {
			callbackContext.error(0);

		}

		@Override
		public void onCancel() {

			callbackContext.error(0);

		}

	}
	
}