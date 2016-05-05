
package com.pachila.pcl.wxapi;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.tencent.mm.sdk.modelbase.BaseReq;
import com.tencent.mm.sdk.modelbase.BaseResp;
import com.tencent.mm.sdk.modelmsg.SendAuth;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.sdk.openapi.WXAPIFactory;
import com.phonegap.plugins.thirdLogin.WxActivity;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler{  
	public static String WX_APP_ID = "wx886566806aba6f3c";
	public static String WX_SECRET = "f4e253c7a554d681612ef0808a7aa277";
     
    @Override  
    protected void onCreate(Bundle savedInstanceState) {  
        // TODO Auto-generated method stub  
        super.onCreate(savedInstanceState);  
         
        WxActivity.wxApi = WXAPIFactory.createWXAPI(this, WX_APP_ID , false);  
        WxActivity.wxApi.handleIntent(getIntent(), this);  
    }  
      
    @Override  
    public void onReq(BaseReq arg0) {  
        // TODO Auto-generated method stub  
         finish(); 
    }  
  
    @Override  
    public void onResp(BaseResp resp) {  
        Bundle bundle = new Bundle();  
        switch (resp.errCode) {  
        case BaseResp.ErrCode.ERR_OK:   
          String code = ((SendAuth.Resp) resp).code;  
          Log.e("code", code);
          WxActivity.WX_CODE = code;
          WxActivity.isWXLogin=true;
          //Toast.makeText(this, "success", Toast.LENGTH_LONG).show();
            break;  
        case BaseResp.ErrCode.ERR_USER_CANCEL:
			//Toast.makeText(this, "cancel", Toast.LENGTH_LONG).show();
			break;
		case BaseResp.ErrCode.ERR_AUTH_DENIED:
			//Toast.makeText(this, "denied", Toast.LENGTH_LONG).show();
			break;
		default:
			//Toast.makeText(this, "fail", Toast.LENGTH_LONG).show();
			break;
         
        }  
        finish();  
    }  
 
	

}
