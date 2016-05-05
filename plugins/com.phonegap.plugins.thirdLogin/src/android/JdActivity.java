
package com.phonegap.plugins.thirdLogin;

import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.jd.open.sdk.android.Constants;
import com.jd.open.sdk.android.JdAndroidClient;
import com.jd.open.sdk.android.JdException;
import com.jd.open.sdk.android.JdListener;
import com.jd.open.sdk.android.api.InvokeError;
import com.jd.open.sdk.android.auth.DialogError;


public class JdActivity extends Activity {

    public String TAG = getClass().getSimpleName();

    protected JdAndroidClient client = JdAndroidClient.getInstance();
    public static final String METHOD="jingdong.warecategory.get";
    
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        client.setSandBoxEnv(false);

        client.setAppKey("16AC58111113B0EF3F5FE3F96B483652");
        client.setAppSecret("c4cf07fc49a04143a8313fbb6067cbfa");

        client.authorize(JdActivity.this, null, new JdListener.DialogListener() {
        	public void onComplete(Bundle values) {
        		Log.e("token", values.toString());
        		
//        		// set SharedPreferences
//                SharedPreferences sp = getSharedPreferences("authorize",
//                        Context.MODE_PRIVATE);
//                SharedPreferences.Editor editor = sp.edit();
//                // access_token
//                editor.putString(Constants.TOKEN, values.getString(Constants.TOKEN));
//                // refresh_token
//                editor.putString(Constants.REFRESH_TOKEN,
//                        values.getString(Constants.REFRESH_TOKEN));
//                // time
//                editor.putString(Constants.EXPIRES_TIME,
//                        values.getString(Constants.EXPIRES_TIME));
//                // expires_in
//                editor.putString(Constants.EXPIRES_IN,
//                        values.getString(Constants.EXPIRES_IN));
//                editor.putString("nickname", values.getString("nickname"));
//                editor.commit();
//        		Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.defaultuser);
                Intent intent = new Intent();
                intent.putExtra("ACCESSTOKEN", values.getString(Constants.TOKEN));
                intent.putExtra("UID", values.getString("uid"));
                intent.putExtra("NICKNAME",values.getString("nickname"));
                intent.putExtra("AVATAR", "");
                Log.e("UID", ""+ values.getString("uid"));
                setResult(RESULT_OK, intent);
                finish();   
                // get accessToken
                // set intent  
        	}
        	public void onCancel() {
        		Log.i(TAG, "authoring has being canceled");
        		finish();
        	}
        	public void onError(DialogError e) {
        		Log.e(TAG, e.getMessage());
                showMessage(e.getMessage());
        	}
        	public void onJdError(JdException e) {
        		Log.e(TAG, e.getMessage());
                showMessage(e.getMessage());
        	}
        });
        

    }

    protected void showMessage(Object object) {
        Toast.makeText(this, object.toString(), Toast.LENGTH_LONG).show();
    }
}
