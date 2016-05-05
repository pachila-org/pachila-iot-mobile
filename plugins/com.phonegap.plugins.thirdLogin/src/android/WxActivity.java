
package com.phonegap.plugins.thirdLogin;



import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;

import android.util.Log;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.tencent.mm.sdk.modelmsg.SendAuth;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.WXAPIFactory;

@SuppressLint("ShowToast")
public class WxActivity extends Activity {
    

	public static String WX_APP_ID = "wx886566806aba6f3c";

	public static String WX_SECRET = "f4e253c7a554d681612ef0808a7aa277";
	
	public static String WX_CODE ="";
	
	public static String UID ="";
	public static String ACCESSTOKEN ="";
	public static String NICKNAME="";
	public static String AVATAR = "";

	
	public static IWXAPI wxApi;
	public static boolean isWXLogin = false;

	private Handler handler = new Handler() {  
        public void handleMessage(Message msg) {  
            switch (msg.what) {  
            case 0:  
                System.out.println("test");  
                Intent intent = new Intent();
                intent.putExtra("ACCESSTOKEN", ACCESSTOKEN);
                intent.putExtra("UID", UID);
                intent.putExtra("NICKNAME",NICKNAME);
                intent.putExtra("AVATAR", AVATAR);
                setResult(RESULT_OK, intent);
                finish();
                break;  
            }  
        };  
    };

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		wxApi = WXAPIFactory.createWXAPI(this, WX_APP_ID, true);
		wxApi.registerApp(WX_APP_ID);

		SendAuth.Req req = new SendAuth.Req();
		req.scope = "snsapi_userinfo";
		req.state = "wechat_sdk_demo";
		wxApi.sendReq(req);		
	}
	
	@Override
	protected void onResume() {
		super.onResume();
		if (isWXLogin) {
			loadWXUserInfo();
		}
	}
	
	private void loadWXUserInfo() {
		
		new Thread() {  
            @Override  
            public void run() {  
                // TODO Auto-generated method stub  
                super.run();  
                Log.e(" ----->code", WX_CODE);
                String accessTokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + WX_APP_ID + "&secret=" + WX_SECRET + "&code=" + WX_CODE + "&grant_type=authorization_code";
				String tokenResult = HttpUtil.httpsGet(accessTokenUrl);
				
				if (null != tokenResult) {
					JSONObject tokenObj = JSON.parseObject(tokenResult);
					String accessToken = tokenObj.getString("access_token");
					String openId = tokenObj.getString("openid");
					String unionId = tokenObj.getString("unionid");
					UID = unionId;
					ACCESSTOKEN = accessToken;
					String infoUrl = "https://api.weixin.qq.com/sns/userinfo?access_token="
						    + accessToken +"&openid=" + openId;
					String infoResult = HttpUtil.httpsGet(infoUrl);
					Log.e("info", infoResult);
					JSONObject infoObj = JSON.parseObject(infoResult);
					String nickname = infoObj.getString("nickname");
					String headimageUrl = infoObj.getString("headimgurl");
//					Bitmap avatar = HttpUtil.getBitmap(headimageUrl);
//					String avatarStr = HttpUtil.bitmapToString(avatar);
					Log.e("nickname", "------->" + nickname);
					NICKNAME = nickname;
					AVATAR = headimageUrl;
				}
				
                Message msg = handler.obtainMessage();  
                msg.what = 0;  
                handler.sendMessage(msg);  
            }  
        }.start(); 
		isWXLogin = false;
	}	
}
	

	
	


	