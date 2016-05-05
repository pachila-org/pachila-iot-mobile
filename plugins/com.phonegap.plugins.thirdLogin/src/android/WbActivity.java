package com.phonegap.plugins.thirdLogin;

import com.sina.weibo.sdk.auth.AuthInfo;
import com.sina.weibo.sdk.auth.Oauth2AccessToken;
import com.sina.weibo.sdk.auth.WeiboAuthListener;
import com.sina.weibo.sdk.auth.sso.SsoHandler;
import com.sina.weibo.sdk.exception.WeiboException;
import com.sina.weibo.sdk.net.RequestListener;


import com.sina.weibo.sdk.openapi.UsersAPI;
import com.sina.weibo.sdk.openapi.models.User;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.util.Log;


public class WbActivity extends Activity {
	public static final String TAG = "WeiboLogin";
	public static final String WEIBO_APP_KEY = "2635899579";
	public static final String WEIBO_REDIRECT_URL = "https://api.weibo.com/oauth2/default.html";
	public static final String WEIBO_SCOPE = "email,direct_messages_read,direct_messages_write,"
			+ "friendships_groups_read,friendships_groups_write,statuses_to_me_read,"
			+ "follow_app_official_microblog";
	private AuthInfo mAuthInfo;
	private SsoHandler mSsoHandler;
	private Oauth2AccessToken mAccessToken;
	UsersAPI mUsersAPI;
	String token, avatar_url, user_name;
	Bitmap avatar;
	long uid;
	
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		mAuthInfo = new AuthInfo(WbActivity.this, WEIBO_APP_KEY,
				WEIBO_REDIRECT_URL, WEIBO_SCOPE);
		mSsoHandler = new SsoHandler(WbActivity.this, mAuthInfo);
		Log.e("tag", "-------------->weiboclicked");
		mSsoHandler.authorize(new AuthListener());
	}
	// 当 微博SSO 授权 Activity 退出时，该函数被调用。

	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent data) {
		super.onActivityResult(requestCode, resultCode, data);
		Log.e("tag", "--------------->");
		// SSO 授权回调
		// 重要：发起 SSO 登陆的 Activity 必须重写 onActivityResults
		if (mSsoHandler != null) {
		    Log.e("tag", "-----------> + onActivityResult mSsoHandler");
			mSsoHandler.authorizeCallBack(requestCode, resultCode, data);
		}

	}

	// 微博登录回调函数
	class AuthListener implements WeiboAuthListener {

		@Override
		public void onComplete(Bundle values) {
			// 从 Bundle 中解析 Token

			mAccessToken = Oauth2AccessToken.parseAccessToken(values);
            token = values.getString("access_token");
			Log.e("tag", "--------->token" + token);
			uid = Long.parseLong(mAccessToken.getUid());
			Log.e("tag", "----------->user_id" + uid);
			mUsersAPI = new UsersAPI(WbActivity.this, WEIBO_APP_KEY,
					mAccessToken);
			mUsersAPI.show(uid, new SinaRequestListener());
			if (mAccessToken.isSessionValid()) {
			} else {
				// 以下几种情况，您会收到 Code：
				// 1. 当您未在平台上注册的应用程序的包名与签名时；
				// 2. 当您注册的应用程序包名与签名不正确时；
				// 3. 当您在平台上注册的包名和签名与您当前测试的应用的包名和签名不匹配时。
				String code = values.getString("code");
				Log.i("tag", "----------------->wrong code" + code);
			}
		}

		@Override
		public void onCancel() {
			finish();
		}

		@Override
		public void onWeiboException(WeiboException e) {
			Log.i("tag", "------------>exception" + e.getMessage());
			finish();
		}
	}

	// 微博用户信息
	private class SinaRequestListener implements RequestListener {

		@Override
		public void onComplete(String response) {
			try {
				Log.e(TAG, "response" + response);
				User user = User.parse(response);
				if (user != null) {
					user_name = user.screen_name;
					// Storage.put4prefs(context, "loginName", user_name);
					avatar_url = user.avatar_hd;
//					new Thread(new Runnable() {
//						
//						@Override
//						public void run() {
//							// TODO Auto-generated method stub
//							avatar = HttpUtil.getBitmap(avatar_url);
//			                Intent intent = new Intent();
//			                intent.putExtra("ACCESSTOKEN", token);
//			                intent.putExtra("UID", "" + uid);
//			                intent.putExtra("NICKNAME",user_name);
//			                intent.putExtra("AVATAR", HttpUtil.bitmapToString(avatar));
//			                setResult(RESULT_OK, intent);
//			                finish();
//						}
//					}).start();
	                Intent intent = new Intent();
	                intent.putExtra("ACCESSTOKEN", token);
	                intent.putExtra("UID", "" + uid);
	                intent.putExtra("NICKNAME",user_name);
	                intent.putExtra("AVATAR", avatar_url);
	                setResult(RESULT_OK, intent);
	                finish();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		@Override
		public void onWeiboException(WeiboException e) {
			e.printStackTrace();
		}
	}	
	
}
